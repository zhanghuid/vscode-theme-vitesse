const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')

const CUSTOM_CSS_EXTENSION_ID = 'be5invis.vscode-custom-css'
// Open VSX has no be5invis build; it carries a mirror of the same extension.
const LOADER_IDS = [CUSTOM_CSS_EXTENSION_ID, 's-h-a-d-o-w.vscode-custom-css']
const CONFIG_SECTION = 'vscode_custom_css'
const INSTALL_COMMAND = 'extension.installCustomCSS'
const UNINSTALL_COMMAND = 'extension.uninstallCustomCSS'

// Files shipped inside this extension that get injected into the workbench.
const ASSET_FILES = ['custom/custom-vscode.css', 'custom/vscode-script.js']

const PATCH_MARKER = 'VSCODE-CUSTOM-CSS-START'
const STATE_KEY = 'appliedSignature'

function log(message) {
  console.log(`[my-theme-vitesse] ${message}`)
}

/**
 * Locate workbench.html using the documented appRoot API, which is far more
 * reliable than guessing from require.main the way custom-css has to.
 */
function locateWorkbench() {
  const appRoot = vscode.env.appRoot
  if (!appRoot)
    return null

  const base = path.join(appRoot, 'out', 'vs', 'code')
  const dirs = [
    path.join(base, 'electron-browser', 'workbench'),
    path.join(base, 'electron-browser'),
    path.join(base, 'electron-sandbox', 'workbench'),
    path.join(base, 'electron-sandbox'),
  ]
  const names = ['workbench.html', 'workbench.esm.html', 'workbench-dev.html']

  for (const dir of dirs) {
    for (const name of names) {
      const candidate = path.join(dir, name)
      if (fs.existsSync(candidate))
        return candidate
    }
  }
  return null
}

function isPatched(htmlPath) {
  try {
    return fs.readFileSync(htmlPath, 'utf-8').includes(PATCH_MARKER)
  }
  catch {
    return false
  }
}

function isWritable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.W_OK)
    return true
  }
  catch {
    return false
  }
}

function ourUrls(extensionPath) {
  return ASSET_FILES.map(file => pathToFileURL(path.join(extensionPath, file)).toString())
}

/**
 * Merge our two URLs into the user's imports list instead of replacing it, so
 * anything the user added by hand survives. Stale entries pointing at a previous
 * version of this extension are dropped.
 */
async function syncImports(extensionPath) {
  // Note: keys passed to a sectioned configuration are relative to the section,
  // so this must be 'imports', not 'vscode_custom_css.imports' (that would
  // become vscode_custom_css.vscode_custom_css.imports and fail to write).
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION)
  const existing = config.get('imports') || []
  const ours = ourUrls(extensionPath)

  // Match on our own file names, by basename. The same two files may already be
  // referenced from elsewhere — an older version of this extension, a dev
  // checkout, or the ~/.vscode/setting copy this bundle came from — and keeping
  // any of those would inject the CSS and JS twice over.
  const isOurs = url => typeof url === 'string'
    && ASSET_FILES.some(file => url.endsWith(`/${path.basename(file)}`))
  const kept = existing.filter(url => !isOurs(url))
  const next = [...kept, ...ours]

  const unchanged
    = existing.length === next.length && existing.every((url, i) => url === next[i])

  if (unchanged)
    return { urls: next, changed: false }

  await config.update('imports', next, vscode.ConfigurationTarget.Global)
  return { urls: next, changed: true }
}

function signatureOf(urls) {
  return urls.join('\n')
}

async function applyCustomCss(context, { interactive }) {
  const extensionPath = context.extensionPath
  const htmlPath = locateWorkbench()

  if (!htmlPath) {
    if (interactive)
      vscode.window.showWarningMessage('Vitesse: could not locate VS Code\'s workbench.html. Custom CSS was not applied.')
    return false
  }

  // Check the loader is actually present before touching any settings: without
  // it there is nothing to patch workbench.html, and writing imports would just
  // leave dead entries behind. Both ids are accepted — the official publisher on
  // the VS Code Marketplace, and the mirror Open VSX carries.
  const loader = LOADER_IDS.map(id => vscode.extensions.getExtension(id)).find(Boolean)
  if (!loader) {
    if (interactive)
      vscode.window.showWarningMessage(
        'Vitesse: the "Custom CSS and JS Loader" extension is not installed, so the bundled styles cannot be enabled. '
        + `Install ${LOADER_IDS.join(' or ')} and try again.`,
      )
    log('loader not installed, skipping')
    return false
  }

  const { urls, changed } = await syncImports(extensionPath)
  const signature = signatureOf(urls)
  const patched = isPatched(htmlPath)
  const lastSignature = context.globalState.get(STATE_KEY)

  // Already patched with the exact same file list: nothing to do, and no
  // spurious "restart VS Code" prompt on every launch.
  if (patched && !changed && lastSignature === signature) {
    log('already applied, skipping')
    return true
  }

  if (!isWritable(htmlPath)) {
    vscode.window.showWarningMessage(
      'Vitesse: VS Code\'s installation folder is not writable, so Custom CSS could not be enabled. '
      + 'Fix ownership of the VS Code install directory, then run "Vitesse: Apply Custom CSS and JS" again.',
    )
    return false
  }

  try {
    // custom-css owns the patching itself; reuse it rather than writing
    // workbench.html here. It prompts the user to restart when done.
    await vscode.commands.executeCommand(INSTALL_COMMAND)
    await context.globalState.update(STATE_KEY, signature)
    log('custom css applied')
    return true
  }
  catch (error) {
    vscode.window.showErrorMessage(`Vitesse: failed to apply Custom CSS — ${error && error.message ? error.message : error}`)
    return false
  }
}

async function activate(context) {
  const autoApply = vscode.workspace
    .getConfiguration('my-theme-vitesse')
    .get('autoApplyCustomCss', true)

  if (autoApply)
    await applyCustomCss(context, { interactive: false })

  context.subscriptions.push(
    vscode.commands.registerCommand('my-theme-vitesse.applyCustomCss', async () => {
      const ok = await applyCustomCss(context, { interactive: true })
      if (ok)
        vscode.window.showInformationMessage('Vitesse: Custom CSS and JS are enabled. Restart VS Code if the styles are not visible yet.')
    }),
    vscode.commands.registerCommand('my-theme-vitesse.restoreCustomCss', async () => {
      try {
        await vscode.commands.executeCommand(UNINSTALL_COMMAND)
        await context.globalState.update(STATE_KEY, undefined)
      }
      catch (error) {
        vscode.window.showErrorMessage(`Vitesse: failed to restore the workbench — ${error && error.message ? error.message : error}`)
      }
    }),
  )
}

function deactivate() {}

module.exports = { activate, deactivate }

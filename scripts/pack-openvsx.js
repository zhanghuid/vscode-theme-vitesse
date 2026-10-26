#!/usr/bin/env node
/**
 * Build a VSIX for Open VSX.
 *
 * Open VSX has no `be5invis.vscode-custom-css`, so the `extensionPack` entry that
 * resolves on the VS Code Marketplace does not resolve there. This script swaps
 * it for the mirror published under `s-h-a-d-o-w`, packs, then restores the
 * original manifest — so the repo (and anything published to the Marketplace)
 * keeps pointing at the official publisher.
 *
 * Usage: node scripts/pack-openvsx.js [--out <file>]
 */
const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const MANIFEST = path.join(ROOT, 'package.json')
const OFFICIAL = 'be5invis.vscode-custom-css'
const MIRROR = 's-h-a-d-o-w.vscode-custom-css'

function main() {
  const outIndex = process.argv.indexOf('--out')
  const original = fs.readFileSync(MANIFEST, 'utf8')
  const pkg = JSON.parse(original)

  const pack = pkg.extensionPack || []
  if (!pack.includes(OFFICIAL)) {
    console.error(`Expected extensionPack to contain ${OFFICIAL}; found ${JSON.stringify(pack)}`)
    process.exit(1)
  }

  const out = outIndex > 0
    ? path.resolve(process.argv[outIndex + 1])
    : path.join(ROOT, `my-theme-vitesse-${pkg.version}-openvsx.vsix`)

  pkg.extensionPack = pack.map(id => (id === OFFICIAL ? MIRROR : id))
  console.log(`extensionPack: ${JSON.stringify(pack)} -> ${JSON.stringify(pkg.extensionPack)}`)

  fs.writeFileSync(MANIFEST, `${JSON.stringify(pkg, null, '\t')}\n`)
  try {
    execFileSync('npx', ['vsce', 'package', '--no-dependencies', '--out', out], {
      cwd: ROOT,
      stdio: 'inherit',
    })
  }
  finally {
    // Always restore, even if packaging failed, so the repo never keeps the
    // mirror publisher in its manifest.
    fs.writeFileSync(MANIFEST, original)
    console.log('package.json restored')
  }

  console.log(`\nOpen VSX VSIX: ${out}`)
  console.log(`Publish with: npx ovsx publish "${out}" -p <token>`)
}

main()

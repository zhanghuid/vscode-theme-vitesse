<h1 align="center">Vitesse Theme for VS Code</h1>

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=huid.my-theme-vitesse" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/huid.my-theme-vitesse.svg?color=4d9375&amp;label=Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
</p>

<p align="center">
<img alt="Screen Shot 2021-03-08 at 12 32 54 AM" src="https://user-images.githubusercontent.com/11247099/110247185-ed26b380-7fa5-11eb-8fce-6c224bb6ef26.png">
<img alt="Screen Shot 2021-03-08 at 12 33 16 AM" src="https://user-images.githubusercontent.com/11247099/110247187-f1eb6780-7fa5-11eb-9258-620309e20961.png">



![截屏2024-05-30 18 22 44](https://github.com/zhanghuid/vscode-theme-vitesse/assets/12711819/31a046e0-0b51-4281-99b0-f4136b23c90f)
![截屏2024-05-30 18 22 52](https://github.com/zhanghuid/vscode-theme-vitesse/assets/12711819/b2747fc1-29ec-40c2-96e8-68a241907130)



<sub><samp>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Font | <a href="http://input.fontbureau.com/">Input Mono</a><br>
&nbsp;File Icons | <a href="https://marketplace.visualstudio.com/items?itemName=file-icons.file-icons">File Icons</a><br>
Product Icons | <a href="https://github.com/antfu/vscode-icons-carbon">Carbon</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
</p>

## Match with System

<!--eslint-skip-->

```jsonc
// .vscode/setting.json
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "Vitesse Light",
  "workbench.preferredDarkColorTheme": "Vitesse Dark",
}
```

## Bundled Custom CSS

This extension ships with [Custom CSS and JS Loader](https://github.com/be5invis/vscode-custom-css)
as an extension pack, plus two style files in [`custom/`](./custom):

- `custom/custom-vscode.css` — UI overrides (title bar, activity bar, command palette, …)
- `custom/vscode-script.js` — command palette background blur

Installing the theme installs the loader automatically. On first activation the theme
adds both files to `vscode_custom_css.imports` and enables them for you.

> **The loader patches VS Code's own `workbench.html`.** It needs write access to the
> VS Code installation directory. On macOS, grant it with:
>
> ```sh
> sudo chown -R $(whoami) "$(which code)"
> sudo chown -R $(whoami) /usr/share/code
> ```

**After every VS Code update** the patch is wiped. Just run
`Vitesse: Apply Custom CSS and JS` from the Command Palette and restart.

**To opt out**, set `"my-theme-vitesse.autoApplyCustomCss": false`, or run
`Vitesse: Restore Custom CSS and JS` to undo the patch. Existing entries in
`vscode_custom_css.imports` are preserved — only this extension's own files are managed.

If VS Code reports that its installation is corrupted, that is expected for a patched
workbench; click "Don't show again", or install
[Fix VSCode Checksums Next](https://marketplace.visualstudio.com/items?itemName=RimuruChan.vscode-fix-checksums-next).

## Code
```bash
# clone
git clone git@github.com:zhanghuid/vscode-theme-vitesse.git

# login to the vscode marketplace
vsce login your-name

# build the package
vsce package

```

## Thanks

This project is based on [vscode-theme-vitesse](https://github.com/antfu/vscode-theme-vitesse)
by [Anthony Fu](https://github.com/antfu), which in turn derives from
[Vitesse](https://github.com/antfu/vitesse). The colour definitions in
`scripts/` and the generated files in `themes/` come from that project.

The custom styling this theme ships would not be possible without
[Custom CSS and JS Loader](https://github.com/be5invis/vscode-custom-css) by
[Belleve Invis](https://typeof.net), which itself is based on
[vscode-icons](https://github.com/robertohuertasm/vscode-icons) by
Roberto Huertas. This theme declares it as an `extensionPack` dependency and
drives it through its public commands — the work of patching VS Code's
`workbench.html`, backing it up and restoring it is entirely theirs.

Thank you to both projects for making this possible.

See [NOTICE.md](./NOTICE.md) for the full third-party license texts.

## License

MIT - Copyright (c) 2020 Primer <br>
MIT - Copyright (c) 2021 Anthony Fu <br>
MIT - Copyright (c) 2024 Huid

Third-party components are listed in [NOTICE.md](./NOTICE.md).


# Third-party notices

This extension is distributed under the MIT license (see `LICENSE`). It depends
on, and interoperates with, the following third-party work.

---

## Custom CSS and JS Loader

- Extension: `be5invis.vscode-custom-css`
- Source: https://github.com/be5invis/vscode-custom-css
- Author: Belleve Invis (https://typeof.net), based on vscode-icons by
  Roberto Huertas
- License: MIT

This theme declares the loader as an `extensionPack` entry, so installing the
theme installs the loader too. It is not bundled or vendored here — the two
remain separate extensions that you can enable, disable and update
independently.

At activation this theme writes its own two files into the loader's
`vscode_custom_css.imports` setting and then invokes the loader's
`extension.installCustomCSS` command. All patching of VS Code's own
`workbench.html` — the backup, the inlining, the restore — is performed by the
loader, not by this extension.

The loader modifies files inside the VS Code installation directory and needs
write access to it. See the loader's README for the permissions required on
your platform.

### License text

```
The MIT License (MIT)

Copyright (c) 2016 Roberto Huertas
Copyright (c) 2016 Belleve Invis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## vscode-theme-vitesse

- Source: https://github.com/antfu/vscode-theme-vitesse
- Authors: Anthony Fu, Primer
- License: MIT

The colour definitions in `scripts/` and the generated files in `themes/`
derive from this project.

### License text

```
MIT License

Copyright (c) 2020 Primer
Copyright (c) 2021 Anthony Fu
```

---

## Vitesse palette

The colours themselves originate from the Vitesse theme by Anthony Fu
(https://github.com/antfu/vitesse).

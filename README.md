# ZenComPrint

A VS Code extension that reduces visual noise by toggling full-line comments and standalone diagnostic-output calls. It applies editor decorations; it does not delete source text.

![ZenComPrint demonstration](data/demo.gif)

## Use

Run **Hide Comments & Prints** from the Command Palette, or click the ZenComPrint status-bar item. Toggle state is kept per document and refreshed as visible documents change.

The source checkout no longer overrides `Cmd+H` or `Ctrl+H`. Assign your own shortcut to `zencomprint.toggleCommentsPrints` in Keyboard Shortcuts. The extension does not change a document's read-only state.

## Supported syntax and limits

| Languages | Hidden lines |
| --- | --- |
| JavaScript / TypeScript, including React variants | Full-line `//` comments; standalone `console.log/warn/error/info/debug(...)` calls |
| Python | Full-line `#` comments; standalone `print(...)` calls |
| Groovy | Full-line `//` comments; standalone `print/println/printf` and `System.out` variants with parentheses |
| PHP | Full-line `//` / `#` comments; standalone `print_r(...)` / `var_dump(...)` calls |
| AL | Full-line `//` comments |

This is a conservative line-based classifier, not a complete language parser. Inline comments, block comments, multiline calls and PHP `echo` remain visible. Comment-like text inside tracked multiline strings is preserved; complex language constructs may be left visible. Review source normally when editing: decorations are a viewing aid, not a transformation or access-control mechanism.

The animation shows the original release; source improvements described here are not claimed to be published to the Marketplace.

## Develop and verify

Node.js 20+ and VS Code 1.88+ are the development targets.

```sh
npm ci
npm run compile
npm run lint
npm test
```

Press F5 in VS Code to open an Extension Development Host for manual UI testing. Automated tests exercise classification edge cases; they do not replace testing VS Code decoration rendering and editor events.

## Install

The existing release is available in the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AleksaGavric.zencomprint). Clone this repository for the current source.

## License and contributions

See [LICENCE.md](LICENCE.md). Bug reports should include a minimal source example, language mode and VS Code version.

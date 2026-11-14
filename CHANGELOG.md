# Unreleased source improvements

- Keep toggle state per document and dispose editor resources.
- Refresh decorations after editor/document changes without modifying read-only state.
- Use conservative line classification to avoid hiding mixed code and string content.
- Leave block comments visible rather than scanning beyond the end of a document.
- Remove the default Hide/Replace shortcut conflict; users can assign a shortcut.
- Add regression tests and CI checks. These changes are not a Marketplace release.

# Changelog

## [1.0.0] - 2024-05-07

### Added

- Merged PRs for adding Groovy and AL.
- Disabled editing the file when the extension is active.
- Added CHANGELOG.md.
- Improved the README.md.

### Fixed

- Fixed a bug where the editor would not highlight syntax errors in certain scenarios.

## [0.0.1] - 2024-04-12

### Added

- Initial release of the VS Code extension.
- Added support for Python, JavaScript and TypeScript.

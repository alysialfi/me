# Spec Delta

## MODIFIED Requirements

### Requirement: App paths
The focused app SHALL be reflected in the URL path: `/notes/<note>`, `/finder/<project>/<file>`, `/photos`, `/contact`, `/music` and `/vscode`. The home screen is `/`. Deeper segments are optional.

#### Scenario: Path follows the focused app
- **WHEN** a visitor opens the Finder folder of a project
- **THEN** the URL path becomes `/finder/<project>`

#### Scenario: Open a file
- **WHEN** a visitor opens a file in a project
- **THEN** the URL path becomes `/finder/<project>/<file>`

#### Scenario: Direct link
- **WHEN** a visitor loads a URL such as `/finder/<project>` directly
- **THEN** the home screen is shown with that app focused on that content, and the first-load About me note is not opened

#### Scenario: Unknown path
- **WHEN** a visitor loads a path that names no app, project, file or note, or adds a segment the app does not take (such as `/photos/personal` or `/contact/extra`)
- **THEN** the home screen is shown with a not-found notice, and no blank page appears

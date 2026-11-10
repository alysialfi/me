# Spec Delta

## Purpose

Defines the owner-edited content that every portfolio app and widget presents, and how the owner adds or changes it without touching application code.

## ADDED Requirements

### Requirement: Content lives in the repository
All portfolio content SHALL be stored as files in the repository and be editable by the owner without a backend or database.

#### Scenario: Owner edits content
- **WHEN** the owner changes a content file and rebuilds the site
- **THEN** the change appears in every app and widget that presents that content

### Requirement: Notes content
Each note SHALL have a title, a date and a body that may contain text, links, images and video, and MAY have a one-line summary. One note, "About me", SHALL be designated as the first note shown.

#### Scenario: Note summary
- **WHEN** a note has a summary
- **THEN** the notes widget at its largest size shows it as a preview line under the note title

#### Scenario: Rich note body
- **WHEN** a note body contains text, a link, an image and a video
- **THEN** all four are rendered in the note in the order written

#### Scenario: Missing About me note
- **WHEN** no note is designated as the first note
- **THEN** the site build fails with a message naming the missing designation

### Requirement: Project folders
Each project SHALL be a folder with a name and zero or more files. A file SHALL be a Markdown case study or an image.

#### Scenario: Project with mixed files
- **WHEN** a project folder contains one Markdown case study and two images
- **THEN** Finder lists all three files inside that project's folder

#### Scenario: Unsupported file type
- **WHEN** a project folder contains a file that is neither a Markdown case study nor an image, such as a PDF
- **THEN** the site build fails with a message naming the file

#### Scenario: Case study frontmatter
- **WHEN** a project has a Markdown case study
- **THEN** its frontmatter requires a title and may give a site URL, a period, a role, a list of stacks and a list of links each with a label and URL

### Requirement: Photo items
Each photo SHALL be an image with a caption and a kind of either personal or project, and MAY have the year it was taken.

#### Scenario: Photo year
- **WHEN** a photo has a year
- **THEN** Photos shows it in that year's section, and a photo without a year is shown under "Other"

#### Scenario: Photo kinds
- **WHEN** photos of both kinds exist
- **THEN** Photos shows them together and the photo carousel widget can use any of them

### Requirement: Song items
Each song SHALL have a title, an artist, optional cover art and a playable audio source, and MAY have a genre (pop, lo-fi, jazz or rock) and a duration in seconds.

#### Scenario: Song genre
- **WHEN** a song has a genre
- **THEN** Music shows its colored genre tag and lists it under that genre's filter chip, and a genre with no songs has no chip

#### Scenario: Song without cover art
- **WHEN** a song has no cover art
- **THEN** Music shows a default cover in its place

### Requirement: Contact details
The contact details SHALL consist of a full name, an email address, a phone number and zero or more socials, each social having a label and a URL.

#### Scenario: Owner adds a social
- **WHEN** the owner adds a social with a label and URL
- **THEN** Contact lists it without any other change

### Requirement: Code snippet content
The code snippet SHALL have a file name, a language and the source text.

#### Scenario: Snippet language
- **WHEN** the snippet declares a language
- **THEN** VS Code highlights the source for that language

### Requirement: History entries
Each history entry SHALL have a title, a start year, an end year or "present", and a kind of education, work or award.

#### Scenario: Entry details
- **WHEN** an entry has a description or a list of details
- **THEN** the calendar widget shows them when the entry is expanded, and both are optional

#### Scenario: Open-ended entry
- **WHEN** an entry has "present" as its end
- **THEN** the calendar widget shows its period as running to the present

### Requirement: Placeholder content
Until the owner supplies real material, the site SHALL ship with clearly labelled placeholder content for every content type.

#### Scenario: Fresh checkout
- **WHEN** the site is built from a fresh checkout
- **THEN** every app and widget shows placeholder content and none is empty

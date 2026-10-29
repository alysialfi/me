# Proposal

## Why

The Penpot design for the macOS/iOS-style portfolio is done and archived (`portfolio-macos-ui-design`). The next step is the real website. Visitors should feel at home in an OS they already know and get a quick glance at the owner's projects. Planning the build as its own change also fixes places where the owner's decisions now differ from the design-phase specs.

## What Changes

- Build the portfolio website with **Nuxt** and **Tailwind CSS**, self-hosted on the owner's own server.
- On first load the home screen appears with the **Notes** app already open on an "About me" note.
- Notes become rich documents: text, links, images and video. Links in the About me note lead to projects.
- Finder shows **one folder per project, sorted by name**. Opening a folder lists its files (PDF, image). Double-clicking a file opens a PDF viewer or an image viewer.
- Contact shows full name, email, phone and socials. Every field is clickable: email opens a mail compose, phone opens a call link, socials open external links. There is no message form.
- Photos is one gallery that mixes personal photos and project screenshots.
- Music plays and pauses real audio from the owner's favorite songs. The home screen music widget stays in sync.
- VS Code shows a read-only code snippet of the owner's current project.
- The focused app is shown in the URL path (for example `/finder/project-x`) so links can be shared. On desktop, several draggable windows can be open at once, with the others listed in a `with` query.
- On tablet and phone, Notes opens first as a windowed overlay. Any app opened afterwards is full-screen, and closing it returns to the home screen.
- All portfolio content (notes, projects, photos, songs, contact, snippet, history) lives in the repo as files the owner edits, not in a backend.

Out of scope: a backend or database, a contact/message form, user accounts, analytics, writing the owner's real content (placeholders are used until supplied).

## Capabilities

### New Capabilities
- `portfolio-content`: the owner-edited content that every app and widget reads, and how it is organized (notes, project folders, photos, songs, contact details, code snippet, education and work history).

### Modified Capabilities
- `home-screen`: Notes opens automatically on load. The notes widget lists notes, so it must follow the new Notes content model.
- `portfolio-apps`: Notes becomes rich-media and About-me-first, Finder becomes folders per project, Contact gains clickable fields and socials, Photos gains personal and project images, Music is real playback.
- `responsive-layout`: Notes opens windowed first on tablet and phone, later apps are full-screen.

## Impact

- New Nuxt + Tailwind application in the repo root (the repo has no application code today).
- Visual source of truth: the Penpot file "mac ui" and the archived design change.
- Delta specs for the four capabilities above under this change, merged into `openspec/specs/` once archived.
- Work is done on the git branch `develop`.
- Self-hosting: the owner provides the server. Deployment details are in design.md.

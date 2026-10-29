# Editing content

All content is plain files under `content/` (text) and `public/media/` (images, audio, video). There is no database and no admin page: edit a file, rebuild, and every app and widget that shows it updates.

While you write, run `npm run dev` and the site reloads as you save. Everything shipped in a fresh checkout is **placeholder** content, labelled "Placeholder": replace it with your own.

| What | Where | Shown in |
| --- | --- | --- |
| Notes | `content/notes/<slug>.md` | Notes app, notes widget |
| Projects | `content/projects/<slug>/` | Finder |
| Photos | `content/photos/<nn>-<name>.yml` + `public/media/photos/` | Photos app, photo carousel widget |
| Songs | `content/songs/<nn>-<name>.yml` + `public/media/songs/` | Music app, music widget |
| Contact | `content/contact.yml` | Contact app |
| Code snippet | `content/snippet.yml` | VS Code app |
| Education and work | `content/history/<nn>.yml` | Calendar widget |

The file name (without extension) becomes the URL, e.g. `content/notes/about-me.md` is `/notes/about-me`. Renaming a file changes its link.

## Notes

`content/notes/<slug>.md`:

```md
---
title: About me
date: 2026-01-01
about: true
---
# About me

Text, **formatting**, and links:

- a project: [My project](/finder/my-project)
- another app: [my photos](/photos)
- an external page (opens in a new tab): [GitHub](https://github.com/you)

An image (put the file in `public/media/notes/`):

![A description](/media/notes/me.jpg)

A video (put the file in `public/media/notes/`):

::note-video{src="/media/notes/intro.webm"}
::
```

- `title` and `date` (`YYYY-MM-DD`) are required. Notes are listed newest first.
- **Exactly one note must have `about: true`.** It opens first. The build fails with a message if none does.
- A link starting with `/` goes to that app or project inside the site; one starting with `https://` opens a new tab.

## Projects

One folder per project, containing a `project.yml` and the project's files:

```
content/projects/my-project/
  project.yml
  case-study.pdf
  screenshot-1.png
```

```yaml
# project.yml
name: My Project          # shown under the folder, and used to sort folders
summary: One line about it   # optional
```

Files can be **PDF or images** (`png`, `jpg`, `jpeg`, `gif`, `webp`, `avif`, `svg`). Any other file type fails the build with a message naming the file. Folders are sorted by `name`.

## Photos

Put the image in `public/media/photos/`, then add `content/photos/<nn>-<name>.yml`:

```yaml
image: /media/photos/hike.jpg
caption: Hiking in the hills
kind: personal            # personal or project
```

`personal` photos form the Personal album, `project` photos the Projects album; All shows both. Photos are ordered by file name, so prefix with `01-`, `02-`...

## Songs

Put the audio in `public/media/songs/`, then add `content/songs/<nn>-<name>.yml`:

```yaml
title: Song title
artist: Artist name
cover: /media/songs/cover.jpg   # optional; a default cover is used without it
audio: /media/songs/song.mp3
```

Use compressed audio (mp3, m4a, ogg). Playback starts only when a visitor presses play.

## Contact

`content/contact.yml`:

```yaml
fullName: Your Name
email: you@example.com
phone: "+62 812 0000 0000"
socials:
  - label: GitHub
    url: https://github.com/you
  - label: LinkedIn
    url: https://www.linkedin.com/in/you
```

Add or remove entries under `socials` freely. Email opens a new message, the phone number offers a call, socials open in a new tab.

## Code snippet

`content/snippet.yml` (shown read-only in VS Code, highlighted for `language`):

```yaml
file: server.ts
language: typescript
code: |
  export function hello() {
    return 'world'
  }
```

## Education and work

One file per entry, `content/history/<nn>.yml`:

```yaml
title: B.Sc. Computer Science
start: 2015
end: 2019            # a year, or: present
kind: education      # education or work
```

The calendar widget groups entries by start year, newest first. `end: present` shows as "now".

## Media size

Keep large images, audio and video compressed. They are loaded only when needed, but they are served from your own server. Videos work best as `webm` or `mp4`.

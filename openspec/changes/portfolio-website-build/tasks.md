# Tasks

## 1. Project setup

- [ ] 1.1 Scaffold a Nuxt + TypeScript app with Tailwind CSS on branch `develop`; verify `npm run dev` serves a blank page and `npx nuxt generate` succeeds
- [ ] 1.2 Add a unit test runner (Vitest) and a browser test runner (Playwright); verify one trivial test of each type passes
- [ ] 1.3 Read tokens (colors, radii, spacing, font sizes, glass effect) from the Penpot file "mac ui" into the Tailwind theme; verify a token page renders each token and matches the design
- [ ] 1.4 Add a README with dev, test, build and static-hosting steps; verify the documented commands run as written

## 2. Content layer (`portfolio-content`)

- [ ] 2.1 Add Nuxt Content and define the content directories and schemas for notes, projects, photos, songs, contact, snippet and history; verify schema tests reject entries missing required fields
- [ ] 2.2 Add build-time checks for a missing "About me" designation and unsupported project file types; verify tests show the build fails with the messages in the spec
- [ ] 2.3 Add labelled placeholder content for every type, including a note with text, link, image and video, and projects with PDFs and images; verify every content type returns at least one item in a test

## 3. Shell and window manager

- [ ] 3.1 Build the viewport composable on Tailwind breakpoints and the window-manager store (open app, selection, mode); verify unit tests for open, close and mode changes across lg
- [ ] 3.2 Build the desktop shell (menu bar, wallpaper, floating dock, 12-column widget grid) and the desktop window component with close control; verify a browser test at 1280px shows menu bar, dock and a window opening and closing
- [ ] 3.3 Build the iPadOS (md) and iOS (below md) shells with status bar, app grid, bottom dock and full-screen sheet with close control; verify browser tests at 390px and 768px
- [ ] 3.4 Open Notes on "About me" as a windowed overlay on first load at every size; verify browser tests at 390, 768 and 1280px, including close and reopen behavior from `home-screen`
- [ ] 3.5 Make later apps open full-screen below lg and as windows at lg and above, keeping the open apps across a resize over lg, with only the focused app shown below lg; verify a browser test that resizes while apps are open and that extras return at lg
- [ ] 3.6 Check touch target sizes below lg; verify a browser test asserts every app icon and control is at least 44 by 44 px at 390px
- [ ] 3.7 Support several open windows on desktop with focus by click and front-most stacking; verify unit tests on the open list and a browser test that opens two apps and focuses the one behind
- [ ] 3.8 Add draggable windows by title bar, clamped so the title bar stays on screen, disabled below lg; verify browser tests for drag, edge clamping and no drag at 390px
- [ ] 3.9 Add resizing by edges and corners with a 320 by 240 pixel minimum and a full-screen maximum; verify unit tests on the clamping and browser tests for min and max
- [ ] 3.10 Add the red, yellow and green window controls (close, minimize to dock, toggle full screen with restore), dock open indicators and restore from the dock; verify browser tests for each control, restoring the previous size and a dock click not opening a second window
- [ ] 3.11 Add the route parser and URL sync (path for the focused app, `with` query for others, history entries on open, focus and close, nothing on drag) with the catch-all page; verify unit tests on parsing including unknown names and a browser test for back, close-focused and close-last
- [ ] 3.12 Add the not-found notice and generate known routes statically; verify `nuxt generate` outputs HTML for sample app, note and project paths and a browser test shows the notice for an unknown path

## 4. Apps (`portfolio-apps`)

- [ ] 4.1 Build Notes: note list, rich body rendering (text, links, images, video), and link targets for project, app and external URL; verify browser tests for each link target and for video playback
- [ ] 4.2 Build Finder: sorted project folders, folder contents list, back navigation, double-click on desktop and tap on touch; verify browser tests for ordering, opening and back
- [ ] 4.3 Build the PDF viewer with pdf.js and the image viewer; verify browser tests open a PDF and an image from Finder and return to Finder on close
- [ ] 4.4 Build Contact with clickable email, phone and socials; verify browser tests check the `mailto:` and `tel:` links and that socials open in a new tab
- [ ] 4.5 Build Photos with All, Personal and Projects albums and a larger-size view; verify a browser test switches album and opens a photo
- [ ] 4.6 Build the shared audio store and the Music app with play, pause and one-song-at-a-time; verify unit tests on the store and a browser test that playback continues after the Music window closes
- [ ] 4.7 Build VS Code with a highlighted read-only snippet and file name; verify a browser test finds the file name and highlighted tokens

## 5. Widgets (`home-screen`)

- [ ] 5.1 Build the clock widget (hh:mm, updates); verify a unit test with a fake clock
- [ ] 5.2 Build the photo carousel widget from the Photos content and open Photos on activation; verify a browser test
- [ ] 5.3 Build the calendar widget grouped by year with the accent bar, title and period, including "present"; verify unit tests on grouping and a visual check against the design
- [ ] 5.4 Build the notes widget with note rows that open that note; verify a browser test
- [ ] 5.5 Build the music widget sharing state with the Music app; verify a browser test that play in the widget updates the app and the reverse
- [ ] 5.6 Check widget widths on the 12-column grid; verify a browser test that measures spans at 1280px (clock 2, photo carousel 3, notes 3, calendar 4, music 4)

## 6. Integration and delivery

- [ ] 6.1 Run the full browser suite at 390, 768, 1024 and 1280px; verify all pass
- [ ] 6.2 Compare each breakpoint with its Penpot board and fix visible differences; verify side-by-side screenshots are reviewed with the owner
- [ ] 6.3 Run `npx nuxt generate` and serve the output with a local static server with range requests; verify navigation, audio, PDF and direct loads of nested paths (fallback to the home page for unknown ones) work with no console errors
- [ ] 6.4 Document how the owner edits each content type and how to deploy the static output to their server; verify a fresh checkout follows the document successfully

## Workflow follow-up

- Archive this change after owner review, which merges its delta specs into `openspec/specs/`.

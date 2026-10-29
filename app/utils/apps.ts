import type { AppId } from './window-manager'

export const APPS: Record<AppId, { title: string, icon: string }> = {
  photos: { title: 'Photos', icon: '/icons/photos.png' },
  contact: { title: 'Contact', icon: '/icons/contact.png' },
  notes: { title: 'Notes', icon: '/icons/notes.png' },
  finder: { title: 'Finder', icon: '/icons/finder.png' },
  music: { title: 'Music', icon: '/icons/music.png' },
  vscode: { title: 'VS Code', icon: '/icons/vscode.png' }
}

// Dock order from the Penpot design.
export const DOCK_ORDER: AppId[] = ['photos', 'contact', 'notes', 'finder', 'music', 'vscode']

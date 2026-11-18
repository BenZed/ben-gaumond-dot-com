import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/instrument-sans'
import '@mantine/core/styles.css'
import './src/styles.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { App } from './src/App'
import type { Resume } from './src/Resume'

const root = document.getElementById('root')
if (!root) throw new Error('Root element is missing')
const snapshot = document.getElementById('resume-data')

let resume: Resume
if (snapshot) {
  // The build serializes this snapshot from content/resume.json.
  resume = JSON.parse(snapshot.textContent ?? '') as Resume
} else if (import.meta.env.DEV) {
  resume = (await import('./content/resume.json')).default
} else {
  throw new Error('Prerendered resume data is missing')
}

const app = (
  <StrictMode>
    <App resume={resume} />
  </StrictMode>
)
if (snapshot) hydrateRoot(root, app)
else createRoot(root).render(app)

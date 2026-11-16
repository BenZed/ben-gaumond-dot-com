import '@mantine/core/styles.css'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { App } from './App'
import { resumeSchema } from './resumeSchema'

const root = document.getElementById('root')
if (!root) throw new Error('Root element is missing')
const snapshot = document.getElementById('resume-data')

let payload: unknown
if (snapshot) {
  payload = JSON.parse(snapshot.textContent ?? '')
} else if (import.meta.env.DEV) {
  payload = (await import('../content/resume.json')).default
} else {
  throw new Error('Prerendered resume data is missing')
}

const app = (
  <StrictMode>
    <App resume={resumeSchema.parse(payload)} />
  </StrictMode>
)
if (snapshot) hydrateRoot(root, app)
else createRoot(root).render(app)

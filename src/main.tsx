import '@mantine/core/styles.css'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { App } from './App'
import { resumeSchema } from './resumeSchema'

async function mount() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Root element is missing')
  const snapshot = document.getElementById('resume-data')

  try {
    let payload: unknown
    if (snapshot) {
      payload = JSON.parse(snapshot.textContent ?? '')
    } else {
      const response = await fetch('/', { headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error(`Resume request failed (${String(response.status)})`)
      payload = await response.json()
    }

    const app = (
      <StrictMode>
        <App resume={resumeSchema.parse(payload)} />
      </StrictMode>
    )
    if (snapshot) hydrateRoot(root, app)
    else createRoot(root).render(app)
  } catch (error) {
    if (!snapshot)
      root.textContent = 'The resume could not be loaded. Reload the page to try again.'
    throw error
  }
}

await mount()

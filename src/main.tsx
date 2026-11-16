import '@mantine/core/styles.css'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element is missing')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (root.querySelector('main')) hydrateRoot(root, app)
else createRoot(root).render(app)

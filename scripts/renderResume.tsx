import { renderToString } from 'react-dom/server'

import { App } from '../src/App'
import type { Resume } from '../src/Resume'

export function renderResume(resume: Resume) {
  return renderToString(<App {...resume} />)
}

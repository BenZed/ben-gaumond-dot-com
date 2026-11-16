import { renderToString } from 'react-dom/server'

import { App } from '../src/App'
import type { Resume } from '../src/resume'

export const appPlaceholder = '<div id="root"><!--app-html--></div>'

export function renderResume(template: string, resume: Resume) {
  const markup = renderToString(<App resume={resume} />)
  // Escape tag openers so a value cannot close the script element.
  const snapshot = JSON.stringify(resume).replaceAll('<', '\\u003c')
  return template.replace(
    appPlaceholder,
    () =>
      `<div id="root">${markup}</div><script type="application/json" id="resume-data">${snapshot}</script>`,
  )
}

import { randomUUID } from 'node:crypto'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'
import { preview } from 'vite'

const directory = new URL('../workbench/', import.meta.url)
const output = new URL('resume.pdf', directory)
const temporary = new URL(`resume-${randomUUID()}.pdf`, directory)

const browser = await chromium.launch()
try {
  const server = await preview({
    configLoader: 'runner',
    preview: { host: '127.0.0.1', port: 0 },
  })
  try {
    const url = server.resolvedUrls?.local[0]
    if (!url) throw new Error('Vite did not provide a local preview URL')

    const page = await browser.newPage({ colorScheme: 'light' })
    await page.emulateMedia({ media: 'print' })
    const response = await page.goto(url)
    if (!response?.ok()) throw new Error(`Could not load the resume from ${url}`)
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const pdf = await page.pdf({ format: 'Letter', printBackground: true, tagged: true })
    await mkdir(directory, { recursive: true })
    try {
      await writeFile(temporary, pdf)
      await rename(temporary, output)
    } finally {
      await rm(temporary, { force: true })
    }
    console.log(`Wrote ${fileURLToPath(output)}`)
  } finally {
    await server.close()
  }
} finally {
  await browser.close()
}

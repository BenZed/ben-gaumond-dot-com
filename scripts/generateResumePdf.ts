import { randomUUID } from 'node:crypto'
import { rename, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'
import { preview } from 'vite'

async function generateResumePdf() {
  const server = await preview({
    configLoader: 'runner',
    preview: { host: '127.0.0.1', port: 0 },
  })
  try {
    const url = server.resolvedUrls?.local[0]
    if (!url) throw new Error('Vite did not provide a local preview URL')

    const pdf = await renderResumePdf(url)
    const outputPath = await writeResumePdf(pdf)
    console.log(`Wrote ${outputPath}`)
  } finally {
    await server.close()
  }
}

async function renderResumePdf(url: string) {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ colorScheme: 'light' })
    await page.emulateMedia({ media: 'print' })
    const response = await page.goto(url)
    if (!response?.ok()) throw new Error(`Could not load the resume from ${url}`)
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    return await page.pdf({ format: 'Letter', printBackground: true, tagged: true })
  } finally {
    await browser.close()
  }
}

async function writeResumePdf(pdf: Buffer) {
  const directory = new URL('../dist/', import.meta.url)
  const output = new URL('resume.pdf', directory)
  const temporary = new URL(`resume-${randomUUID()}.pdf`, directory)

  try {
    await writeFile(temporary, pdf)
    await rename(temporary, output)
  } finally {
    await rm(temporary, { force: true })
  }
  return fileURLToPath(output)
}

/** Execute */
await generateResumePdf()

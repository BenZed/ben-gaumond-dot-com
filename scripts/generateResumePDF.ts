import { randomUUID } from 'node:crypto'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

import { chromium } from 'playwright'
import { preview } from 'vite'

export type GenerateResumePDFParams = {
  readonly output?: string
}

export async function generateResumePDF({ output }: GenerateResumePDFParams = {}) {
  if (output === '') throw new Error('Supply a file path for the PDF output')
  const outputPath =
    output === undefined
      ? fileURLToPath(new URL('../dist/resume.pdf', import.meta.url))
      : resolve(output)

  const server = await preview({
    root: fileURLToPath(new URL('..', import.meta.url)),
    configLoader: 'runner',
    preview: { host: '127.0.0.1', port: 0 },
  })
  try {
    const url = server.resolvedUrls?.local[0]
    if (!url) throw new Error('Vite did not provide a local preview URL')

    const pdf = await renderResumePdf(url)
    await writeResumePdf(pdf, outputPath)
  } finally {
    await server.close()
  }
  return outputPath
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

async function writeResumePdf(pdf: Buffer, outputPath: string) {
  const directory = dirname(outputPath)
  const temporary = join(directory, `resume-${randomUUID()}.pdf`)

  await mkdir(directory, { recursive: true })
  try {
    await writeFile(temporary, pdf)
    await rename(temporary, outputPath)
  } finally {
    await rm(temporary, { force: true })
  }
}

/** Execute */
const entry = process.argv[1]
if (entry && pathToFileURL(entry).href === import.meta.url) {
  const { values } = parseArgs({
    options: { output: { type: 'string', short: 'o' } },
  })
  const outputPath = await generateResumePDF(values)
  console.log(`Wrote ${outputPath}`)
}

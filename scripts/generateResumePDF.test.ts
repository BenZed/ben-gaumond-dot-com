import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { generateResumePDF } from './generateResumePDF'

const { launch, preview } = vi.hoisted(() => ({
  launch: vi.fn(),
  preview: vi.fn(),
}))

vi.mock('playwright', () => ({ chromium: { launch } }))
vi.mock('vite', () => ({ preview }))

const url = 'http://127.0.0.1:4173/'
const pdfBytes = Buffer.from('%PDF-1.7\n')
const closeBrowser = vi.fn()
const closePreview = vi.fn()
const page = {
  goto: vi.fn(),
  emulateMedia: vi.fn(),
  getByRole: vi.fn(),
  evaluate: vi.fn(),
  pdf: vi.fn(),
}

let directory: string

beforeEach(async () => {
  vi.resetAllMocks()
  directory = await mkdtemp(join(tmpdir(), 'resume-pdf-test-'))
  preview.mockResolvedValue({ resolvedUrls: { local: [url] }, close: closePreview })
  launch.mockResolvedValue({ newPage: vi.fn().mockResolvedValue(page), close: closeBrowser })
  page.goto.mockResolvedValue({ ok: () => true })
  page.getByRole.mockReturnValue({ waitFor: vi.fn() })
  page.pdf.mockResolvedValue(pdfBytes)
})

afterEach(async () => {
  await rm(directory, { recursive: true, force: true })
})

test('writes the rendered PDF to a nested output path', async () => {
  const output = join(directory, 'nested', 'resume.pdf')

  await expect(generateResumePDF({ output })).resolves.toBe(output)
  expect(await readFile(output)).toEqual(pdfBytes)
  expect(await readdir(join(directory, 'nested'))).toEqual(['resume.pdf'])
  expect(page.goto).toHaveBeenCalledWith(url)
  expect(page.emulateMedia).toHaveBeenCalledWith({ media: 'print' })
  expect(page.pdf).toHaveBeenCalledWith({ format: 'Letter', printBackground: true, tagged: true })
  expect(closeBrowser).toHaveBeenCalledOnce()
  expect(closePreview).toHaveBeenCalledOnce()
})

test('preserves the previous PDF and closes resources if the preview fails to load', async () => {
  const output = join(directory, 'resume.pdf')
  const previous = Buffer.from('%PDF-1.7\nprevious export')
  await writeFile(output, previous)
  page.goto.mockResolvedValue({ ok: () => false })

  await expect(generateResumePDF({ output })).rejects.toThrow('Could not load the resume')
  expect(await readFile(output)).toEqual(previous)
  expect(page.pdf).not.toHaveBeenCalled()
  expect(closeBrowser).toHaveBeenCalledOnce()
  expect(closePreview).toHaveBeenCalledOnce()
})

test('removes the temporary PDF if the destination cannot be replaced', async () => {
  const output = join(directory, 'resume.pdf')
  await mkdir(output)

  await expect(generateResumePDF({ output })).rejects.toThrow()
  expect(await readdir(directory)).toEqual(['resume.pdf'])
  expect(closePreview).toHaveBeenCalledOnce()
})

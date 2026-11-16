import { z } from 'zod'

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/u)
const text = z.string().trim().min(1)
const webUrl = z.url({ protocol: /^https$/u })
const positionSchema = z
  .strictObject({
    id: text,
    company: text,
    title: text,
    start: month,
    end: month.nullable(),
    location: text,
    employmentType: text,
    description: z.array(text).min(1),
    highlights: z.array(text).min(1),
    skills: z.array(text),
    url: webUrl.optional(),
    repository_label: text.optional(),
    projectTitle: text.optional(),
  })
  .refine((position) => position.end === null || position.end >= position.start, {
    message: 'End date must not precede start date',
  })

export const resumeSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    basics: z.strictObject({
      name: text,
      pronouns: text,
      headline: text,
      location: text,
      profiles: z.array(z.strictObject({ network: text, url: webUrl })),
      about: z.array(text).min(1),
      summary: text,
      approach: text,
    }),
    technologies: z.array(text).min(1),
    experience: z.array(positionSchema).min(1),
  })
  .refine(
    (value) => new Set(value.experience.map(({ id }) => id)).size === value.experience.length,
    {
      message: 'Position IDs must be unique',
    },
  )

export type Resume = z.infer<typeof resumeSchema>
export type Position = z.infer<typeof positionSchema>
export function formatMonth(value: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`))
}

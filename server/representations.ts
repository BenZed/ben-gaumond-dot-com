import { MIMEType } from 'node:util'

export const html = 'text/html; charset=utf-8'
export const json = 'application/json; charset=utf-8'

export function negotiate<T extends string>(
  accept: string | undefined,
  representations: readonly T[],
): T | undefined {
  if (accept === undefined) return representations[0]

  const ranges = (accept.match(/(?:[^",]|"(?:[^"\\]|\\.)*")+/gu) ?? []).flatMap((value) => {
    try {
      const range = new MIMEType(value)
      if (range.type === '*' && range.subtype !== '*') return []
      const weight = range.params.get('q') ?? '1'
      const quality = /^(?:0?(?:\.\d{1,3})|0\.?|1(?:\.0{0,3})?)$/u.test(weight) ? Number(weight) : 0
      range.params.delete('q')
      const parameters = [...range.params]
      const specificity =
        (range.type === '*' ? 0 : range.subtype === '*' ? 2 : 4) + parameters.length
      return [{ range, parameters, quality, specificity }]
    } catch {
      return []
    }
  })

  // A more specific range controls the quality of a representation, including exclusions.
  ranges.sort((a, b) => b.specificity - a.specificity || b.quality - a.quality)
  let preferred: { value: T; quality: number; specificity: number } | undefined
  for (const value of representations) {
    const type = new MIMEType(value)
    const match = ranges.find(
      ({ range, parameters }) =>
        (range.type === '*' || range.type === type.type) &&
        (range.subtype === '*' || range.subtype === type.subtype) &&
        parameters.every(
          ([name, parameter]) => type.params.get(name)?.toLowerCase() === parameter.toLowerCase(),
        ),
    )
    if (
      match?.quality &&
      (!preferred ||
        match.quality > preferred.quality ||
        (match.quality === preferred.quality && match.specificity > preferred.specificity))
    ) {
      preferred = { value, quality: match.quality, specificity: match.specificity }
    }
  }
  return preferred?.value
}

export function resumeRepresentation(accept: string | undefined) {
  return negotiate(accept, [html, json] as const)
}

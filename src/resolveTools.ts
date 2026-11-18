import type { Resume } from './Resume'

type Tool = Resume['tools'][keyof Resume['tools']]

export type ResolvedTool = Tool & { readonly id: string }

export function resolveTools(
  tools: Readonly<Partial<Record<string, Tool>>>,
  ids: readonly string[],
): ResolvedTool[] {
  return ids.map((id) => {
    const tool = tools[id]
    if (!Object.hasOwn(tools, id) || tool === undefined) {
      throw new Error(`Unknown toolkit tool ID: "${id}"`)
    }
    return { ...tool, id }
  })
}

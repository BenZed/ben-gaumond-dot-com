import type { Tool } from './Resume'

export function resolveTools(tools: readonly Tool[], ids: readonly string[]): Tool[] {
  return ids.map((id) => {
    const tool = tools.find((entry) => entry.id === id)
    if (tool === undefined) {
      throw new Error(`Unknown toolkit tool ID: "${id}"`)
    }
    return tool
  })
}

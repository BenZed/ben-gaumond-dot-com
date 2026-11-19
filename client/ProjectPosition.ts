import type { Position } from './Resume'

export type ProjectPosition = Position & { readonly projectTitle: string }

export function isProjectPosition(position: Position): position is ProjectPosition {
  return typeof position.projectTitle === 'string'
}

import type { Position } from './util/Resume'

export type ProjectPosition = Position & { readonly project: NonNullable<Position['project']> }

export function isProjectPosition(position: Position): position is ProjectPosition {
  return typeof position.project?.title === 'string'
}

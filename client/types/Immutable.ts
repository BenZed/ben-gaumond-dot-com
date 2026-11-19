/**
 * Recursively makes object properties, array elements, and tuple elements readonly.
 *
 * @typeParam Value - The data type to make readonly.
 *
 * @remarks
 * Arrays become readonly arrays. Tuples keep their element types, positions,
 * and optional or rest elements. This is a compile-time constraint.
 *
 * @example
 * ```ts
 * type Entry = { tags: string[]; point: [x: number, y: number] }
 * type ReadonlyEntry = Immutable<Entry>
 * // { readonly tags: readonly string[]; readonly point: readonly [x: number, y: number] }
 * ```
 */
export type Immutable<Value> = {
  readonly [Key in keyof Value]: Immutable<Value[Key]>
}

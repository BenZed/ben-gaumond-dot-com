import { expectTypeOf, test } from 'vitest'

import type { Immutable } from './Immutable'

test('makes arrays and nested objects readonly', () => {
  expectTypeOf<Immutable<{ tags: string[] }[]>>().toEqualTypeOf<
    readonly { readonly tags: readonly string[] }[]
  >()
})

test('preserves tuple positions, optional elements, and rest elements', () => {
  expectTypeOf<
    Immutable<[head: { values: number[] }, flag?: boolean, ...tail: [number, string][]]>
  >().toEqualTypeOf<
    readonly [
      head: { readonly values: readonly number[] },
      flag?: boolean,
      ...tail: (readonly [number, string])[],
    ]
  >()
})

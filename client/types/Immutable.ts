export type Immutable<Value> = {
  readonly [Key in keyof Value]: Immutable<Value[Key]>
}

declare module 'virtual:resume-code-background' {
  export type CodeBackgroundFile = {
    readonly path: string
    readonly lines: readonly {
      readonly cells: number
      readonly tokens: readonly {
        readonly content: string
        readonly offset: number
        readonly color?: string
      }[]
    }[]
  }

  export const files: readonly CodeBackgroundFile[]
}

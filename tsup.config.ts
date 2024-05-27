import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['src/**/*.ts', '!src/**/*.spec.ts'],
  minify: true,
}

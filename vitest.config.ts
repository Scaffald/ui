import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vitest/config'
import baseConfig from '../../vitest.config'

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url))
const packageRoot = fileURLToPath(new URL('.', import.meta.url))

const packageConfig = {
  root: workspaceRoot,
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: 'react-native', replacement: 'react-native-web' },
      {
        find: 'react-native-svg',
        replacement: resolve(workspaceRoot, 'tests/infrastructure/vitest/mocks/react-native-svg.tsx'),
      },
      {
        find: '@scaffald/ui',
        replacement: resolve(packageRoot, 'src'),
      },
    ],
  },
  test: {
    // `root` is the workspace root (above), so include patterns are relative to
    // it. This said `packages/scaffald-ui/...` -- a path that has not existed
    // since the package was renamed to `packages/ui` -- so the config matched
    // zero files and exited as though everything passed, hiding every test in
    // this package (#469).
    include: ['packages/ui/src/**/*.{test,spec}.{ts,tsx}'],
    watchExclude: ['**/dist/**'],
    setupFiles: [resolve(packageRoot, 'vitest.setup.ts')],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '.storybook/',
      ],
    },
  },
}

const merged = mergeConfig(baseConfig, packageConfig)
merged.test.include = ['packages/ui/src/**/*.{test,spec}.{ts,tsx}']
export default merged

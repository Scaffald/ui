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
    // TODO: Fix NX vitest executor path resolution so this config can use
    // the correct include pattern. Currently kept as scaffald-ui to avoid
    // a double-path esbuild error in the NX executor. The new test files
    // (Input, Checkbox, Radio, Toggle, Dropdown, useSidebarState) inline
    // their mocks and run through the root vitest config instead.
    include: ['packages/scaffald-ui/src/**/*.{test,spec}.{ts,tsx}'],
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
merged.test.include = ['packages/scaffald-ui/src/**/*.{test,spec}.{ts,tsx}']
export default merged

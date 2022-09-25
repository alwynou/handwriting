import { defineBuildConfig } from 'unbuild'
export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  outDir: 'dist',
  clean: true,
  rollup: {
    emitCJS: true,
  },
})

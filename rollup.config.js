const { eslint } = require('rollup-plugin-eslint')
const json = require('@rollup/plugin-json')
const ts = require('rollup-plugin-ts')
const del = require('rollup-plugin-delete')
const fs = require('@sagacious/fs-wrapper')
const reslove = require('@rollup/plugin-node-resolve')
const cjs = require('@rollup/plugin-commonjs')
const path = require('path')

const libOptions = fs.readDirProSync(path.resolve(__dirname, './src'), {
  deep: true,
  withFileTypes: true,
})
  .filter(f => /\.ts$/.test(f.absolutePath) && !/index\.ts$/.test(f.absolutePath))
  .map(({ absolutePath, name }) => {
    const targetName = `${name.replace(/\.ts$/, '')}.js`
    return {
      input: absolutePath,
      output: {
        file: `./lib/${targetName}`,
        format: 'cjs',
      },
      plugins: [
        del({
          targets: `./lib/${targetName}`,
        }),
        json(),
        reslove(),
        cjs(),
        eslint({
          fix: true,
        }),
        ts({
          module: 'CommonJS',
        }),
      ],
    }
  })

module.exports = [
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'cjs',
    },
    plugins: [
      del({
        targets: './dist/*',
      }),
      json(),
      reslove(),
      cjs(),
      eslint({
        fix: true,
      }),
      ts(),
    ],
  },
  ...libOptions,
]

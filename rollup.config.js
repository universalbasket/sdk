import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'example/index.js',
  output: {
      file:'bundle.js',
      format: 'umd',
      name: 'UBIO_BUNDLE'
  },
  plugins: [
    resolve(),
    commonjs(),
  ]
}

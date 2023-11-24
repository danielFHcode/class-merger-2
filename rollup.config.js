import { defineConfig } from 'rollup';
import ts from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default defineConfig([
    {
        input: 'src/index.ts',
        plugins: [ts()],
        output: [
            {
                format: 'esm',
                file: 'dist/index.mjs',
            },
            {
                format: 'commonjs',
                file: 'dist/index.cjs',
            },
            {
                format: 'umd',
                file: 'dist/index.js',
                name: 'classMerger',
            },
        ],
    },
    {
        input: 'src/index.ts',
        plugins: [dts()],
        output: { file: 'dist/index.d.ts' },
    },
]);

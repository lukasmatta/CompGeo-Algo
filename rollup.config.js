import minify from "rollup-plugin-babel-minify";
import typescript from "rollup-plugin-typescript";

export default [
  {
    input: "./src/index.ts",
    output: {
      name: "svgLibrary",
      file: "dist/svg-library.min.js",
      format: "iife",
      sourcemap: true,
    },
    plugins: [typescript(), , minify({ comments: false })],
  },
];

// 别名设置
import { resolve } from "path";
// ts类型检测
import { defineConfig } from "vite";
// 注入插件
import inject from "@rollup/plugin-inject";
// vite内vue插件
import vuePlugin from "@vitejs/plugin-vue";
// 静态资源压缩插件
import compressPlugin from "vite-plugin-compression";
// 主题配置插件
import themePreprocessorPlugin from "@zougt/vite-plugin-theme-preprocessor";
// wasm plugin
import wasmPack from 'vite-plugin-wasm-pack';

// 配置项
export default defineConfig({
  // 资源跟路径
  base: "/",
  // vue适配插件
  plugins: [
    // 加载插件
    vuePlugin(),
    // 压缩插件
    compressPlugin({
      ext: ".gz",
      verbose: true,
      disable: true,
      threshold: 10240,
      algorithm: "gzip",
      deleteOriginFile: false,
    }),
    // 主题插件
    themePreprocessorPlugin({
      scss: {
        // 是否启用任意主题色模式
        arbitraryMode: false,
        // 预处理器的变量文件
        multipleScopeVars: [
          {
            scopeName: "theme-dark",
            path: resolve("src/assets/style/theme/dark.scss"),
          },
          {
            scopeName: "theme-light",
            path: resolve("src/assets/style/theme/light.scss"),
          },
        ],
        // 默认主题
        defaultScopeName: "theme-dark",
        // 在生产模式是否抽取独立的主题css文件
        extract: false,
      },
    }),
    // wasm wrapper for faceless crypto lib written in Rust
    wasmPack('./faceless-wasm-wrapper'),
  ],
  // JSON解释方式
  json: {
    stringify: true,
  },
  // 资源内联限制
  build: {
    sourcemap: false,

    minify: "esbuild",

    assetsInlineLimit: 0,

    reportCompressedSize: false,

    commonjsOptions: { transformMixedEsModules: true },

    rollupOptions: { plugins: [inject({ Buffer: ["buffer", "Buffer"] })] },
  },
  // 别名配置
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
      {
        find: "process",
        replacement: "process/browser",
      },
      {
        find: "stream",
        replacement: "stream-browserify",
      },
      {
        find: "zlib",
        replacement: "browserify-zlib",
      },
      {
        find: "util",
        replacement: "util",
      },
    ],
  },
  // 服务配置（代理模式）
  server: {
    // 端口号
    port: 3000,
    // 地址
    host: "127.0.0.1",
    // 自动打开
    open: false,
    // 代理
    proxy: {
      // 测试
      "/staging": {
        target: "",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/staging/, ""),
      },

      // 正式
      "/production": {
        target: "",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/production/, ""),
      },
    },
  },
  // 预处理器配置
  css: {
    // 样式插件
    postcss: {
      plugins: [
        require("autoprefixer")({ overrideBrowserslist: ["last 20 versions"], grid: true }),
      ],
    },
    // 样式处理
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
      },
    },
  },
  
});

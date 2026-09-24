# Tools 工具站

基于 Vue 3 + Vite 的纯静态开发者工具站。所有转换都在浏览器本地完成，无需账号、服务端或 API。

## 工具

- JSON 格式化、压缩和校验
- Base64 编码与解码（支持 Unicode）
- URL 编码与解码
- 时间戳转换
- UUID v4 生成
- SHA-256 哈希计算
- 文本统计
- 正则表达式测试

## 本地运行

需要 Node.js 18+。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

`dist/` 是可以托管在任意静态服务器的成品。Vite 使用相对资源路径，可部署在 GitHub Pages 的项目子路径。

## GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**，然后推送到 `main` 分支即可自动构建和发布。若默认分支不同，请修改工作流中的分支名。

## 隐私

输入内容不上传服务器，也不会存入浏览器本地存储。复制功能仅在点击时使用剪贴板权限。

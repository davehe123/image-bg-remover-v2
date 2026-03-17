# Image Background Remover

使用 Cloudflare Workers + Remove.bg API 的图片背景移除工具。

## 🚀 部署步骤

### 1. 获取 Remove.bg API Key
1. 访问 https://www.remove.bg/api
2. 注册账号 → 进入 Dashboard
3. 复制 API Key (免费版 50次/月)

### 2. 部署 Cloudflare Worker

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 进入项目目录
cd projects/image-bg-remover

# 设置 API Key (替换为你的 key)
wrangler secret put REMOVE_BG_API_KEY
# 输入你的 Remove.bg API Key

# 部署
wrangler deploy
```

### 3. 部署前端 (Cloudflare Pages)

```bash
# 在 Cloudflare Dashboard 创建 Pages 项目
# 上传 index.html
# 或使用 wrangler:
wrangler pages deploy .
```

### 4. 配置

修改 `index.html` 中的 API_URL:
```javascript
const API_URL = 'https://your-worker.your-account.workers.dev';
```

## 💰 费用

- **Cloudflare Workers**: 免费 (每月 100,000 请求)
- **Remove.bg**: 免费版 50次/月，超出后 $0.017/张

## 📁 文件结构

```
image-bg-remover/
├── worker.js      # Cloudflare Worker 代码
├── wrangler.toml  # 配置文件
└── index.html     # 前端页面
```

# GEO 官网管理后台

`geo-admin` 是 GEO 官网后台管理项目。官网项目 `yfyk-website` 独立开发，不放在本仓库中。

## 技术栈

- `admin-web`: Next.js + TypeScript + TailwindCSS + Shadcn UI 风格组件
- `api-server`: NestJS + TypeScript
- 数据库: PostgreSQL
- ORM: Prisma
- 鉴权: JWT
- 权限: RBAC
- 部署: Docker Compose

## 业务边界

后台只管理：

- 案例
- FAQ
- 资讯动态

以下官网内容保持静态，由 `yfyk-website` 自行维护：

- 首页
- 服务页
- 知识库
- 术语表
- 专利资质
- 公司简介
- 联系我们

后台仅为这些静态内容提供：

- GEO 配置
- 自动检测
- `llms.txt`
- AI Sitemap
- GEO 评分

## 目录结构

```text
geo-admin/
  admin-web/      # Next.js 管理后台
  api-server/     # NestJS API 服务
  docker-compose.yml
  .env.example
```

## 快速开始

先启动 PostgreSQL（本地开发可用 Docker 只跑数据库）：

```bash
docker compose up postgres -d
```

然后初始化项目并启动：

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

也可以使用 pnpm 执行 seed：

```bash
pnpm prisma db seed
```

访问：

- 管理后台: http://localhost:3000/admin/dashboard
- API 健康检查: http://localhost:3001/api/health
- llms.txt: http://localhost:3000/llms.txt 或 http://localhost:3001/llms.txt
- llms-full.txt: http://localhost:3000/llms-full.txt 或 http://localhost:3001/llms-full.txt
- AI Sitemap: http://localhost:3000/ai-sitemap.xml 或 http://localhost:3001/ai-sitemap.xml

默认登录：

- 账号: `admin`
- 密码: `admin123456`

Seed 会初始化默认管理员、角色权限、9 个静态资源、GEO 配置、示例案例、FAQ、资讯、Schema、GEO 评分和问题诊断。完成 seed 后 Dashboard、内容中心、GEO 配置、llms.txt、AI Sitemap、GEO 评分中心都具备演示数据。

## 开发命令

```bash
npm run lint
npm run build
npm run test:api
```

`npm run test:api` 需要 PostgreSQL 已启动、迁移已执行，并且 `DATABASE_URL` 指向可用数据库。测试覆盖登录、案例 CRUD、FAQ CRUD、资讯 CRUD、GEO 配置保存、llms.txt 生成、AI Sitemap 生成、GEO 评分和公开案例接口。

官网项目 `yfyk-website` 应只调用 `/api/v1` 公开 API，不直接读取后台数据库。

## Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

首次启动后可执行 Prisma migration：

```bash
docker compose exec api-server npm run prisma:migrate
docker compose exec api-server npm run prisma:seed
```

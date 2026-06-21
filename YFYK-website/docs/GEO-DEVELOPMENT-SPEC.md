# YFYK 中国站点 GEO 开发规范

本规范以《AI友好型官网项目主文档 V3.0》为基线，并结合中国站点发布要求执行。新增页面必须同时完成 SSOT、HTML、Markdown、JSON-LD、canonical、sitemap 与 CLA 检查。

## 页面交付

- 页面事实写入 `lib/content/geo-pages.ts`，禁止手写独立 Markdown。
- HTML、Markdown 和 JSON-LD 必须使用同一份内容注册表。
- 子页面按 `aggregate`、`detail`、`editorial`、`company` 四类模板渲染，禁止把全部页面退化为同一份说明书。
- 服务详情页必须包含适用对象、问题、实施方法、步骤、交付物、FAQ、关联页面和咨询入口。
- 普通商业子页将介绍性内容聚合为概览、问题与方案、落地交付和咨询四段，不向用户展示机器验收提示。
- `/knowledge`、`/news`、`/glossary` 保留经过排版的人类可读专业内容；`/glossary` 保留术语定义正文。
- 每个子页面配置 `visualAssets`，至少 1 张、最多 10 张实景图；图片使用 `next/image`、有效 `alt` 与明确尺寸策略。
- 同类服务允许复用统一场景图，避免堆图影响 LCP 和视觉一致性。
- 核心区块必须使用稳定的 kebab-case `id`、`data-ai-chunk`、`data-ai-summary` 与 `data-version`。
- 机器专属内容通过 Markdown、JSON-LD、MCP 与内容协商输出，禁止使用 CSS 隐藏文本或不可见 DOM 填充 SEO 文案。

## Markdown 与协商

- 公开 Markdown 地址为 HTML URL 追加 `.md`。
- `Accept: text/markdown` 或已配置 AI 爬虫 UA 访问 HTML URL 时，中间件重写到内部 Markdown 端点。
- Markdown 必须包含 frontmatter、版本声明、区块锚点和 chunk 标识。
- 单页超过约 8000 tokens 时，按 chunk 拆分，不扩大单次响应。

## Schema

- 根布局注入 `Organization` 与 `WebSite`。
- 详情页注入 `WebPage`、`Service`、`BreadcrumbList` 与可见 FAQ 同源的 `FAQPage`。
- 聚合页注入 `CollectionPage` 与 `ItemList`；术语表注入 `DefinedTermSet`。
- 每个 schema 包含 `dateModified`、`version`、`inLanguage`；`hasPart` 仅声明 HTML 实际可见章节。
- Markdown 保留完整 SSOT 章节，允许包含不在商业 HTML 展示的机器专属工程说明。
- 不写入未公开研究资料、无证据效果数据或未启用的能力。

## 内容治理

- 参考站点仅用于研究信息架构、模块节奏和转化路径，不复制文案、客户名、价格或效果数字。
- 未取得客户授权前，案例统一标记为“典型场景”或“示例项目”，不得冒充已交付案例。
- 禁止写入排名、保证收录、保证引用、默认答案、算法承诺或未经证据白名单允许的百分比数据。
- 资讯和知识栏目只收录可核验的公开来源，并区分正式规则与行业讨论。
- 子页面导航使用独立白底栏；桌面 mega menu 采用引导列、分组入口与行动卡结构，移动端回退为可键盘操作的折叠菜单。

## 中国站点要求

- 所有 HTML 页脚展示 ICP 备案号并链接 `https://beian.miit.gov.cn/`。
- 上线前必须替换“备案中”；公安备案号按实际情况补充。
- 国内 CDN/WAF 验证 `Baiduspider`、`ERNIEBot`、`YiyanBot`、`Bytespider`、`TiantianSpider`、`Kimibot`。
- 涉及境外模型 API、个人信息或重要数据时，执行数据分类分级、字段脱敏与跨境评估。
- 本站首批不提供公众生成内容；C2PA 状态保持 `pending`。

## MCP

- `/api/mcp` 仅提供只读公开事实。
- 输入执行长度限制、提示词注入清洗、参数校验和限流。
- 不返回客户数据、内部研究记录或知识库原文。
- 记录调用工具、成功状态、失败原因与响应时间。

## 构建门禁

- `npm run build` 自动执行 `npm run cla-check`。
- 门禁报告输出到 `reports/geo-check-report.json`。
- 失败项阻断构建；生产环境检查项输出警告。

## 验收指标

- LCP `< 2.5s`
- INP `< 200ms`
- CLS `< 0.1`
- Lighthouse Performance `> 90`
- WCAG 2.1 AA，正文对比度至少 `4.5:1`

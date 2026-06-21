# YFYK GEO 验收清单

## 构建

- [ ] `npm run lint`
- [ ] `npm run cla-check`
- [ ] `npm run build`
- [ ] `reports/geo-check-report.json` 状态为 `passed`

## 页面

- [ ] 23 个 HTML URL 返回 `200`
- [ ] 23 个 `.md` URL 返回 `text/markdown`
- [ ] HTML 可见业务事实与 Markdown 同源；机器专属章节仅通过独立机器路由输出
- [ ] 页面具备 canonical、alternate Markdown 与 JSON-LD
- [ ] 商业子页不展示顶部术语标签、可引用锚点、版本提示、公开依据或合规提示卡片
- [ ] 服务详情页具备适用对象、问题、方法、步骤、交付物、FAQ 与 CTA
- [ ] `/services` 及其后代页面使用“问题 → 方法 → 落地阶段 → 验收交付物”三行映射链路
- [ ] `/services` 使用浅色 B2B 总览布局，展示国内 AI 优先与国际模型兼容平台条
- [ ] `/services` 场景选择支持平滑滚动、hash 更新、短暂高亮与 reduced-motion 回退
- [ ] `/services` FAQ 为 3 项且与 `FAQPage` Schema 同源，两个 CTA 均跳转 `/contact`
- [ ] 导航中的核心产品、老网站AI友好度升级、企业知识库信源构建仅作为分组提示标题，不输出空聚合页链接
- [ ] `/services/products/ai-brand-site` 使用品牌专属长页，包含 Hero、速览、痛点、对比、能力、交付、模块、授权证据空状态、流程 FAQ 与 CTA
- [ ] AI 品牌官网未授权区域不展示客户名称、效果数字、模拟截图或虚构证言
- [ ] `/services/products/ai-global-site` 使用外贸专属长页，包含 Hero、速览、采购痛点、对比、能力、交付、模块、授权证据空状态、流程 FAQ 与 CTA
- [ ] AI 外贸独立站未授权区域不展示客户名称、询盘数字、CPA、模拟截图或虚构证言
- [ ] `/services/upgrade` 整合老网站 AI 友好度升级 5 个原三级服务，导航子项均跳转到同页锚点
- [ ] 老网站升级整合页具备玻璃态锚点菜单、当前模块高亮、5 个服务模块、授权证据空状态、FAQ 与 CTA
- [ ] `/services/knowledge-source` 整合企业知识库信源构建 4 个原三级服务，导航子项均跳转到同页锚点
- [ ] 企业知识库信源整合页具备玻璃态锚点菜单、当前模块高亮、4 个服务模块、授权证据空状态、FAQ 与 CTA
- [ ] 原 `/services/knowledge-source/strategy`、`/engineering`、`/mcp-advanced`、`/operations` 不出现在 sitemap，页面返回 404
- [ ] 企业知识库信源整合页未授权区域不展示客户名称、文档数量、AI 引用占比、咨询提升数据、模拟截图或虚构证言
- [ ] `/knowledge`、`/news`、`/glossary` 保留人类可读专业内容
- [ ] 每个子页至少 1 张、最多 10 张实景图，使用 `next/image` 与有效 `alt`
- [ ] Markdown 保留版本声明、专业知识、公开依据和中国站点合规章节
- [ ] JSON-LD `hasPart` 仅声明 HTML 实际可见章节
- [ ] FAQ 可见内容与 `FAQPage` Schema 同源
- [ ] breadcrumb 使用中文标题，不直接展示英文 slug
- [ ] 案例页仅展示典型场景；未授权内容不出现客户名和效果数字
- [ ] 6 个案例详情页具备独立 HTML、Markdown、canonical、Schema 与 sitemap 记录
- [ ] 未授权案例详情页不出现真实 Logo、模拟指标、伪造截图或虚构证言
- [ ] 禁用 JavaScript 后核心正文可阅读

## 中国站点

- [ ] ICP 备案号已替换为真实值并链接工信部
- [ ] 公安备案号按实际情况补充
- [ ] 国内 CDN/WAF 已验证 AI 爬虫白名单
- [ ] HTML 与 Markdown 缓存按 `Vary: Accept` 隔离

## MCP

```bash
curl http://localhost:3000/api/mcp
curl -X POST http://localhost:3000/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"tool":"get_company_info","arguments":{}}'
curl -H 'Accept: text/markdown' http://localhost:3000/services
```

- [ ] 工具仅返回公开事实
- [ ] 输入清洗、限流和结构化错误正常
- [ ] 日志记录工具、状态和响应时间

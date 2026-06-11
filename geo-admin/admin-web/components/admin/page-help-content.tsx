import type { ReactNode } from "react";

export type PageHelpEntry = {
  title: string;
  content: ReactNode;
};

type HelpSection = {
  title: string;
  children: ReactNode;
};

function HelpSections({ sections }: { sections: HelpSection[] }) {
  return (
    <div className="grid gap-6">
      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
          <div className="mt-2 text-sm leading-6 text-muted-foreground">{section.children}</div>
        </section>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid list-disc gap-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function FieldList({ fields }: { fields: Array<{ name: string; desc: string }> }) {
  return (
    <dl className="grid gap-2">
      {fields.map((field) => (
        <div key={field.name}>
          <dt className="font-medium text-foreground">{field.name}</dt>
          <dd>{field.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

function FlowSteps({ steps }: { steps: string[] }) {
  return <p>{steps.join(" → ")}</p>;
}

type HelpMetricProps = {
  name: string;
  what: string;
  source: string;
  logic: string;
  auto: string;
  editable: string;
  change: string;
  impact: string;
};

function HelpMetric({ name, what, source, logic, auto, editable, change, impact }: HelpMetricProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "是什么", value: what },
    { label: "数据来源", value: source },
    { label: "统计逻辑", value: logic },
    { label: "是否自动", value: auto },
    { label: "是否可修改", value: editable },
    { label: "如何变化", value: change },
    { label: "影响范围", value: impact }
  ];

  return (
    <div className="rounded-md border border-border/80 bg-muted/30 px-4 py-3">
      <p className="font-medium text-foreground">{name}</p>
      <dl className="mt-2 grid gap-1.5">
        {rows.map((row) => (
          <div key={row.label} className="text-sm leading-6">
            <dt className="inline font-medium text-foreground">{row.label}：</dt>
            <dd className="inline text-muted-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function HelpMetricList({ metrics }: { metrics: HelpMetricProps[] }) {
  return (
    <div className="grid gap-4">
      {metrics.map((metric) => (
        <HelpMetric key={metric.name} {...metric} />
      ))}
    </div>
  );
}

export const pageHelpContent: Record<string, PageHelpEntry> = {
  "/admin/dashboard": {
    title: "Dashboard - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "1 页面定位",
            children: (
              <>
                <p>
                  Dashboard 是 GEO 管理后台的<strong className="font-medium text-foreground">只读总览页</strong>
                  ，不承载任何内容的增删改。它的作用是把分散在各业务模块中的数据，通过接口
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">GET /api/v1/admin/dashboard/overview</code>
                  实时聚合后，以卡片形式集中展示。
                </p>
                <p className="mt-2">
                  适合用于：快速判断全站 GEO 健康度、定位低分页面、确认 AI 抓取文件是否已生成、掌握各内容库体量。所有修改操作必须在对应业务模块完成，Dashboard 仅反映结果。
                </p>
              </>
            )
          },
          {
            title: "2 Dashboard 数据来源",
            children: (
              <BulletList
                items={[
                  "内容数量：案例表、FAQ表、资讯表、静态资源表 四张业务表",
                  "GEO 评分：GEO评分表（由评分引擎根据 GEO配置表 自动计算）",
                  "覆盖率：GEO配置表 中的 AI摘要、Schema配置内容 字段",
                  "收录数量：GEO配置表 的 llms收录开关 / Sitemap收录开关，叠加各对象发布状态",
                  "生成时间：llms 与 sitemap 存储目录下的 生成清单文件",
                  "低分页面：GEO评分表 按 总分 从低到高取前 10 条",
                  "最近更新：四张内容表按 更新时间 各取 6 条后合并排序",
                  "高风险问题：GEO问题表 中 严重程度为高 且 状态为待处理 的记录"
                ]}
              />
            )
          },
          {
            title: "3 字段说明",
            children: (
              <HelpMetricList
                metrics={[
                  {
                    name: "GEO总评分",
                    what: "全站所有已评分页面的 GEO 综合得分均值，0–100 分，数值越高表示 AI 友好度越好。",
                    source: "GEO评分表 · 总分字段",
                    logic: "对 GEO评分表 中全部记录的 总分 求算术平均，四舍五入取整。总分 = 抓取维度分 + 理解维度分 + 结构维度分，权重来自系统设置。",
                    auto: "是。打开 Dashboard 或点击「刷新数据」时，后端先执行补全评分流程，再聚合平均值。",
                    editable: "否。Dashboard 不能直接改分数，只能展示计算结果。",
                    change: "在「静态页面 GEO 配置」「Schema 配置」补全字段后，到「页面评分」触发重新评分；或修改系统设置中的评分权重后全量重评。",
                    impact: "反映全站 GEO 整体水平；低分页面增多或配置缺失会导致均值下降。"
                  },
                  {
                    name: "AI Summary覆盖率",
                    what: "已配置 AI Summary 的 GEO 对象占全部 GEO 对象的百分比。",
                    source: "GEO配置表 · AI摘要字段",
                    logic: "分子 = AI摘要 非空且去空格后长度 &gt; 0 的记录数；分母 = GEO配置表 全部记录数；结果四舍五入为百分比。",
                    auto: "是。每次请求总览接口时实时统计。",
                    editable: "否。Dashboard 只展示比例，不能在页面上填写摘要。",
                    change: "在「静态页面 GEO 配置」或内容编辑时补充 AI摘要；新建内容发布后会自动创建 GEO配置表 记录。",
                    impact: "覆盖率偏低说明 AI 可理解性不足，会拉低理解维度分，进而降低 GEO 总评分。"
                  },
                  {
                    name: "Schema覆盖率",
                    what: "已配置 Schema JSON 的 GEO 对象占全部 GEO 对象的百分比。",
                    source: "GEO配置表 · Schema配置内容字段",
                    logic: "分子 = Schema配置内容 已填写的记录数；分母 = GEO配置表 全部记录数；结果四舍五入为百分比。",
                    auto: "是。每次请求总览接口时实时统计。",
                    editable: "否。需在「Schema 配置」模块维护 Schema配置内容。",
                    change: "在 Schema 配置中为页面对象补充合法 JSON-LD；内容发布时部分类型会自动写入默认 Schema类型。",
                    impact: "Schema 缺失会触发高风险问题，降低结构维度分和 GEO 总评分。"
                  },
                  {
                    name: "静态资源数量",
                    what: "后台登记的官网预置静态页面总数，含页面型与集合型资源。",
                    source: "静态资源表",
                    logic: "统计全部记录，不做状态过滤。",
                    auto: "是。数据变更后需刷新 Dashboard 才更新显示。",
                    editable: "否。Dashboard 不能新增或删除静态资源。",
                    change: "静态资源由系统预置同步写入，一般在「静态页面 GEO 配置」中维护 GEO 元数据而非增减资源本身。",
                    impact: "影响「已发布内容数量」中 状态为启用 的静态资源计数部分。"
                  },
                  {
                    name: "案例数量",
                    what: "案例库中的案例条目总数，含草稿、已发布、已归档等全部状态。",
                    source: "案例表",
                    logic: "统计全部记录，不做状态过滤。",
                    auto: "是。案例增删改后需刷新 Dashboard 才更新显示。",
                    editable: "否。须在「案例管理」模块操作。",
                    change: "在案例管理新增案例时 +1；删除案例时 -1；改状态不影响总数，只影响已发布计数。",
                    impact: "案例发布后会创建 GEO配置表 记录并参与评分、收录统计与最近更新列表。"
                  },
                  {
                    name: "FAQ数量",
                    what: "FAQ 库中的问答条目总数，含全部状态。",
                    source: "FAQ表",
                    logic: "统计全部记录，不做状态过滤。",
                    auto: "是。FAQ 增删改后需刷新 Dashboard 才更新显示。",
                    editable: "否。须在「FAQ 管理」模块操作。",
                    change: "新增 FAQ 时 +1；删除时 -1；发布状态变更不改变总数。",
                    impact: "已发布 FAQ 计入已发布内容数量，并参与 GEO 评分与 AI 收录统计。"
                  },
                  {
                    name: "资讯数量",
                    what: "资讯库中的文章条目总数，含全部状态。",
                    source: "资讯表",
                    logic: "统计全部记录，不做状态过滤。",
                    auto: "是。资讯增删改后需刷新 Dashboard 才更新显示。",
                    editable: "否。须在「资讯动态管理」模块操作。",
                    change: "新增资讯时 +1；删除时 -1；发布状态变更不改变总数。",
                    impact: "已发布资讯计入已发布内容数量，并参与 GEO 评分与 AI 收录统计。"
                  },
                  {
                    name: "生成状态",
                    what: "「生成状态」卡片区域，汇总 llms.txt 与 AI Sitemap 的最近生成时间及当前收录数量。",
                    source: "llms / sitemap 存储目录的生成清单文件 + GEO配置表收录开关",
                    logic: "卡片内展示四项子指标：llms 最近生成时间、sitemap 最近生成时间、llms 收录数量、sitemap 收录数量。",
                    auto: "收录数量为实时统计；生成时间为读取已发布生成清单中的生成时间戳字段。",
                    editable: "否。Dashboard 不能触发生成，只能展示状态。",
                    change: "在「llms.txt 管理」「AI Sitemap 管理」点击生成并发布后，生成时间与收录数量才会更新。",
                    impact: "生成文件直接影响 AI 爬虫能否发现站点内容；未生成时对外访问返回预览或空状态。"
                  },
                  {
                    name: "llms.txt状态",
                    what: "llms.txt 文件的发布状态，包含「最近一次 llms.txt 生成时间」与「llms.txt 收录数量」。",
                    source: "生成清单文件（llms 存储目录）+ GEO配置表 · llms收录开关",
                    logic:
                      "生成时间：读取生成时间戳，未生成显示「未生成」。收录数量：统计 llms收录开关=开启 且对象满足发布条件的条目——静态资源 状态=启用，案例/FAQ/资讯 状态=已发布。",
                    auto: "收录数量自动统计；生成时间仅在「llms.txt 管理」执行生成并发布后写入。",
                    editable: "否。",
                    change: "开启 llms收录开关 → 收录数量增加；在 llms.txt 管理生成发布 → 生成时间更新。",
                    impact: "llms.txt 是 AI 抓取入口文件，未生成或收录过少会降低抓取维度分。"
                  },
                  {
                    name: "AI Sitemap状态",
                    what: "AI Sitemap 文件的发布状态，包含「最近一次 AI Sitemap 生成时间」与「AI Sitemap 收录数量」。",
                    source: "生成清单文件（sitemap 存储目录）+ GEO配置表 · Sitemap收录开关",
                    logic:
                      "生成时间：读取生成时间戳，未生成显示「未生成」。收录数量：统计 Sitemap收录开关=开启 且对象满足发布条件的条目，条件同 llms.txt。",
                    auto: "收录数量自动统计；生成时间仅在「AI Sitemap 管理」执行生成并发布后写入。",
                    editable: "否。",
                    change: "开启 Sitemap收录开关 并设置合理 Sitemap优先级 → 收录数量变化；在 AI Sitemap 管理生成发布 → 生成时间更新。",
                    impact: "影响 AI 发现站点内容的效率，未纳入 sitemap 的对象抓取维度分会被扣分。"
                  },
                  {
                    name: "最近更新时间",
                    what: "指 llms.txt 与 AI Sitemap 各自生成清单中记录的生成时间戳，即文件最后一次成功生成并发布的时间。",
                    source: "llms 与 sitemap 存储目录中生成清单文件的生成时间戳字段",
                    logic: "后端读取两个存储目录的生成清单文件；字段存在则格式化为本地时间显示，不存在显示「未生成」。",
                    auto: "否。不会随内容变更自动更新，只有执行生成发布动作后才变化。",
                    editable: "否。不能手动改写时间，只能通过重新生成文件来刷新。",
                    change: "分别在 llms.txt 管理与 AI Sitemap 管理中点击「生成并发布」。",
                    impact: "时间过久说明 AI 抓取文件可能未包含最新内容，建议内容或 GEO 配置大批量变更后重新生成。"
                  },
                  {
                    name: "低分页面列表",
                    what: "全站 GEO 总分最低的 10 个页面，展示标题、URL、总分及抓取/理解/结构三个维度分。",
                    source: "GEO评分表，关联 静态资源表 / 案例表 / FAQ表 / 资讯表 取标题",
                    logic: "按总分从低到高排序，同分按评分更新时间倒序，取前 10 条。每条显示 抓取维度分/30、理解维度分/30、结构维度分/40。",
                    auto: "是。请求时先补全缺失评分再查询；评分本身在配置变更后需重新评分才更新。",
                    editable: "否。列表只读，点击条目跳转到对应管理模块。",
                    change: "优化对应页面的 GEO 配置、Schema、AI Summary 后重新评分，分数上升则可能退出低分列表。",
                    impact: "是优化工作的优先级入口；此处页面通常是全站 GEO 最薄弱环节。"
                  },
                  {
                    name: "最近内容更新",
                    what: "全站最近被编辑过的 10 条内容，覆盖静态资源、案例、FAQ、资讯四种类型。",
                    source: "静态资源表、案例表、FAQ表、资讯表 的 更新时间 字段",
                    logic: "四表各按更新时间倒序取 6 条，合并后按时间降序排序，取前 10 条。展示标题、类型标签、更新时间。",
                    auto: "是。任何内容保存操作都会更新更新时间，刷新 Dashboard 后即可看到。",
                    editable: "否。列表只读，点击跳转到对应编辑模块。",
                    change: "在任一内容模块保存编辑记录，该条目的更新时间刷新，可能进入此列表。",
                    impact: "帮助快速发现最近谁改了什么内容；本身不影响评分，但内容变更后通常需要重新评分和重新生成 AI 文件。"
                  }
                ]}
              />
            )
          },
          {
            title: "4 自动更新逻辑",
            children: (
              <BulletList
                items={[
                  "打开 Dashboard 时自动请求总览接口，完成首次加载",
                  "每次请求总览前，后端自动执行补全评分流程：为缺少评分的 GEO配置表 记录补算分数，清理已失效对象的评分",
                  "数量类指标（案例/FAQ/资讯/静态资源）在接口请求时实时统计，但前端不会轮询，需手动刷新才更新屏幕",
                  "覆盖率类指标每次请求时实时计算，反映当前 GEO配置表 填写情况",
                  "llms / sitemap 收录数量每次请求时实时统计，不依赖文件是否已生成",
                  "生成时间仅在实际执行「生成并发布」后写入生成清单，不会随内容编辑自动变化",
                  "最近内容更新列表依赖各表更新时间，保存内容后刷新 Dashboard 即可反映"
                ]}
              />
            )
          },
          {
            title: "5 手动操作说明",
            children: (
              <>
                <p>Dashboard 上唯一可执行的操作是顶部工具栏的<strong className="font-medium text-foreground">「刷新数据」</strong>按钮。</p>
                <BulletList
                  items={[
                    "点击后重新调用总览接口，拉取最新聚合结果",
                    "低分页面条目可点击，跳转到对应管理模块（静态页面 GEO 配置 / 案例 / FAQ / 资讯）",
                    "生成状态区域可点击，跳转到 llms.txt 管理或 AI Sitemap 管理",
                    "最近内容更新条目可点击，跳转到对应编辑模块",
                    "Dashboard 不提供新增、编辑、删除、发布、生成文件等写操作"
                  ]}
                />
              </>
            )
          },
          {
            title: "6 数据刷新机制",
            children: (
              <BulletList
                items={[
                  "首次进入页面：打开时自动加载总览数据，等效于自动刷新一次",
                  "之后不会自动轮询或 WebSocket 推送，屏幕数据停留在上次加载结果",
                  "内容变更、GEO 配置修改、重新评分、生成 AI 文件后，必须点击「刷新数据」才能看到最新数字",
                  "刷新期间按钮禁用，防止重复请求；完成后状态栏显示「Dashboard 数据已更新」",
                  "接口失败时显示「Dashboard 加载失败」，原有数据保留不清空"
                ]}
              />
            )
          },
          {
            title: "7 修改影响范围",
            children: (
              <BulletList
                items={[
                  "案例 / FAQ / 资讯：影响对应数量、已发布内容数量、最近内容更新、收录数量（需已发布）、GEO配置表 与评分",
                  "静态页面 GEO 配置：影响 AI Summary 覆盖率、Schema 覆盖率、GEO 总评分、低分页面列表、收录数量",
                  "Schema 配置：影响 Schema 覆盖率、结构维度分、高风险问题数量",
                  "页面评分（重新评分）：影响 GEO 总评分、低分页面列表、高风险问题数量",
                  "llms.txt 管理（生成发布）：影响 llms.txt 最近生成时间、对外 llms.txt 文件内容",
                  "AI Sitemap 管理（生成发布）：影响 AI Sitemap 最近生成时间、对外 ai-sitemap.xml 内容",
                  "系统设置（评分权重）：修改后需全量重新评分，GEO 总评分与低分页面排名会变化"
                ]}
              />
            )
          },
          {
            title: "8 常见问题",
            children: (
              <dl className="grid gap-3">
                <div>
                  <dt className="font-medium text-foreground">刷新了但数字没变？</dt>
                  <dd>确认修改是否已保存到数据库。评分类指标需先在「页面评分」重新评分；生成时间需先在抓取中心执行「生成并发布」。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">案例数量包含草稿吗？</dt>
                  <dd>包含。案例数量统计案例表全部记录。「已发布内容数量」才只计状态为已发布的案例。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">收录数量大于 0 但生成时间显示「未生成」？</dt>
                  <dd>收录数量是实时统计 GEO配置表 收录开关，与文件是否发布无关。需在抓取中心生成并发布后，生成时间才会出现。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">GEO 总评分为什么和单页分数对不上？</dt>
                  <dd>总评分是所有 GEO评分表 记录的平均值，不是某一条页面分数。个别页面优化会拉动均值，但幅度取决于全站页面数量。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">能否在 Dashboard 直接改数据？</dt>
                  <dd>不能。Dashboard 是纯展示层，所有写操作必须在对应业务模块完成，再回到 Dashboard 刷新验证效果。</dd>
                </div>
              </dl>
            )
          }
        ]}
      />
    )
  },
  "/admin/geo/static-pages": {
    title: "静态页面 GEO 配置 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "1 页面定位",
            children: (
              <>
                <p>
                  静态页面 GEO 配置是 GEO 管理后台的<strong className="font-medium text-foreground">预置静态资源 GEO 元数据维护页</strong>
                  。它管理官网
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">staticPageRegistry</code>
                  中登记的 8 个静态页面（首页、三大服务页、术语表、关于我们、专利资质、联系我们）在
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">geo_configs</code>
                  表中的 AI Summary、Schema、收录开关与 Sitemap 优先级。
                </p>
                <p className="mt-2">
                  适合用于：补充 AI 可理解的页面摘要、调整 AI Sitemap / llms.txt 收录范围、维护结构化数据、触发单页重新评分。本页<strong className="font-medium text-foreground">不能编辑页面正文</strong>
                  （正文由官网项目维护），不能新增或删除静态资源；页面名称、路径、类型由 registry 预置同步，通常不可在本页修改。
                </p>
              </>
            )
          },
          {
            title: "2 数据来源",
            children: (
              <BulletList
                items={[
                  "静态资源列表：静态资源表（static_resources），由 seed 根据 staticPageRegistry 写入，接口 GET /api/v1/static-resources/static-pages",
                  "页面名称 / 路径 / 类型：registry 的 title、path、pageType → 映射为 resourceType（页面 / 集合 / 资质）",
                  "GEO 可编辑字段：GEO配置表（geo_configs），target_type = STATIC_RESOURCE，与静态资源一对一关联",
                  "Registry 预置默认值：seed 时从 registry 的 aiSummary、schemaType、priority、includeInLlms、includeInAiSitemap 写入 geo_configs 初值",
                  "Robots 策略 / GEO 评分参与范围：registry 的 robotsPolicy、includeInGeoScore，不在 geo_configs 中存储，本页不可改",
                  "对外读取：官网通过 GET /api/v1/public/static-pages/{resource_key}/geo-config 拉取已保存配置"
                ]}
              />
            )
          },
          {
            title: "3 字段说明",
            children: (
              <HelpMetricList
                metrics={[
                  {
                    name: "页面名称",
                    what: "静态页面在后台与官网展示的中文标题，如「首页」「GEO原生建站」「术语表」。列表左侧与编辑区顶部均展示此名称。",
                    source: "静态资源表 · title 字段；源头为 staticPageRegistry[].title",
                    logic: "seed / registry 同步时写入；resource_key 与 registry key 一一对应（如 home、geo_native_website）。",
                    auto: "是。registry 变更后重新 seed 会 upsert 更新 title，但本页不提供编辑框。",
                    editable: "否。只读展示；需修改 registry 源码并重新 seed。",
                    change: "编辑 shared/static-pages.ts 中对应条目的 title → 运行数据库 seed → 刷新本页。",
                    impact: "影响列表显示、详情标题、llms.txt / AI Sitemap 中的页面标题、公开 API 返回值；不影响 URL 路径。"
                  },
                  {
                    name: "页面路径",
                    what: "静态页面在官网的路由 pathname，如 /、/geo-native-website、/glossary、/about/patents。编辑区副标题与列表项第二行展示。",
                    source: "静态资源表 · url 字段；源头为 staticPageRegistry[].path",
                    logic: "与 slug、canonical 默认值关联；seed 时 url = registry.path，slug 由 pathToSlug() 生成。",
                    auto: "是。registry 同步写入，本页不可改。",
                    editable: "否。只读展示。",
                    change: "修改 registry 的 path → 重新 seed；同时需官网路由与正文文件保持一致。",
                    impact: "影响 AI Sitemap 的 loc、llms.txt 链接、canonical 默认值、Dashboard 低分页面跳转；路径错误会导致 AI 抓取 404。"
                  },
                  {
                    name: "页面类型",
                    what: "静态资源在 GEO 体系中的分类标签：页面（普通单页）、集合（如术语表）、资质（如专利 & 高新技术企业）。列表 Badge 展示。",
                    source: "静态资源表 · resource_type 字段；由 registry.pageType 经 resolveStaticResourceType() 映射",
                    logic: "knowledge → 集合；about_patents key → 资质；其余 → 页面。决定页面在 Scope 卡片中的分组说明。",
                    auto: "是。registry 预置，seed 写入。",
                    editable: "否。本页只读 Badge，不提供类型切换。",
                    change: "修改 registry 的 pageType 或 key 规则 → 重新 seed。",
                    impact: "影响后台分类展示与运营认知；术语表、专利页不进入内容中心，但参与 GEO 配置与检测。"
                  },
                  {
                    name: "AI Summary",
                    what: "供 AI 快速理解该页面核心定位与价值的摘要文本，建议 50–300 字，覆盖页面服务什么、解决什么问题。是理解维度分的核心输入。",
                    source: "GEO配置表 · ai_summary 字段；初值来自 registry.aiSummary，之后由运营在本页维护",
                    logic: "评分引擎检查：非空 +15 分，长度 50–300 再 +5；缺失触发高风险 missing_ai_summary。llms.txt 生成时作为 summary 输出。",
                    auto: "否。seed 提供模板句，需运营按页面实际情况改写。",
                    editable: "是。编辑区「AI Summary」文本域 →「保存配置」。",
                    change: "选中页面 → 填写/修改摘要 → 保存配置 → 建议点「重新评分」→ 到抓取中心重新生成 llms.txt / AI Sitemap。",
                    impact: "影响理解维度分、GEO 总评分、Dashboard AI Summary 覆盖率、llms.txt 摘要内容、高风险问题列表。"
                  },
                  {
                    name: "GEO Priority",
                    what: "即编辑区「Sitemap 优先级」（geo_configs.sitemap_priority），取值 0–1，数值越高表示在 AI Sitemap 中越重要。首页 registry 默认 1.0，核心服务页 0.95，术语表 0.75 等。",
                    source: "GEO配置表 · sitemap_priority 字段；seed 初值 = staticPageRegistry[].priority",
                    logic: "生成 ai-sitemap.xml 时写入 &lt;priority&gt; 标签；同文件内条目按 priority 降序排列。若仍为默认 0.5 且 registry 有非 0.5 默认值，生成时回退用 registry 默认。",
                    auto: "部分。seed 时按 registry 写入初值；之后保存配置时以本页输入为准。",
                    editable: "是。编辑区「Sitemap 优先级」数字框（step 0.1，范围 0–1）→ 保存配置。",
                    change: "调高首页/核心服务页优先级 → 保存 → 到「AI Sitemap 管理」生成并发布。",
                    impact: "影响 /ai-sitemap.xml 中该 URL 的 priority 值与排序；间接影响 AI 爬虫发现顺序，不直接改官网 HTML。"
                  },
                  {
                    name: "是否纳入 AI Sitemap",
                    what: "控制该页面是否进入对外 AI Sitemap（/ai-sitemap.xml）。编辑区开关「进入 AI Sitemap」对应 geo_configs.sitemap_enabled。",
                    source: "GEO配置表 · sitemap_enabled 字段；seed 初值 = registry.includeInAiSitemap（当前均为 true）",
                    logic: "生成 Sitemap 时仅收集 sitemap_enabled = true 且对象 status = ACTIVE（静态资源）的配置；关闭后该 URL 不出现在 ai-sitemap.xml。",
                    auto: "否。开关由运营在本页维护，默认 seed 为开启。",
                    editable: "是。编辑区复选框 → 保存配置。",
                    change: "关闭开关 → 保存 → 到「AI Sitemap 管理」执行「生成并发布」才生效于对外文件。",
                    impact: "影响 /ai-sitemap.xml 是否含该 URL、Dashboard AI Sitemap 收录数量、抓取维度分（关闭扣 10 分并产生 missing_sitemap 问题）。"
                  },
                  {
                    name: "是否纳入 llms.txt",
                    what: "控制该页面是否进入对外 llms.txt（/llms.txt）。编辑区开关「进入 llms.txt」对应 geo_configs.llms_enabled。",
                    source: "GEO配置表 · llms_enabled 字段；seed 初值 = registry.includeInLlms（当前均为 true）",
                    logic: "生成 llms.txt 时仅收集 llms_enabled = true 的配置；静态页还需 registry.includeInLlms = true 且 static_resources.status = ACTIVE。",
                    auto: "否。开关由运营在本页维护。",
                    editable: "是。编辑区复选框 → 保存配置。",
                    change: "关闭/开启 → 保存 → 到「llms.txt 管理」执行「生成并发布」。",
                    impact: "影响 /llms.txt 是否列出该页面及 AI Summary 摘要、Dashboard llms 收录数量、抓取维度分（关闭扣 10 分）。"
                  },
                  {
                    name: "Schema 类型",
                    what: "该页面 JSON-LD 的 @type 类型名，如 WebSite、Service、DefinedTermSet、AboutPage、ContactPage。与 Schema JSON 内容配合，帮助搜索引擎与 AI 理解页面语义。",
                    source: "GEO配置表 · schema_type 字段；seed 初值 = registry.schemaType；未配置时前端回退 WebPage",
                    logic: "保存时与 schema_json 一并 PATCH；评分引擎检查 schema_json 合法性与类型匹配度，影响结构维度分。",
                    auto: "部分。seed 按 registry 写入默认类型；Schema JSON 同步生成默认 @type。",
                    editable: "是。编辑区「Schema 类型」输入框 +「Schema JSON」文本域 → 保存配置（JSON 须合法）。",
                    change: "修改类型与 JSON → 保存 → 重新评分；官网渲染 Schema 时读取公开 API。",
                    impact: "影响结构维度分、Dashboard Schema 覆盖率、高风险 Schema 问题、官网结构化数据展示。"
                  },
                  {
                    name: "Robots 策略",
                    what: "页面级爬虫索引策略，当前 registry 统一为 index,follow，表示允许搜索引擎与 AI 爬虫索引并跟踪链接。用于官网 metadata robots 配置参考。",
                    source: "staticPageRegistry[].robotsPolicy；不在 geo_configs 中存储",
                    logic: "预置常量，随 registry 定义；本页 UI 不展示、不可编辑此字段。",
                    auto: "是。registry 硬编码，seed 不同步到 geo_configs。",
                    editable: "否。需修改 registry 与官网页面 metadata 才能变更。",
                    change: "编辑 shared/static-pages.ts 中 robotsPolicy → 同步官网 Next.js metadata → 重新部署官网。",
                    impact: "影响搜索引擎/爬虫是否索引该页；与 llms/sitemap 收录开关独立——即使 robots 允许，关闭 sitemap/llms 开关仍不会进入 AI 抓取文件。"
                  },
                  {
                    name: "GEO评分权重",
                    what: "该静态页面参与全站 GEO 评分的权重与 crawl 加分规则：① registry.includeInGeoScore 决定该页是否纳入 geo_scores 统计；② sitemap_priority 在 0.1–1.0 时为抓取维度 +5 分，否则产生 invalid_sitemap_priority 低风险问题。",
                    source: "registry.includeInGeoScore（是否参与评分）+ GEO配置表 · sitemap_priority（优先级合理性加分）",
                    logic: "单页总分 = 抓取维度（最高 30）+ 理解维度（最高 30）+ 结构维度（最高 40），权重来自系统设置。静态页抓取分含：canonical +5、llms +10、sitemap +10、合理 priority +5。",
                    auto: "部分。includeInGeoScore 由 registry 决定；priority 加分随 sitemap_priority 保存后生效，需「重新评分」才写入 geo_scores。",
                    editable: "间接。本页可改 sitemap_priority 与收录开关影响抓取分；includeInGeoScore 仅能通过 registry 变更。",
                    change: "调整 Sitemap 优先级 / 收录开关 / AI Summary / Schema → 保存 → 点「重新评分」或到「GEO评分」批量重评。",
                    impact: "影响本页 GEO 分数、Dashboard GEO 总评分均值、低分页面列表、高风险问题数量。"
                  },
                  {
                    name: "更新时间",
                    what: "记录静态资源或 GEO 配置最后一次变更的时间。本页 UI 未单独展示，但后台数据有两个时间戳：static_resources.updated_at（资源同步时间）与 geo_configs.updated_at（配置保存时间）。",
                    source: "静态资源表 · updated_at；GEO配置表 · updated_at（保存配置时刷新）",
                    logic: "AI Sitemap 生成时静态页的 lastmod 取 static_resources.updated_at；Dashboard「最近内容更新」也读取静态资源 updated_at。",
                    auto: "是。保存 GEO 配置或 seed 同步时由数据库 @updatedAt 自动刷新。",
                    editable: "否。不能手动改写时间戳。",
                    change: "点「保存配置」更新 geo_configs.updated_at；registry seed 更新资源元数据时更新 static_resources.updated_at。",
                    impact: "影响 AI Sitemap 中 &lt;lastmod&gt;、Dashboard 最近更新列表；修改 GEO 配置后若不重新生成 Sitemap，对外 lastmod 可能滞后直至下次生成。"
                  }
                ]}
              />
            )
          },
          {
            title: "4 自动更新逻辑",
            children: (
              <BulletList
                items={[
                  "打开本页时自动请求 static-pages 接口，加载全部预置静态资源及其 geo_configs",
                  "切换左侧列表项时即时切换编辑区，未保存修改仅在前端 state，不会自动持久化",
                  "seed 脚本会根据 staticPageRegistry upsert 静态资源 title/url/type，但不会覆盖已有 geo_configs 的 AI Summary 等运营字段",
                  "保存配置后 geo_configs.updated_at 自动刷新；不会自动触发重新评分或重新生成 AI 文件",
                  "公开 API 读取的是已保存的 geo_configs 快照，保存后立即生效，无需重新生成 llms/sitemap",
                  "对外 /llms.txt 与 /ai-sitemap.xml 仅在抓取中心「生成并发布」后才包含最新收录开关与 priority"
                ]}
              />
            )
          },
          {
            title: "5 手动操作说明",
            children: (
              <>
                <p>
                  标准维护流程：
                  <strong className="font-medium text-foreground">选择页面 → 补全 AI Summary / Schema → 调整收录开关与优先级 → 保存配置 → 重新评分 → 生成 AI Sitemap 与 llms.txt</strong>
                  。
                </p>
                <BulletList
                  items={[
                    "左侧搜索：按页面名称、URL、resource_key 过滤列表",
                    "「保存配置」：PATCH geo-config，写入 AI Summary、Meta、Schema、收录开关、sitemap_priority",
                    "「重新评分」：POST rescore，仅对当前选中页触发评分引擎，更新 geo_scores 与 geo_checks",
                    "Schema JSON 保存前须通过 JSON.parse 校验，格式错误会阻止保存",
                    "本页不能：新增/删除静态页、改正文、改页面名称/路径/类型/Robots 策略"
                  ]}
                />
              </>
            )
          },
          {
            title: "6 修改影响范围",
            children: (
              <BulletList
                items={[
                  "AI Summary / Meta / Schema → 理解维度分、结构维度分、公开 geo-config API、llms.txt 摘要",
                  "开启/关闭 AI Sitemap → /ai-sitemap.xml 条目、Dashboard sitemap 收录数、抓取维度分",
                  "开启/关闭 llms.txt → /llms.txt 条目、Dashboard llms 收录数、抓取维度分",
                  "Sitemap 优先级 → ai-sitemap.xml 的 priority 与排序、抓取维度 priority 加分",
                  "保存后 → Dashboard AI Summary / Schema 覆盖率、GEO 总评分（需重新评分后）、低分页面列表",
                  "registry 级字段（名称/路径/类型/Robots）→ 需 seed + 官网部署，影响全站静态资源范围"
                ]}
              />
            )
          },
          {
            title: "7 常见问题",
            children: (
              <dl className="grid gap-3">
                <div>
                  <dt className="font-medium text-foreground">保存了但 ai-sitemap.xml 没变？</dt>
                  <dd>保存只更新数据库。收录开关、priority 变更需到「AI Sitemap 管理」点击「生成并发布」，对外文件才会更新。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">GEO Priority 和 registry 里的 priority 什么关系？</dt>
                  <dd>seed 时用 registry.priority 初始化 sitemap_priority。之后以本页保存值为准；若仍为 0.5 且 registry 有非 0.5 默认，生成 Sitemap 时会临时回退用 registry 默认。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">关了 llms 开关为什么 Dashboard 收录数还很高？</dt>
                  <dd>Dashboard 收录数统计 geo_configs 中 llms_enabled=true 的记录，保存后立即反映。但对外 llms.txt 文件需重新生成才移除该页。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">重新评分和保存配置有什么区别？</dt>
                  <dd>保存配置只写 geo_configs。重新评分根据当前配置运行评分引擎，写入 geo_scores / geo_checks，更新页头 GEO 分数 Badge 与 Dashboard 指标。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">能否在本页改页面路径或新增静态页？</dt>
                  <dd>不能。静态页范围由 staticPageRegistry 锁定。扩页需改 registry + 官网路由 + 重新 seed；本页仅维护已有 8 个资源的 GEO 元数据。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Robots 策略在哪里改？</dt>
                  <dd>不在本页。Robots 来自 registry.robotsPolicy，需改 registry 并同步官网页面的 metadata robots 配置后部署官网。</dd>
                </div>
              </dl>
            )
          }
        ]}
      />
    )
  },
  "/admin/content/faqs": {
    title: "FAQ管理 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "页面介绍",
            children:
              "用于统一管理官网 FAQ 内容。FAQ 会同步展示在官网 FAQ 中心，并作为 AI 理解企业知识的重要内容来源。"
          },
          {
            title: "功能说明",
            children: (
              <BulletList items={["新增 FAQ", "编辑 FAQ", "删除 FAQ", "发布 FAQ", "分类管理"]} />
            )
          },
          {
            title: "字段说明",
            children: (
              <FieldList
                fields={[
                  { name: "问题", desc: "用户最关心的问题。" },
                  { name: "答案", desc: "标准答案。" },
                  { name: "分类", desc: "GEO、官网建设、企业知识库、AI搜索、MCP。" },
                  { name: "排序", desc: "数字越小越靠前。" },
                  { name: "状态", desc: "草稿或发布。" }
                ]}
              />
            )
          },
          {
            title: "操作流程",
            children: <FlowSteps steps={["新增FAQ", "填写问题", "填写答案", "选择分类", "发布"]} />
          },
          {
            title: "最佳实践",
            children: (
              <BulletList
                items={["优先回答客户决策问题", "答案控制在100~400字", "先结论后解释", "避免纯概念解释"]}
              />
            )
          }
        ]}
      />
    )
  },
  "/admin/content/cases": {
    title: "案例管理 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "页面介绍",
            children: "用于管理案例中心和首页推荐案例。"
          },
          {
            title: "字段说明",
            children: (
              <FieldList
                fields={[
                  { name: "标题", desc: "案例名称。" },
                  { name: "Slug", desc: "案例URL。" },
                  { name: "案例类型", desc: "GEO原生建站、AI友好度升级、企业知识库工程。" },
                  { name: "行业", desc: "客户行业。" },
                  { name: "展示名称", desc: "官网显示名称，建议脱敏。" },
                  { name: "摘要", desc: "案例简介。" },
                  { name: "挑战", desc: "客户面临的问题。" },
                  { name: "方案", desc: "解决方案。" },
                  { name: "结果", desc: "项目成果。" },
                  { name: "指标数据", desc: "量化成果。" },
                  { name: "正文", desc: "案例详情内容。" },
                  { name: "首页推荐", desc: "是否显示到首页。" }
                ]}
              />
            )
          },
          {
            title: "操作流程",
            children: (
              <FlowSteps
                steps={["新增案例", "上传封面", "填写摘要", "填写挑战", "填写方案", "填写结果", "发布"]}
              />
            )
          },
          {
            title: "最佳实践",
            children: (
              <BulletList items={["避免客户敏感信息", "优先突出成果", "尽量使用脱敏案例"]} />
            )
          }
        ]}
      />
    )
  },
  "/admin/content/news": {
    title: "资讯管理 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "页面介绍",
            children: "用于发布行业洞察与企业内容。"
          },
          {
            title: "字段说明",
            children: (
              <FieldList
                fields={[
                  { name: "标题", desc: "资讯标题。" },
                  { name: "Slug", desc: "资讯URL路径。" },
                  { name: "分类", desc: "内容分类。" },
                  { name: "来源", desc: "内容来源。" },
                  { name: "作者", desc: "作者名称。" },
                  { name: "发布日期", desc: "对外展示日期。" },
                  { name: "摘要", desc: "资讯简介。" },
                  { name: "正文", desc: "资讯详情内容。" }
                ]}
              />
            )
          },
          {
            title: "操作流程",
            children: <FlowSteps steps={["新增资讯", "填写内容", "发布"]} />
          },
          {
            title: "最佳实践",
            children: (
              <>
                <p className="mb-2">优先发布：</p>
                <BulletList items={["AI搜索", "GEO洞察", "企业知识库", "官网建设"]} />
                <p className="mb-2 mt-3">避免：</p>
                <BulletList items={["公司流水账", "无价值新闻"]} />
              </>
            )
          }
        ]}
      />
    )
  },
  "/admin/leads": {
    title: "官网留言 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "1 页面定位",
            children: (
              <>
                <p>
                  官网留言是 GEO 管理后台的<strong className="font-medium text-foreground">咨询线索处理页</strong>
                  ，用于查看、筛选和跟进用户在官网各页面提交的咨询表单。数据通过接口
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">GET /api/v1/admin/leads</code>
                  读取，处理结果通过
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">PATCH /api/v1/admin/leads/:id</code>
                  写回。
                </p>
                <p className="mt-2">
                  适合用于：每日查看新咨询、按来源页面分析转化入口、记录销售跟进过程、标记无效线索。本页<strong className="font-medium text-foreground">不能代用户提交留言</strong>
                  ，也不能修改用户填写的姓名、联系方式等原始字段；所有用户侧内容在官网表单提交时一次性写入留言表。
                </p>
              </>
            )
          },
          {
            title: "2 数据来源",
            children: (
              <BulletList
                items={[
                  "留言列表与详情：留言表（leads），按提交时间倒序分页返回",
                  "顶部统计卡片：留言表实时聚合——今日新增（created_at ≥ 今日 0 点）、待跟进（status = NEW 或 FOLLOWING）、已处理（status = DONE）、总留言数",
                  "用户填写字段：官网 ContactInquiryForm 提交时写入，经公开接口 POST /api/v1/leads 入库",
                  "来源追踪字段：官网前端根据当前 pathname、弹窗入口、按钮文案自动采集后随表单提交",
                  "Referrer / User Agent / IP：公开接口从 HTTP 请求头与服务端 IP 解析后自动写入，后台只读展示",
                  "状态与备注：留言表 status、note 字段，默认 NEW / 空，仅后台运营人员可修改"
                ]}
              />
            )
          },
          {
            title: "3 字段说明",
            children: (
              <HelpMetricList
                metrics={[
                  {
                    name: "姓名",
                    what: "用户在官网咨询表单中填写的联系人姓名，用于销售/客服识别来电对象。必填，最长 100 字符。",
                    source: "留言表 · name 字段；由官网表单 name 输入框提交",
                    logic: "用户手动填写；后端 sanitizeRequiredText 校验非空后入库。",
                    auto: "否。仅在用户点击「提交咨询」并成功调用公开接口时写入一次。",
                    editable: "否。后台详情抽屉只读展示，不提供编辑入口。",
                    change: "无法在本页修改。若用户填错，需用户重新提交，或运营在备注中记录正确信息。",
                    impact: "参与列表关键词搜索（姓名 / 公司 / 联系方式 / 留言）；不影响 GEO 评分、官网内容或其它模块。"
                  },
                  {
                    name: "公司名称",
                    what: "用户所属企业名称，选填，用于判断客户规模与行业背景。未填写时列表与详情显示「—」。",
                    source: "留言表 · company_name 字段；由官网表单 company 输入框提交",
                    logic: "用户选填；为空时存 null，最长 200 字符。",
                    auto: "否。随表单一次性提交写入。",
                    editable: "否。后台只读。",
                    change: "无法在本页修改。",
                    impact: "参与关键词搜索；不影响其它业务模块。"
                  },
                  {
                    name: "联系方式",
                    what: "用户留下的回电/回邮方式，可填手机号、微信或邮箱。必填，是跟进线索的核心字段。",
                    source: "留言表 · contact 字段；由官网表单 contact 输入框提交",
                    logic: "用户手动填写；后端校验非空，最长 200 字符。",
                    auto: "否。随表单一次性提交写入。",
                    editable: "否。后台只读。",
                    change: "无法在本页修改。跟进时请直接复制详情中的联系方式外呼或发信。",
                    impact: "参与关键词搜索；不影响其它业务模块。"
                  },
                  {
                    name: "需求类型",
                    what: "用户选择的咨询意向分类，固定五档：GEO原生建站、老网站AI友好度升级、企业知识库工程、网站诊断、其他咨询。",
                    source: "留言表 · demand_type 字段；官网下拉选项 contactNeedOptions 的 label 值",
                    logic: "用户从下拉框单选；提交时将选项中文 label 写入（非内部 value 码）。",
                    auto: "否。用户必选后才能提交。",
                    editable: "否。后台只读；列表页可用「需求类型」筛选项过滤。",
                    change: "无法在本页修改。若用户选错类型，可在备注中记录实际诉求。",
                    impact: "影响列表筛选与线索分派优先级；不影响 GEO 配置或官网展示。"
                  },
                  {
                    name: "来源页面",
                    what: "用户提交表单时所在的官网 URL 路径（pathname），用于判断用户从哪个官网页面发起咨询，例如 /、/contact、/geo-native-website、/cases/某案例 slug。",
                    source: "留言表 · source_page 字段；官网 usePathname() 在提交瞬间采集",
                    logic: "前端取当前路由 pathname，缺省为 /；与页面标题（source_page_title）成对出现，列表默认展示路径。",
                    auto: "是。提交时由官网前端自动写入，用户不可见、不可编辑。",
                    editable: "否。后台只读；列表页「来源页面」筛选项从已加载数据动态生成。",
                    change: "无法修改。分析转化时应结合来源模块、触发按钮一起看，单看路径可定位到具体落地页。",
                    impact: "用于评估各官网页面的咨询转化效果；修改不影响官网或其它后台模块，仅影响运营分析维度。"
                  },
                  {
                    name: "来源模块",
                    what: "页面内触发咨询的具体入口标识，用于判断用户点击了哪个表单/CTA 区域——例如 home-cta（首页底部）、site-header-cta（顶栏「获取方案」）、contact-page-form（联系我们页内嵌表单）、case-detail-cta（案例详情页 CTA）等。",
                    source: "留言表 · source_module 字段；官网 inferSourceModule() 根据 pathname 与各 CTA 组件传入的 sourceModule 推断",
                    logic: "弹窗表单：优先取 OpenContactModalLink 传入的 sourceModule，否则按 pathname 查 PAGE_SOURCE_MODULE_MAP，案例/资讯详情页分别固定为 case-detail-cta / news-detail-cta，兜底 generic-cta。联系我们页内嵌表单固定 contact-page-form。",
                    auto: "是。提交时由官网前端自动写入，用户无感知。",
                    editable: "否。后台只读，详情抽屉「来源信息」区展示。",
                    change: "无法修改。运营可据此判断是页内 CTA、顶栏按钮还是独立联系页带来的线索。",
                    impact: "用于优化官网各 CTA 位转化；与来源页面组合可精确定位高价值入口，不影响其它模块数据。"
                  },
                  {
                    name: "触发按钮",
                    what: "用户点击打开表单或提交时关联的按钮文案，例如「获取方案」「提交咨询」「免费咨询」等，对应详情中的 source_button_text。",
                    source: "留言表 · source_button_text 字段；官网 OpenContactModalLink 从按钮 children 提取文案，或 ContactInquiryForm 默认值",
                    logic: "弹窗入口：extractButtonLabel 读取 CTA 按钮文字；联系我们页内嵌表单固定「提交咨询」。",
                    auto: "是。提交时自动采集，用户不直接填写此字段。",
                    editable: "否。后台只读，仅在详情抽屉「来源信息」中展示。",
                    change: "无法修改。官网改版按钮文案后，新留言会反映新文案，历史记录保留当时文案。",
                    impact: "帮助区分同一页面多个 CTA 的点击效果；不影响其它模块。"
                  },
                  {
                    name: "留言内容",
                    what: "用户自由填写的需求描述，可包含网站地址、现状问题、期望目标等。选填，最长 2000 字符；未填时显示「—」。",
                    source: "留言表 · message 字段；由官网表单 message 文本域提交",
                    logic: "用户选填；后端 sanitizeText 截断至 2000 字符。",
                    auto: "否。用户手动输入。",
                    editable: "否。后台只读，详情中以 pre-wrap 保留换行。",
                    change: "无法在本页修改。跟进摘要应写入「备注」字段，不要覆盖用户原始留言。",
                    impact: "参与关键词搜索；是销售了解诉求的一手材料，不影响 GEO 或官网内容。"
                  },
                  {
                    name: "状态",
                    what: "线索在后台的处理阶段，四档枚举：NEW（新留言）、FOLLOWING（跟进中）、DONE（已处理）、INVALID（无效）。新建留言默认 NEW。",
                    source: "留言表 · status 字段；新建时默认 NEW，仅后台 PATCH 接口可更新",
                    logic: "NEW：刚入库、尚未跟进，列表行高亮蓝底。FOLLOWING：已联系、方案沟通中，计入「待跟进」。DONE：已成交或已闭环，列表半透明，计入「已处理」。INVALID：骚扰/测试/重复/无法联系，列表半透明，不计入有效待办。",
                    auto: "部分。新建时自动设为 NEW；之后仅运营手动变更。",
                    editable: "是。详情抽屉「当前状态」下拉可改；也可点「标记无效」一键设为 INVALID。",
                    change: "打开详情 → 选择状态下拉 → 点「保存」；或列表外「标记无效」快捷操作。",
                    impact: "直接影响顶部「待跟进」「已处理」统计、列表筛选结果与行样式；不影响官网、GEO 评分或用户侧任何展示。"
                  },
                  {
                    name: "备注",
                    what: "后台运营专用的跟进记录区，用于记录通话摘要、下次跟进计划、客户反馈、无效原因等。用户不可见，初始为空。",
                    source: "留言表 · note 字段；仅后台 PATCH 接口写入",
                    logic: "运营自由文本，最长 2000 字符；保存后随 updated_at 一起更新。",
                    auto: "否。不会自动生成，需运营手动填写。",
                    editable: "是。详情抽屉「后台备注」文本域可编辑。",
                    change: "打开详情 → 在备注框记录跟进过程 → 点「保存」。建议每次联系后追加日期与要点。",
                    impact: "仅影响本条留言的内部协作信息；不参与列表搜索；不影响统计卡片数字（统计看 status 而非 note）。"
                  },
                  {
                    name: "提交时间",
                    what: "用户成功提交表单的服务器入库时间，列表第一列展示，格式为本地日期时间（年/月/日 时:分）。",
                    source: "留言表 · created_at 字段；数据库 @default(now()) 在 insert 时写入",
                    logic: "以服务端时钟为准，按 created_at 降序排列；筛选「开始日期 / 结束日期」也是过滤此字段。",
                    auto: "是。公开接口 create 成功时自动写入，不可人为指定。",
                    editable: "否。后台只读；详情「来源信息」区与列表一致展示。",
                    change: "无法修改。updated_at 会在保存状态/备注时自动刷新，但提交时间永远不变。",
                    impact: "决定列表排序与日期筛选；「今日新增」统计以 created_at ≥ 今日 0 点为准；不影响其它模块。"
                  }
                ]}
              />
            )
          },
          {
            title: "4 自动更新逻辑",
            children: (
              <BulletList
                items={[
                  "打开官网留言页时自动请求列表接口，筛选条件（搜索、状态、需求类型、来源页面、日期）变化后自动重新请求",
                  "官网用户提交表单成功后，新留言立即写入留言表，但本页不会轮询或推送，需手动点「刷新」才出现在列表",
                  "顶部统计卡片（今日新增 / 待跟进 / 已处理 / 总留言数）随每次列表请求一并返回，与当前筛选条件无关（stats 始终全表统计）",
                  "新建留言 status 自动为 NEW，note 自动为空；Referrer、User Agent、IP 在公开接口层自动采集",
                  "保存状态或备注后，本条 updated_at 自动更新，提交时间 created_at 不变",
                  "DONE 与 INVALID 状态的行自动降低透明度；NEW 状态行自动蓝底高亮"
                ]}
              />
            )
          },
          {
            title: "5 手动操作说明",
            children: (
              <>
                <p>
                  标准跟进流程：
                  <strong className="font-medium text-foreground">筛选新留言 → 查看详情 → 联系客户 → 改状态为 FOLLOWING → 备注记录 → 闭环后改 DONE</strong>
                  。
                </p>
                <BulletList
                  items={[
                    "「刷新」：重新拉取列表与统计，建议在得知有新咨询或完成筛选操作后使用",
                    "搜索框：模糊匹配姓名、公司名称、联系方式、留言内容",
                    "状态 / 需求类型 / 来源页面 / 日期：组合筛选后自动 reload",
                    "「查看」：打开详情抽屉，只读浏览用户信息与来源追踪字段",
                    "「保存」：提交当前状态与备注的修改（唯一可写字段）",
                    "「标记无效」：快捷将状态设为 INVALID，适用于测试单、骚扰、重复提交",
                    "本页不提供新增留言、删除留言、编辑用户原始字段、导出功能"
                  ]}
                />
              </>
            )
          },
          {
            title: "6 修改影响范围",
            children: (
              <BulletList
                items={[
                  "修改 status → 影响本条留言的列表展示样式、「待跟进 / 已处理」统计数字、按状态筛选结果",
                  "修改 note → 仅影响本条留言的后台备注内容，不影响统计与其它模块",
                  "用户原始字段（姓名、联系方式、来源等）→ 本页不可改，对官网、GEO、Dashboard 均无反向影响",
                  "标记 INVALID → 从有效待办池移除，但记录仍保留在总留言数中",
                  "标记 DONE → 计入「已处理」，不再计入「待跟进」，列表行变淡提醒已闭环",
                  "本模块与 GEO 评分、内容管理、llms/sitemap 生成无数据联动"
                ]}
              />
            )
          },
          {
            title: "7 常见问题",
            children: (
              <dl className="grid gap-3">
                <div>
                  <dt className="font-medium text-foreground">用户刚提交但列表里没有？</dt>
                  <dd>本页不会自动轮询。点右上角「刷新」重新加载；若仍无，确认官网表单是否提交成功（公开接口是否返回成功提示）。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">来源页面和来源模块有什么区别？</dt>
                  <dd>来源页面是 URL 路径，回答「用户在哪个页面」；来源模块是 CTA 入口 ID，回答「用户点了页面里哪个按钮/表单区域」。同一页面可有多个来源模块（如顶栏 site-header-cta 与页底 home-cta）。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">NEW 和 FOLLOWING 都计入「待跟进」吗？</dt>
                  <dd>是。统计卡片的「待跟进」= status 为 NEW 或 FOLLOWING 的总数。NEW 表示尚未联系，FOLLOWING 表示已在沟通中。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">什么时候用 INVALID，什么时候用 DONE？</dt>
                  <dd>DONE 用于正常跟进结束（已成交、已报价闭环、用户明确不需要但属有效咨询）。INVALID 用于无效线索（测试、骚扰、空号、重复提交、明显误触）。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">备注和留言内容能互相替代吗？</dt>
                  <dd>不能。留言内容是用户原始诉求，只读保留；备注是运营内部跟进日志，应记录每次联系的时间、渠道、结论与下一步计划。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">能否在后台帮用户改联系方式？</dt>
                  <dd>不能。后台仅可改 status 与 note。若用户留错信息，请在备注中记录正确联系方式，或引导用户重新提交。</dd>
                </div>
              </dl>
            )
          }
        ]}
      />
    )
  },
  "/admin/audit/issues": {
    title: "问题诊断使用说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "页面介绍",
            children: (
              <>
                <p>问题诊断用于查看系统自动发现的 GEO 问题和优化建议。</p>
                <p className="mt-2">
                  系统会根据页面评分结果自动识别可能影响 AI 可读性、AI 引用能力和 GEO 表现的问题，并提供对应的修复建议。
                </p>
                <p className="mt-2">运营人员可通过本页面快速定位问题，并进入对应模块进行处理。</p>
              </>
            )
          },
          {
            title: "功能说明",
            children: (
              <>
                <p className="mb-2">本页面主要用于：</p>
                <BulletList
                  items={[
                    "查看当前网站存在的问题",
                    "查看问题等级和优先级",
                    "查看系统生成的修复建议",
                    "按对象、等级、状态筛选问题",
                    "跟踪问题处理进度",
                    "验证优化效果"
                  ]}
                />
              </>
            )
          },
          {
            title: "字段说明",
            children: (
              <div className="grid gap-4">
                <FieldList
                  fields={[
                    {
                      name: "对象",
                      desc: "表示产生问题的页面或内容对象，例如首页、服务页面、FAQ、案例、资讯。"
                    },
                    {
                      name: "问题类型",
                      desc: "表示系统识别的问题类别，例如缺少 AI Summary、缺少 FAQ、Schema 配置异常、未纳入 AI Sitemap、未纳入 llms.txt。"
                    }
                  ]}
                />
                <div>
                  <p className="font-medium text-foreground">问题等级</p>
                  <p className="mt-1">表示问题严重程度。</p>
                  <dl className="mt-2 grid gap-2">
                    <div>
                      <dt className="font-medium text-foreground">高</dt>
                      <dd>建议优先处理。</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">中</dt>
                      <dd>建议近期优化。</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">低</dt>
                      <dd>可作为后续优化项。</dd>
                    </div>
                  </dl>
                </div>
                <FieldList
                  fields={[
                    {
                      name: "修复建议",
                      desc: "系统自动生成的优化建议，用于帮助运营人员快速定位处理方向。"
                    },
                    {
                      name: "状态",
                      desc: "用于记录当前问题处理进度：未处理、处理中、已处理。"
                    },
                    {
                      name: "更新时间",
                      desc: "表示问题最近一次生成或更新的时间。"
                    }
                  ]}
                />
              </div>
            )
          },
          {
            title: "操作流程",
            children: (
              <FlowSteps
                steps={[
                  "查看问题",
                  "阅读问题说明",
                  "查看修复建议",
                  "进入对应模块修改内容",
                  "重新评分",
                  "确认问题消失",
                  "标记已处理"
                ]}
              />
            )
          },
          {
            title: "注意事项",
            children: (
              <BulletList
                items={[
                  "标记已处理不会自动提升评分",
                  "修改内容后建议重新评分",
                  "优先处理高优先级问题",
                  "问题列表会随着评分结果自动更新",
                  "问题数量变化属于正常现象",
                  "新增内容后可能产生新的问题项"
                ]}
              />
            )
          }
        ]}
      />
    )
  },
  "/admin/audit/pages": {
    title: "GEO评分 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "页面介绍",
            children: "查看页面 AI 友好度评分。"
          },
          {
            title: "评分维度",
            children: (
              <BulletList
                items={["AI可读性", "FAQ完整度", "Schema完整度", "AI Summary", "Sitemap", "llms"]}
              />
            )
          },
          {
            title: "分数参考",
            children: (
              <dl className="grid gap-2">
                <div>
                  <dt className="font-medium text-foreground">90+</dt>
                  <dd>优秀</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">80-89</dt>
                  <dd>良好</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">70-79</dt>
                  <dd>合格</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">70以下</dt>
                  <dd>需优化</dd>
                </div>
              </dl>
            )
          }
        ]}
      />
    )
  },
  "/admin/crawl/sitemap": {
    title: "AI Sitemap 管理 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "1 页面定位",
            children: (
              <>
                <p>
                  AI Sitemap 管理是 GEO 管理后台的<strong className="font-medium text-foreground">AI 抓取 Sitemap 生成与发布页</strong>
                  ，不是 XML 编辑器。它根据 staticPageRegistry、各对象 GEO 配置中的 sitemap 收录开关与优先级，以及内容发布状态，自动渲染
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">ai-sitemap.xml</code>
                  ，通过
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">GET /api/v1/sitemap</code>
                  、
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">POST /api/v1/sitemap/generate</code>
                  完成预览与发布。
                </p>
                <p className="mt-2">
                  适合用于：核对哪些 URL 会进入 AI Sitemap、在本页用滑块微调单条 Priority、预览 XML、发布到官网
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">/ai-sitemap.xml</code>
                  。<strong className="font-medium text-foreground">不建议手工编辑 XML</strong>；改收录请到「静态页面 GEO 配置」或各内容模块，改 priority 或收录后需重新生成，对外更新需一键发布。
                </p>
              </>
            )
          },
          {
            title: "2 数据来源",
            children: (
              <BulletList
                items={[
                  "收录对象：GEO配置表 中 sitemap_enabled = true 的记录，关联静态资源 / 案例 / FAQ / 资讯",
                  "静态页面：staticPageRegistry 预置 key + static_resources.status = ACTIVE + registry.includeInAiSitemap = true",
                  "案例 / FAQ / 资讯：对应内容表 status = PUBLISHED，且 geo_configs.sitemap_enabled = true",
                  "Priority：geo_configs.sitemap_priority；静态页默认来自 registry.priority，动态内容有各自 defaultPriority",
                  "Change Frequency：静态页取 registry.changeFrequency（monthly）；案例/FAQ/资讯固定 weekly",
                  "lastmod：静态资源 / 内容表的 updated_at，写入 XML &lt;lastmod&gt;",
                  "绝对 URL loc：系统设置 site_url + 对象相对路径",
                  "已发布文件：sitemap 存储目录 ai-sitemap.xml + manifest.json（含 generatedAt）"
                ]}
              />
            )
          },
          {
            title: "3 字段说明",
            children: (
              <HelpMetricList
                metrics={[
                  {
                    name: "URL总数",
                    what: "当前纳入 AI Sitemap 的 URL 条数，对应顶部「收录URL数量」卡片（页面无按类型拆分的统计卡），等于 Sitemap 内容列表条目数。",
                    source: "collectItems() 过滤后 items.length；generate 快照 totalCount",
                    logic: "每条收录对象对应 XML 一个 &lt;url&gt; 节点；仅 sitemap_enabled = true 且满足发布/启用条件的对象计入。",
                    auto: "是。打开页面时若已有发布版，列表与总数仍从数据库实时 collect；手动生成/发布时重算。",
                    editable: "否。不能直接改总数；增减 URL 请改各模块 sitemap 开关或发布状态。",
                    change: "开启/关闭「进入 AI Sitemap」或发布/下架内容 → 手动生成查看新总数 → 一键发布生效于对外 XML。",
                    impact: "影响 XML url 节点数量、Dashboard AI Sitemap 收录统计；对外文件仅发布后更新。"
                  },
                  {
                    name: "静态页面",
                    what: "staticPageRegistry 中 8 个预置静态页对应的 Sitemap URL，列表 Badge 为「静态资源」。",
                    source: "static_resources + geo_configs；targetType = STATIC_RESOURCE",
                    logic: "resource_key 须在 PRESET_STATIC_RESOURCE_KEYS；status = ACTIVE；registry.includeInAiSitemap = true；changefreq = monthly。",
                    auto: "是。随 collectItems 自动纳入或排除。",
                    editable: "间接。收录开关在「静态页面 GEO 配置」；priority 可在本页滑块或静态页 GEO 配置修改。",
                    change: "静态页 GEO 配置 · 进入 AI Sitemap / Sitemap 优先级 → 保存 → 手动生成 → 发布。",
                    impact: "影响 XML 静态 URL、抓取维度分（关闭 sitemap 扣 10 分）。"
                  },
                  {
                    name: "案例",
                    what: "已发布案例详情页 /cases/{slug}，列表 Badge「案例」。",
                    source: "案例表 + geo_configs；targetType = CASE",
                    logic: "status = PUBLISHED 且 sitemap_enabled = true；defaultPriority = 0.8，changefreq = weekly。",
                    auto: "是。",
                    editable: "间接。收录在内容 GEO 配置；priority 可本页滑块调整。",
                    change: "案例发布/下架或改 sitemap 开关 → 重新生成并发布。",
                    impact: "影响 XML 案例 URL 及 priority/lastmod。"
                  },
                  {
                    name: "FAQ",
                    what: "已发布 FAQ 锚点 /faq#{id}，列表 Badge「FAQ」。",
                    source: "FAQ表 + geo_configs；targetType = FAQ",
                    logic: "status = PUBLISHED 且 sitemap_enabled = true；defaultPriority = 0.9，changefreq = weekly。",
                    auto: "是。",
                    editable: "间接。同案例。",
                    change: "FAQ 发布/下架或改 sitemap 开关 → 重新生成并发布。",
                    impact: "影响 XML FAQ 锚点 URL。"
                  },
                  {
                    name: "资讯",
                    what: "已发布资讯详情页 /news/{slug}，列表 Badge「资讯」。",
                    source: "资讯表 + geo_configs；targetType = NEWS",
                    logic: "status = PUBLISHED 且 sitemap_enabled = true；defaultPriority = 0.7，changefreq = weekly。",
                    auto: "是。",
                    editable: "间接。同案例。",
                    change: "资讯发布/下架或改 sitemap 开关 → 重新生成并发布。",
                    impact: "影响 XML 资讯 URL。"
                  },
                  {
                    name: "Priority",
                    what: "单条 URL 在 Sitemap 中的优先级（0–1），写入 XML &lt;priority&gt;。列表展示「当前值 · 默认 X.XX」，可通过 range 滑块微调（步进 0.05）。",
                    source: "GEO配置表 · sitemap_priority；resolvePriority() 合并 registry/类型默认值",
                    logic: "若 sitemap_priority 仍为 0.5 且 defaultPriority ≠ 0.5，生成时用 defaultPriority；否则用已保存值。顶部「最高优先级」卡片取 items 中最大值。",
                    auto: "部分。滑块 PATCH 后自动 execute generate(publish=false) 刷新预览，不发布。",
                    editable: "是。滑块 → PATCH /api/v1/sitemap/configs/:id/priority；亦可改静态页 GEO 配置「Sitemap 优先级」。",
                    change: "拖动滑块即保存；要更新对外 XML 仍需一键发布。",
                    impact: "影响 XML priority、抓取维度加分（0.1–1.0）、AI 发现顺序。"
                  },
                  {
                    name: "Change Frequency",
                    what: "XML &lt;changefreq&gt;，提示建议 revisit 频率。本页列表 UI 不展示，仅在 XML 预览中可见。",
                    source: "静态页 registry.changeFrequency（monthly）；案例/FAQ/资讯 SitemapService 固定 weekly",
                    logic: "生成时写入每条 &lt;url&gt;；本页无编辑控件。",
                    auto: "是。完全由生成逻辑决定。",
                    editable: "否（本页）。",
                    change: "一般无需运营修改。",
                    impact: "仅影响 XML changefreq 标签，不影响收录与否。"
                  },
                  {
                    name: "收录对象列表",
                    what: "页面右侧「Sitemap内容列表」：标题、类型 Badge、相对 url、绝对 loc、priority 滑块；支持搜索。",
                    source: "GET /api/v1/sitemap items[]；已发布时 items 实时 collect，XML 可能仍为磁盘旧版",
                    logic: "搜索匹配 title、url、loc、targetType；顺序：静态页（registry 序）→ 案例 → FAQ → 资讯。",
                    auto: "是。priority 滑块保存后自动刷新 state。",
                    editable: "列表只读（除 priority 滑块）；移除条目需改源模块开关。",
                    change: "改源数据后手动生成；调 priority 后预览更新但需发布才改对外文件。",
                    impact: "核对收录与调优先级的主界面。"
                  },
                  {
                    name: "文件预览",
                    what: "页面左侧「XML预览」只读区，展示完整 ai-sitemap.xml（urlset 含 loc、lastmod、changefreq、priority）。",
                    source: "generate 返回 xmlText；已发布未重新生成时可能仍为磁盘旧 XML",
                    logic: "pre 不可编辑；应与内容列表条目数、priority 交叉核对。",
                    auto: "是。手动生成、发布、改 priority 后刷新。",
                    editable: "否。不是 XML 编辑器。",
                    change: "手动生成或一键发布后更新；已发布状态下打开页可能列表新、XML 旧，需手动生成同步。",
                    impact: "发布前验收；对外 /ai-sitemap.xml 以此为准（发布后）。"
                  },
                  {
                    name: "手动生成",
                    what: "POST /api/v1/sitemap/generate { publish: false }，重新 collect 并渲染 XML 预览，不写存储目录。",
                    source: "SitemapService.generate({ publish: false })",
                    logic: "更新 totalCount、items、xmlText、generatedAt；不更新磁盘 ai-sitemap.xml。",
                    auto: "否。无发布版时打开页面会自动等价预览生成。",
                    editable: "不适用（操作）。",
                    change: "改开关、priority、发布状态后，先手动生成核对再发布。",
                    impact: "仅本页预览；官网 /ai-sitemap.xml 不变。"
                  },
                  {
                    name: "一键发布",
                    what: "POST /api/v1/sitemap/generate { publish: true }，重新 collect 并写入 ai-sitemap.xml、manifest.json。",
                    source: "SitemapService.writePublished()",
                    logic: "与手动生成相同 collect + render，额外持久化；published: true。",
                    auto: "否。",
                    editable: "不适用（操作）。",
                    change: "预览确认后点击；Badge 与顶部卡片变「已发布」。",
                    impact: "官网 /ai-sitemap.xml 立即更新；Dashboard 生成时间更新。"
                  },
                  {
                    name: "最后生成时间",
                    what: "副标题「最近生成时间」，本地格式化显示；表示当前 XML 版本的 generatedAt。",
                    source: "manifest.json generatedAt；每次 generate 写入 ISO 时间戳",
                    logic: "未生成显示「未生成」。列表已实时 collect 时，时间仍可能指向上次发布。",
                    auto: "是。点击生成/发布时刷新。",
                    editable: "否。",
                    change: "手动生成或一键发布后更新。",
                    impact: "Dashboard 读取同一 manifest。"
                  },
                  {
                    name: "发布状态",
                    what: "顶部第三枚卡片、主卡片 Badge「已发布/预览」与 statusText（已读取已发布版本 / 已生成预览，尚未发布 等）。",
                    source: "generate.published；读盘时 published: true",
                    logic: "已发布：公开 API 优先返回磁盘 xmlText。预览：对外可能仍是旧版。",
                    auto: "部分。一键发布后变已发布；仅手动生成或改滑块不更新磁盘。",
                    editable: "否。本页无撤销发布。",
                    change: "一键发布 → 已发布；仅手动生成不改变对外文件。",
                    impact: "决定 AI 爬虫读到的 Sitemap 版本。"
                  }
                ]}
              />
            )
          },
          {
            title: "4 自动更新逻辑",
            children: (
              <BulletList
                items={[
                  "打开页面：若有发布版，manifest 提供 generatedAt/xmlText，但 items 与 URL 总数仍实时 collect；无发布版则自动预览生成",
                  "拖动 priority 滑块：自动 PATCH 并 generate(publish=false)，刷新 XML 预览，不写盘",
                  "改 sitemap 开关或发布/下架后，本页不会自动刷新 XML，需手动生成",
                  "手动生成只更新预览；一键发布才写入存储目录",
                  "公开 GET /ai-sitemap.xml：有发布版读盘，否则返回临时预览",
                  "顶部「最高优先级」随当前 items 中 priority 最大值自动计算（页面实际功能，非按类型分卡）"
                ]}
              />
            )
          },
          {
            title: "5 手动操作说明",
            children: (
              <>
                <p>
                  标准流程：
                  <strong className="font-medium text-foreground">各模块调整 sitemap 收录 → 手动生成核对 →（可选）滑块调 Priority → 一键发布 → 验证 /ai-sitemap.xml</strong>
                  。
                </p>
                <BulletList
                  items={[
                    "「手动生成」：刷新 URL 总数、Sitemap 内容列表、XML 预览",
                    "「一键发布」：持久化并更新对外 /ai-sitemap.xml",
                    "priority 滑块：0–1、步进 0.05，松手即 PATCH 并刷新预览",
                    "列表搜索：标题、相对 URL、绝对 loc、对象类型",
                    "本页不能：手工编辑 XML、单独增删 url 节点、改 changefreq"
                  ]}
                />
              </>
            )
          },
          {
            title: "6 修改影响范围",
            children: (
              <BulletList
                items={[
                  "静态页面 GEO 配置 · 进入 AI Sitemap / 优先级 → 静态 URL",
                  "案例 / FAQ / 资讯 · 发布与 sitemap 开关 → 动态 URL",
                  "本页 priority 滑块 → geo_configs、预览 XML；发布后才改对外文件",
                  "手动生成 → 仅预览；一键发布 → /ai-sitemap.xml、Dashboard 生成时间",
                  "priority 超出 0.1–1.0 → 抓取维度扣分与 audit 问题"
                ]}
              />
            )
          },
          {
            title: "7 常见问题",
            children: (
              <dl className="grid gap-3">
                <div>
                  <dt className="font-medium text-foreground">能直接在 XML 预览里改吗？</dt>
                  <dd>不能。应改 GEO 配置收录、priority 或内容发布状态，再重新生成。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">改了滑块但官网 XML 没变？</dt>
                  <dd>滑块只更新 geo_configs 与预览。必须「一键发布」才更新 /ai-sitemap.xml。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">列表有条目但 XML 更旧？</dt>
                  <dd>已发布状态下列表实时 collect，XML 可能仍是磁盘旧版。点「手动生成」同步预览。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">为什么没有静态/案例/FAQ/资讯分卡统计？</dt>
                  <dd>本页顶部仅 URL 总数、最高优先级、发布状态三卡。按类型请在 Sitemap 内容列表看 Badge 计数。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Change Frequency 在哪改？</dt>
                  <dd>本页无入口。静态页来自 registry（monthly），动态内容为 weekly。</dd>
                </div>
              </dl>
            )
          }
        ]}
      />
    )
  },
  "/admin/crawl/llms": {
    title: "llms.txt 管理 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "1 页面定位",
            children: (
              <>
                <p>
                  llms.txt 管理是 GEO 管理后台的<strong className="font-medium text-foreground">AI 抓取文件生成与发布页</strong>
                  ，不是文本编辑器。它根据各业务对象当前的 GEO 配置与发布状态，自动拼装
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">llms.txt</code>
                  与
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">llms-full.txt</code>
                  ，并通过
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">GET /api/v1/llms</code>
                  、
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">POST /api/v1/llms/generate</code>
                  完成预览与发布。
                </p>
                <p className="mt-2">
                  适合用于：确认哪些对象会被 AI 爬虫索引、预览生成结果、发布到官网对外路径。文件内容由静态页面 GEO 配置、案例、FAQ、资讯的
                  <strong className="font-medium text-foreground"> llms_enabled 开关与发布状态</strong>
                  决定，<strong className="font-medium text-foreground">不建议在本页或存储文件中手动编辑 llms.txt</strong>；改收录范围应回对应 GEO 配置或内容模块，再重新生成并发布。
                </p>
              </>
            )
          },
          {
            title: "2 数据来源",
            children: (
              <BulletList
                items={[
                  "收录对象：GEO配置表 中 llms_enabled = true 的记录，关联静态资源 / 案例 / FAQ / 资讯",
                  "静态页（Site）：static_resources.status = ACTIVE 且 staticPageRegistry.includeInLlms = true",
                  "案例（Cases）：案例表 status = PUBLISHED",
                  "FAQ（FAQs）：FAQ表 status = PUBLISHED",
                  "资讯（News）：资讯表 status = PUBLISHED",
                  "条目摘要与描述：各对象 geo_configs 的 ai_summary、meta_description；案例/FAQ/资讯另拼接正文片段",
                  "对外 URL：系统设置中的 site_url + 对象 url/slug 拼绝对地址",
                  "已发布文件：llms 存储目录下的 llms.txt、llms-full.txt、manifest.json（含 generatedAt 与 items 快照）"
                ]}
              />
            )
          },
          {
            title: "3 字段说明",
            children: (
              <HelpMetricList
                metrics={[
                  {
                    name: "收录总数",
                    what: "当前生成结果中纳入 llms.txt 的对象总数，等于 Site + Cases + FAQs + News 四段之和。顶部第一枚统计卡片展示。",
                    source: "生成快照 totalCount；由 collectItems() 过滤后 items.length 计算",
                    logic: "仅统计 llms_enabled = true 且满足发布/启用条件的对象；静态页还需 registry 允许 includeInLlms。",
                    auto: "是。每次「手动生成」或「一键发布」时按数据库实时重算；打开页面时若已有发布版则读 manifest 快照。",
                    editable: "否。不能直接改数字；增减收录请改各模块 llms 开关或发布状态后重新生成。",
                    change: "在静态页面 GEO 配置 / 内容模块开启或关闭「进入 llms.txt」→ 发布内容 → 回本页「手动生成」查看新总数 →「一键发布」生效。",
                    impact: "影响 Dashboard llms 收录数量（实时统计 geo_configs）与本页预览；对外 /llms.txt 仅发布后更新。"
                  },
                  {
                    name: "Site",
                    what: "静态站点页收录数，对应 llms.txt 中 Site 段下的预置静态页面（首页、服务页、术语表、关于我们等）。",
                    source: "static_resources + geo_configs；section = site",
                    logic: "resource_key 须在 PRESET_STATIC_RESOURCE_KEYS 内，status = ACTIVE，registry.includeInLlms = true，llms_enabled = true。",
                    auto: "是。随生成流程自动统计 counts.site。",
                    editable: "否。",
                    change: "到「静态页面 GEO 配置」切换「进入 llms.txt」→ 保存 → 重新生成并发布。",
                    impact: "影响 llms.txt Site 段条目、抓取维度分（关闭单页 llms 扣 10 分）、Dashboard 收录统计。"
                  },
                  {
                    name: "Cases",
                    what: "已发布案例的收录数，对应 llms.txt 中 Cases 段，每条输出「标题: 绝对 URL」。",
                    source: "案例表 + geo_configs；section = cases",
                    logic: "status = PUBLISHED 且 llms_enabled = true；URL 为 /cases/{slug}。",
                    auto: "是。随生成流程自动统计 counts.cases。",
                    editable: "否。",
                    change: "案例管理发布/下架，或在内容 GEO 配置关闭 llms → 重新生成并发布。",
                    impact: "影响 Cases 段内容与 llms-full.txt 中案例 Detail 字段。"
                  },
                  {
                    name: "FAQs / News",
                    what: "顶部第四枚卡片合并展示 FAQ 与资讯收录数，格式「faqs / news」。FAQ 段只列标题无 URL；News 段列「标题: URL」。",
                    source: "FAQ表、资讯表 + geo_configs；section = faqs / news",
                    logic: "均为 status = PUBLISHED 且 llms_enabled = true；FAQ url 为 null，News url 为 /news/{slug}。",
                    auto: "是。随生成流程写入 counts.faqs、counts.news。",
                    editable: "否。",
                    change: "FAQ/资讯管理发布或调整 llms 开关 → 重新生成并发布。",
                    impact: "影响 FAQs、News 两段及 llms-full.txt 对应 Detail 内容。"
                  },
                  {
                    name: "文件预览",
                    what: "页面左侧只读预览区，展示当前 llms.txt 或 llms-full.txt 的完整文本，便于发布前核对段落与条目。",
                    source: "最近一次 generate 返回的 llmsText / llmsFullText；已发布时来自存储目录文件",
                    logic: "Tab 切换 llms.txt / llms-full.txt；pre 区块展示，不可编辑。",
                    auto: "是。打开页面或点击生成按钮后自动刷新预览文本。",
                    editable: "否。预览区不支持直接改文本；请勿复制后手工改文件。",
                    change: "点「手动生成」刷新预览；切换 Tab 查看简版/详版。",
                    impact: "仅影响运营核对体验；不改变对外文件，除非随后「一键发布」。"
                  },
                  {
                    name: "llms.txt",
                    what: "对外简版 AI 抓取入口文件，Plain Text 格式，按 Site / Cases / FAQs / News 四段列出标题与链接（FAQ 仅标题）。官网路径 /llms.txt。",
                    source: "renderLlmsText() 根据 collectItems 结果渲染；发布时写入存储目录 llms.txt",
                    logic: "首行 YFYK，各段空行分隔；Site/Cases/News 行为「标题: 绝对 URL」，FAQs 仅标题行。",
                    auto: "是。完全由后端模板生成，无手工编辑入口。",
                    editable: "否。不建议手动编辑；内容源自 GEO 配置与发布状态。",
                    change: "调整源数据 →「手动生成」预览 →「一键发布」写入对外文件。",
                    impact: "发布后官网 /llms.txt 与 AI 爬虫可见内容；影响抓取维度分与 Dashboard 生成状态。"
                  },
                  {
                    name: "llms-full.txt",
                    what: "对外详版文件，Markdown 格式，含 Generated 时间戳及每条目的 AI Summary、Description、Detail 摘要。官网路径 /llms-full.txt。",
                    source: "renderLlmsFullText()；发布时写入存储目录 llms-full.txt",
                    logic: "按段输出列表项；summary/description 来自 geo_configs；body 来自案例挑战/方案/结果、FAQ 答案、资讯正文（截断至约 600 字）。",
                    auto: "是。与 llms.txt 同次生成、同次发布。",
                    editable: "否。不建议手动编辑。",
                    change: "补充各对象 AI Summary 或正文 → 重新生成并发布。",
                    impact: "发布后官网 /llms-full.txt 更新；为 AI 提供更丰富上下文，不改变简版结构。"
                  },
                  {
                    name: "收录对象列表",
                    what: "页面右侧列表，展示本次生成快照中的全部收录对象：标题、section 标签（Site/Cases/FAQs/News）、对象类型与 URL。支持搜索过滤。",
                    source: "生成快照 items[]；与 totalCount 同源",
                    logic: "每条含 id、targetType、title、url、section；FAQ 无 url。搜索匹配标题、URL、section、类型。",
                    auto: "是。随 generate 结果更新；打开已发布版本时显示 manifest 中上次发布快照。",
                    editable: "否。列表只读；要从列表移除对象需改源模块 llms 开关或下架内容。",
                    change: "修改源数据后点「手动生成」，列表与预览同步刷新。",
                    impact: "帮助核对收录范围；不影响对外文件直至发布。"
                  },
                  {
                    name: "手动生成",
                    what: "顶部「手动生成」按钮，触发 POST /api/v1/llms/generate { publish: false }，从数据库重新 collect 并渲染预览，但不写入存储目录。",
                    source: "LlmsService.generate({ publish: false })",
                    logic: "实时读取 geo_configs 与各内容表 → 更新预览文本、统计、收录列表、generatedAt；published 仍为 false（若此前未发布）或保持已发布标记但内容为最新预览。",
                    auto: "否。需运营手动点击；打开页面时若无发布版会自动等价于一次预览生成。",
                    editable: "不适用（操作按钮）。",
                    change: "修改 llms 开关或内容后，先点「手动生成」确认预览正确，再决定是否发布。",
                    impact: "仅更新本页预览与内存状态；官网 /llms.txt 不变，Dashboard 生成时间不变。"
                  },
                  {
                    name: "一键发布",
                    what: "顶部「一键发布」按钮，触发 POST /api/v1/llms/generate { publish: true }，重新 collect 并将 llms.txt、llms-full.txt、manifest.json 写入存储目录。",
                    source: "LlmsService.writePublished() → llms 存储目录",
                    logic: "与手动生成相同的数据收集与渲染，额外持久化三份文件；返回 published: true。",
                    auto: "否。必须手动点击；内容变更不会自动发布。",
                    editable: "不适用（操作按钮）。",
                    change: "预览确认无误后点击「一键发布」；状态变为「已发布」，对外链接可访问最新版。",
                    impact: "官网 /llms.txt、/llms-full.txt 立即更新；Dashboard llms 最近生成时间更新；抓取维度分依赖已发布文件。"
                  },
                  {
                    name: "最后生成时间",
                    what: "卡片副标题「最近生成时间」展示的 ISO 时间戳，格式化为本地日期时间。表示当前展示版本（预览或已发布）的生成时刻。",
                    source: "生成快照 generatedAt；已发布版存于 manifest.json",
                    logic: "每次 generate 写入 new Date().toISOString()；未生成时显示「未生成」。",
                    auto: "是。点击生成/发布时自动刷新；不会随内容编辑自动变化。",
                    editable: "否。不能手动改时间，只能重新生成。",
                    change: "点「手动生成」或「一键发布」刷新时间戳。",
                    impact: "Dashboard「llms.txt 最近生成时间」读取同一 manifest；时间过久提示可能未含最新内容。"
                  },
                  {
                    name: "发布状态",
                    what: "Badge 显示「已发布」或「预览」，表示当前对外 /llms.txt 是否已有持久化发布版。副标题 statusText 补充「已读取已发布版本 / 已生成预览，尚未发布 / 已生成并发布」等。",
                    source: "generate 返回 published 字段；有 manifest 时 getAdminState 读盘 published: true",
                    logic: "published = true：存储目录三文件存在，公开 API 优先读盘。published = false：仅内存预览，对外可能仍返回旧发布版或临时预览。",
                    auto: "部分。首次发布前为预览；一键发布后变为已发布；仅手动生成不改变已发布文件。",
                    editable: "否。通过「一键发布」设为已发布，无法在本页「撤销发布」。",
                    change: "预览阶段 Badge 为「预览」；一键发布后变「已发布」绿色 Badge。",
                    impact: "决定 AI 爬虫与官网访问者读到的是旧发布版还是新预览；Dashboard 生成状态与此联动。"
                  }
                ]}
              />
            )
          },
          {
            title: "4 自动更新逻辑",
            children: (
              <BulletList
                items={[
                  "打开页面：若存储目录已有发布版，读取 manifest + 文件（显示上次发布快照）；否则自动执行一次 publish=false 的预览生成",
                  "各内容模块保存 GEO 配置或发布/下架内容后，本页不会自动刷新，预览与对外文件均不变",
                  "「手动生成」仅更新本页预览，不写盘；「一键发布」才更新存储目录与对外路径",
                  "公开 API GET /llms.txt：有发布版读盘，否则返回临时预览文本",
                  "收录总数在 Dashboard 侧按 geo_configs.llms_enabled 实时统计，与本页 manifest 快照可能短暂不一致，以重新生成为准"
                ]}
              />
            )
          },
          {
            title: "5 手动操作说明",
            children: (
              <>
                <p>
                  标准发布流程：
                  <strong className="font-medium text-foreground">在各模块调整 llms 收录 → 手动生成核对预览与收录列表 → 一键发布 → 访问 /llms.txt 验证</strong>
                  。
                </p>
                <BulletList
                  items={[
                    "「手动生成」：刷新预览、统计、收录列表、生成时间，不更新官网",
                    "「一键发布」：在最新 collect 结果基础上写入存储并标记已发布",
                    "文件预览 Tab：切换 llms.txt（简版链接索引）与 llms-full.txt（详版 Markdown）",
                    "收录对象列表搜索：按标题、URL、section、对象类型过滤",
                    "页内链接 /llms.txt、/llms-full.txt：新窗口打开对外路径做发布后验证",
                    "本页不能：手工编辑文件正文、单独增删某一行、不经过源数据直接改收录"
                  ]}
                />
              </>
            )
          },
          {
            title: "6 修改影响范围",
            children: (
              <BulletList
                items={[
                  "静态页面 GEO 配置 · 进入 llms.txt → 影响 Site 段、收录总数、llms-full 摘要",
                  "案例 / FAQ / 资讯 · 发布状态与 llms 开关 → 影响 Cases / FAQs / News 段",
                  "各对象 AI Summary / 正文 → 影响 llms-full.txt 的 Detail 与 Description，简版 llms.txt 仅标题/URL",
                  "手动生成 → 仅本页预览；一键发布 → 官网 /llms.txt、/llms-full.txt、Dashboard 生成时间与收录展示",
                  "未发布时修改源数据 → Dashboard 收录数可能已变，但对外 llms 文件仍为旧版直至发布"
                ]}
              />
            )
          },
          {
            title: "7 常见问题",
            children: (
              <dl className="grid gap-3">
                <div>
                  <dt className="font-medium text-foreground">能直接在预览框里改 llms.txt 吗？</dt>
                  <dd>不能，也不建议。预览只读，内容完全由程序生成。应回到静态页面 GEO 配置或内容模块改 llms 开关与摘要，再重新生成。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">手动生成后官网为什么没变？</dt>
                  <dd>手动生成只更新预览，不写存储目录。必须点「一键发布」，官网 /llms.txt 才会更新为最新版。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">关了 llms 开关但列表还有该页？</dt>
                  <dd>打开页面可能显示上次发布 manifest。点「手动生成」从数据库重新 collect，列表与预览才会反映最新开关状态。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">llms.txt 和 llms-full.txt 区别？</dt>
                  <dd>llms.txt 是简版纯文本链接索引，供爬虫快速发现 URL；llms-full.txt 是 Markdown 详版，含 AI Summary 与正文摘要，供 AI 深度理解。两者同次发布。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">FAQ 为什么没有 URL？</dt>
                  <dd>生成规则中 FAQ 段仅输出问题标题（锚点页内定位），News 与 Cases 输出完整路径。这是模板设计，非遗漏。</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">发布状态是预览，Dashboard 收录数却很高？</dt>
                  <dd>Dashboard 统计 geo_configs 中 llms_enabled=true 的实时数量；本页预览/发布快照需手动生成才同步。两者都正常，发布前请以本页预览为准。</dd>
                </div>
              </dl>
            )
          }
        ]}
      />
    )
  },
  "/admin/settings": {
    title: "系统设置 - 帮助说明",
    content: (
      <HelpSections
        sections={[
          {
            title: "页面介绍",
            children: "管理系统基础配置。"
          },
          {
            title: "包括",
            children: (
              <BulletList items={["API地址", "域名", "GEO参数", "权重设置"]} />
            )
          }
        ]}
      />
    )
  }
};

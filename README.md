![避韭针 ChiveShield 品牌首图](docs/assets/hero-banner.png)

# 避韭针 ChiveShield

[简体中文](./README.md) | [English](./README.en.md)

**在线 Demo / 官网**：<https://chiveshield-mvp.vercel.app>  
**示例报告 Demo**：[仓库内 HTML](./docs/report-demo.html)（下载后可直接用浏览器打开）  
**可信度标杆 / Awesome List**：[138 条真实 AI 服务采购信息源](./docs/sources.md)，覆盖官方定价/成本基准、开源 AI 项目、采购避坑/议价/治理、行业报告/模型评测。

避韭针（ChiveShield）是一个开源、本地可演示的 AI 服务采购防坑报告生成器。它面向准备采购 AI 客服、RAG 知识库、数据分析助手、Agent 自动化、AI 生成内容等服务的甲方用户：输入一段业务服务需求，系统会生成一份中立的采购决策报告，帮助识别“AI 卖课 / 黑箱包装 / 高价低交付”的风险，同时给出合理的商业价值、报价梯度、验收清单和议价话术。

项目目标不是唱衰 AI 服务行业，而是让甲乙双方更清楚地匹配需求、成本、交付边界和验收标准。

## 第一眼看什么

- **在线体验**：打开 [ChiveShield 在线 Demo / 官网](https://chiveshield-mvp.vercel.app)，体验免费预览、付费解锁入口和本地 demo 报告生成路径。
- **示例报告**：查看 [`docs/report-demo.html`](./docs/report-demo.html)。这是 ChiveShield 生成的可视化采购防坑报告 demo；GitHub 不直接渲染 HTML 页面，建议下载后用浏览器打开。
- **真实来源库**：查看 [`docs/sources.md`](./docs/sources.md)，138 条经过 HTTP 2xx/3xx 检测的采购信息源。
- **模型成本核验表**：下方直接展示 14 个高 star 开源项目，可用来复算 LLM API、token、网关和可观测性成本。

## 当前能力

- 输入通用 AI 服务需求。
- 生成免费预览，再解锁完整报告。
- 本地 demo 生成结构化甲方决策版报告。
- 展示服务类型、置信度、开源项目候选、技术路线、风险点、报价梯度、验收清单和议价话术。
- 复制或下载 Markdown 报告。
- 明确区分 Demo 数据源、mock 支付、真实托管支付和后端确认边界。
- 提供轻量 Node API 骨架：订单创建、payment link 契约、webhook 确认、轮询兜底、报告生成触发。

## 大模型 API 价格清单 / 成本核验开源项目

# LLM API 价格清单 / 成本核验开源项目

这份清单给 ChiveShield README 正文直接展示：重点不是“又一个官方定价链接列表”，而是可自部署、可审计或可复用的 **LLM 价格聚合、token 成本计算、跨厂商比价、用量追踪/计费** 项目。甲方可以用它们拆出真实 API 硬成本，避免把 API 调用、网关转发或简单用量统计包装成高额“自研模型”费用。

| 项目 | URL | 甲方采购价值 |
|---|---|---|
| LiteLLM | https://github.com/BerriAI/litellm | 多模型网关与代理，内置跨厂商模型价格/上下文信息，可核验“统一模型网关”服务里的真实 API 成本与路由价值。 |
| LiteLLM model prices JSON | https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json | 直接维护大量模型的价格与上下文窗口数据，适合作为 ChiveShield 价格核验和成本估算的机器可读基准。 |
| Helicone | https://github.com/Helicone/helicone | 开源 LLM observability 平台，可追踪请求、token、延迟和成本，适合要求供应商证明实际调用量。 |
| Langfuse | https://github.com/langfuse/langfuse | 开源 LLM 可观测性/评测平台，能把 trace、token 和成本透明化，避免“黑盒报告生成”按拍脑袋收费。 |
| Portkey AI Gateway | https://github.com/Portkey-AI/gateway | 开源 AI gateway，支持多模型路由、监控和治理，可评估“模型中台/API 网关”报价是否有真实工程量。 |
| OpenLIT | https://github.com/openlit/openlit | OpenTelemetry 原生 LLM 可观测性项目，可追踪模型调用与成本，适合生产级 AI 应用验收。 |
| OpenLLMetry | https://github.com/traceloop/openllmetry | LLM 应用 OpenTelemetry instrumentation，可让甲方要求供应商交付可审计的调用链和成本数据。 |
| tokencost | https://github.com/AgentOps-AI/tokencost | 专门用于计算 OpenAI/Anthropic 等模型 token 成本的库，适合快速核算单次报告或客服会话成本。 |
| Lago | https://github.com/getlago/lago | 开源用量计费与订阅计费系统（约 9,940 stars），适合把 AI 报告/API 调用按用量透明计费，避免“套餐黑箱”。 |
| Infracost | https://github.com/infracost/infracost | 开源云成本估算工具（约 12,370 stars），可核验 AI 服务部署里的服务器、GPU、数据库等基础设施成本。 |
| CloudQuery | https://github.com/cloudquery/cloudquery | 开源云资产/FinOps 数据管道（约 6,438 stars），适合把云资源清单和成本治理数据拉出来审计。 |
| promptfoo | https://github.com/promptfoo/promptfoo | 开源 LLM/Agent/RAG 测试与评测工具（约 22,292 stars），可把供应商“效果好”变成可复现测试和成本/质量对比。 |
| Phoenix | https://github.com/Arize-ai/phoenix | 开源 AI observability/evaluation 平台（约 10,168 stars），适合跟踪 RAG/LLM 应用质量、trace 与成本相关诊断。 |
| OpenMeter | https://github.com/openmeterio/openmeter | 开源 usage metering / billing 基础设施，可用于把 AI 服务按调用量、token 或报告次数做透明计费。 |

> 使用建议：采购 AI 服务时，不要只问“系统多少钱”，而要要求供应商把 **模型/API 调用、网关/观测、业务集成、部署运维、人工服务** 分开报价。上面的项目可用于独立复算 token/API 硬成本，剩下的才是乙方真实服务价值和风险责任。

完整文件同步保留在 [`docs/llm-price-projects.md`](./docs/llm-price-projects.md)。

## 本地快速运行

```bash
git clone https://github.com/1229119561Weike/chiveshield.git
cd chiveshield
npm run build
npm start
```

打开：<http://localhost:5173>

本地 API 骨架：

```bash
npm run api
```

默认监听：<http://localhost:8787>。

## 验证命令

```bash
npm run build
npm run test:smoke
npm run test:api
npm run test:serverless-store
```

说明：项目当前零运行时依赖，`npm run build` 只是把 `src/` 静态文件复制到 `dist/`。

## 两种使用路径

### 1. 开源自部署：用户自配主流 AI 模型 API Key

开源版默认使用 `DemoProvider`，不携带任何模型密钥，也不会伪装成真实联网调研。你可以在自己的部署中接入主流模型和搜索服务，例如：

- OpenAI / Anthropic / Gemini / DeepSeek / Qwen 等模型 API。
- GitHub API：查询开源项目元数据、stars、license、更新时间。
- Brave Search / Tavily / SerpAPI / 自建搜索：补充网页资料和价格信息。

建议接入方式：

1. 保留当前前端报告结构和 provider 边界。
2. 新增自己的 `SearchProvider`，实现公开资料检索。
3. 新增自己的 `ReportGenerationProvider`，在订单确认后调用模型生成报告。
4. 使用环境变量保存 API Key，例如 `.env` 或部署平台 secrets；不要提交到 Git。
5. UI 和 Markdown 必须标注数据来源：`demo`、`live search`、`manual review` 等。

### 2. Matrix 部门 skill 包：作为可安装工作流使用

如果你使用 Matrix / Neo Agent Company，可以把避韭针拆成部门 skill 包安装到工作区：

- 产品体验 skill：定义输入表单、报告结构、用户路径。
- 调研与定价 skill：维护 AI 服务分类、开源项目搜索策略、报价梯度、风险库、验收清单和议价话术。
- 工程实现 skill：运行本地 Web UI、API、导出和验证流程。
- 商业运营 skill：维护价格、收款、付费报告确认和单位经济指标。

推荐安装方式：把相关 skill 放入工作区 `skills/` 或部门 `departments/<id>/skills/`，并在自己的 Agent 工作流中按“用户输入需求 → 调研 → 报告生成 → 导出/交付”的顺序调用。

## Demo 模式与付费模式

### Demo / 本地模式

- 前端默认使用内置规则和示例开源项目候选。
- 本地按钮“模拟支付成功”只改变本地状态，用于演示报告生成。
- Demo 数据不代表真实联网结果，报告中也会明确标注。

### 托管付费模式

当前代码包含一个最小后端接口骨架，用于演示完整商业闭环：

- `POST /api/report-orders`：创建 `ReportOrder`。
- `POST /api/report-orders/:id/payment-link`：按 payment link 参数契约创建或准备支付链接；默认 dry-run，不创建真实收费链接。
- `GET /api/report-orders/:id/status`：查询订单状态、支付链接、报告结果和状态历史。
- `POST /api/matrix-payment-webhook`：接收 `payment.succeeded`，按 `metadata.order_id` 幂等更新订单并触发报告生成。
- `POST /api/report-orders/:id/poll-payment`：本地 dry-run 轮询兜底。
- `POST /api/report-orders/:id/confirm-agent-revenue-payment`：后台测试确认入口，用已验证的付款 proof 绑定指定订单；不要暴露为前端“我已付款”按钮。

生产正路：按订单动态创建 payment link，并写入 `metadata.order_id`、`webhook_url`、`continue_url` 和幂等键 `chiveshield-report-${order.id}`。前端不能自行判断“支付成功”，付款完成必须由 webhook 或后端轮询确认。

## Vercel / Serverless 存储说明

本地默认订单文件：`data/report-orders.json`。

Vercel Serverless 默认写入：`/tmp/chiveshield-report-orders.json`，这是为了 smoke 测试和临时确认桥可用。`/tmp` 不是生产级持久化：Serverless 实例会冷启动、并发和回收，文件不可靠。

生产订单、支付幂等索引和报告结果应迁移到托管 DB/KV，例如 Postgres、Redis/KV、对象存储 + DB 索引。

## 支付与安全边界

- 仓库不包含 Stripe、Matrix、模型 API 或 GitHub secret。
- `.env*`、`.vercel/`、`tmp/`、`dist/`、`node_modules/` 均应被 Git 忽略。
- 页面里的 Stripe buy link 是公开 checkout URL；可用于演示入口，但真实生产应改为后端按订单动态生成 payment link。
- `MATRIX_WEBHOOK_SECRET`、`MATRIX_RECEIVABLE_API_TOKEN` 等只应存在于部署平台 secrets。

## 项目结构

```text
api/        Vercel Serverless 入口
server/     Node API、订单状态机、支付确认、报告生成 provider
src/        静态 Web UI
docs/       sources、示例报告、README 图片素材
dist/       构建产物（不提交）
scripts/    构建与 smoke 测试脚本
```

## 联系 / 交流

- 在线 Demo / 官网：<https://chiveshield-mvp.vercel.app>
- GitHub 仓库：<https://github.com/1229119561Weike/chiveshield>

![微信二维码](docs/assets/wechat-qr.jpg)

## 开源协议

MIT License。见 [LICENSE](./LICENSE)。

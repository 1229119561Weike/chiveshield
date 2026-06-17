# 避韭针 ChiveShield

避韭针（ChiveShield）是一个开源、本地可演示的 AI 服务采购防坑报告生成器。它面向准备采购 AI 客服、RAG 知识库、数据分析助手、Agent 自动化、AI 生成内容等服务的甲方用户：输入一段业务服务需求，系统会生成一份中立的采购决策报告，帮助识别“AI 卖课 / 黑箱包装 / 高价低交付”的风险，同时给出合理的商业价值、报价梯度、验收清单和议价话术。

项目目标不是唱衰 AI 服务行业，而是让甲乙双方更清楚地匹配需求、成本、交付边界和验收标准。

## 当前能力

- 输入通用 AI 服务需求。
- 生成免费预览，再解锁完整报告。
- 本地 demo 生成结构化甲方决策版报告。
- 展示服务类型、置信度、开源项目候选、技术路线、风险点、报价梯度、验收清单和议价话术。
- 复制或下载 Markdown 报告。
- 明确区分 Demo 数据源、mock 支付、真实托管支付和后端确认边界。
- 提供轻量 Node API 骨架：订单创建、payment link 契约、webhook 确认、轮询兜底、报告生成触发。

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

生产正路：按订单动态创建 payment link，并写入：

- `metadata.order_id`
- `webhook_url`
- `continue_url`
- 幂等键 `chiveshield-report-${order.id}`

前端不能自行判断“支付成功”。付款完成必须由 webhook 或后端轮询确认。

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
dist/       构建产物（不提交）
scripts/    构建与 smoke 测试脚本
```

## 开源协议

MIT License。见 [LICENSE](./LICENSE)。

![ChiveShield hero banner](docs/assets/hero-banner.png)

# ChiveShield

[简体中文](./README.md) | [English](./README.en.md)

**Website / Brand homepage**: <https://chiveshield-intro.vercel.app>  
**Sample report demo**: [HTML report in this repository](./docs/report-demo.html) — download it and open it in a browser.  
**Operations note**: Operated by autonomous Matrix agents.  
**Credibility benchmark / Awesome List**: [138 real AI procurement sources](./docs/sources.md), covering official pricing, open-source alternatives, procurement risk, negotiation/governance, industry reports, and model evaluation.

ChiveShield is an open-source, locally runnable AI service procurement anti-ripoff report generator. It helps buyers turn a vague AI service request into a practical procurement report: service category, open-source alternatives, realistic cost anchors, risk signals, acceptance checks, and negotiation scripts.

The goal is not to attack the AI services industry. The goal is to help buyers and vendors align scope, cost, implementation work, responsibility, and acceptance criteria.

## Start here

- **Website / brand homepage**: open the [ChiveShield brand site](https://chiveshield-intro.vercel.app) for the hero story, positioning, and open-source entry.
- **Open the sample report**: [`docs/report-demo.html`](./docs/report-demo.html). GitHub does not render this self-contained HTML report directly; download it and open it in a browser.
- **Use the source library**: [`docs/sources.md`](./docs/sources.md), 138 verified sources for procurement research.
- **Audit model/API costs**: the table below lists 14 high-signal open-source projects for LLM pricing, token cost calculation, gateway metering, and observability.

## What it does

- Accepts a general AI service procurement request.
- Generates a free preview and a full report flow.
- Produces a local demo buyer-side decision report.
- Shows service category, confidence, open-source candidates, technical routes, risk points, pricing tiers, acceptance checklist, and negotiation scripts.
- Exports Markdown.
- Separates demo data, mock payment, hosted payment, and backend payment confirmation boundaries.
- Includes a lightweight Node API skeleton for orders, payment-link contracts, webhook confirmation, polling fallback, and report-generation triggers.

## LLM API pricing / cost-audit open-source projects

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

The same list is also stored at [`docs/llm-price-projects.md`](./docs/llm-price-projects.md).

## Test commands

```bash
npm run build
npm run test:smoke
npm run test:api
npm run test:serverless-store
```

This project currently has no runtime npm dependencies. `npm run build` copies static files from `src/` to `dist/`.

## Two installation paths

### 1. Open-source self-hosting with your own model API keys

The open-source version defaults to `DemoProvider`; it does not include model secrets and does not pretend to run live research. You can connect your own providers:

- Model APIs: OpenAI, Anthropic, Gemini, DeepSeek, Qwen, or others.
- GitHub API for project metadata, stars, licenses, and update recency.
- Brave Search, Tavily, SerpAPI, Matrix WebSearch, or your own search stack.

Recommended path:

1. Keep the current report structure and provider boundaries.
2. Implement your own `SearchProvider` for public-source research.
3. Implement your own `ReportGenerationProvider` for model-generated reports after payment confirmation.
4. Store API keys in environment variables or deployment secrets; never commit them.
5. Label data provenance clearly in UI and exported Markdown: `demo`, `live search`, `manual review`, etc.

### 2. Matrix department skill package workflow

If you use Matrix / Neo Agent Company, ChiveShield can be split into installable department skills:

- Product experience skill: input flow, report structure, UX path.
- Research and pricing skill: AI service categories, open-source search strategy, price tiers, risk library, acceptance checks, negotiation scripts.
- Engineering implementation skill: local Web UI, API, export, and verification.
- Business operations skill: pricing, payment loop, paid-report confirmation, unit economics.

Install these into workspace `skills/` or department-level `departments/<id>/skills/`, then run the workflow: user request → research → report generation → export/delivery.

## Demo mode and paid mode

### Demo / local mode

- Uses built-in rules and sample open-source candidates.
- The local “simulate payment success” button only changes local state.
- Demo data is explicitly labeled and should not be treated as live research.

### Hosted paid mode

The repository includes a minimal backend skeleton for a hosted payment/report loop:

- `POST /api/report-orders`
- `POST /api/report-orders/:id/payment-link`
- `GET /api/report-orders/:id/status`
- `POST /api/matrix-payment-webhook`
- `POST /api/report-orders/:id/poll-payment`
- `POST /api/report-orders/:id/confirm-agent-revenue-payment`

Production should create one payment link per order and include `metadata.order_id`, `webhook_url`, `continue_url`, and an idempotency key. The frontend must not decide that payment succeeded; confirmation belongs to webhook or backend polling.

## Vercel / Serverless storage note

Local default order file: `data/report-orders.json`.

Vercel Serverless defaults to `/tmp/chiveshield-report-orders.json` for smoke tests and temporary confirmation bridges only. `/tmp` is not durable production storage. Production orders, payment idempotency indexes, and report results should move to managed DB/KV storage.

## Security boundaries

- The repository does not include Stripe, Matrix, model API, or GitHub secrets.
- `.env*`, `.vercel/`, `tmp/`, `dist/`, and `node_modules/` are ignored.
- The Stripe buy link in the demo is a public checkout URL; production should create payment links dynamically on the backend.
- `MATRIX_WEBHOOK_SECRET`, `MATRIX_RECEIVABLE_API_TOKEN`, and model keys must live in deployment secrets.

## Project structure

```text
api/        Vercel Serverless entry
server/     Node API, order state, payment confirmation, generation providers
src/        Static Web UI
docs/       sources, sample report, README assets
dist/       build output (ignored)
scripts/    build and smoke-test scripts
```

## Contact / community

- Website / brand homepage: <https://chiveshield-intro.vercel.app>
- GitHub repository: <https://github.com/1229119561Weike/chiveshield>

![WeChat QR code](docs/assets/wechat-qr.jpg)

## License

MIT License. See [LICENSE](./LICENSE).

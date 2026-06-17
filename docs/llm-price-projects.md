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

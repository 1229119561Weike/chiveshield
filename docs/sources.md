# ChiveShield 避韭针：100+ 条 AI 服务采购真实信息源清单

生成日期：2026-06-17  
维护部门：调研与定价部  
校验方式：脚本逐条发起 HTTP 请求，仅收录返回 2xx/3xx 的公开 URL；本次通过 138 条。  
定位：这些来源不是“供应商黑名单”，而是帮助甲方识别真实成本、可替代开源方案、采购风险、合理议价和验收边界的中立证据库。

## 使用建议

- 报价谈判时，先用官方 API/云服务价格拆出“硬成本”，再单独评估乙方的需求梳理、集成、部署、测试、运维和责任成本。
- 遇到“自研系统”“私有化”“AI Agent”“批量出图/视频”等高溢价描述时，用开源项目仓库判断成熟组件和真正定制的边界。
- 对高风险场景，把安全、许可证、数据合规、可迁移性和验收用例写进合同，而不是只听效果承诺。

## 主流 AI / 云服务官方定价与成本基准（32 条）

1. **Anthropic Claude Pricing** — <https://docs.anthropic.com/en/docs/about-claude/pricing>  
   - 甲方决策价值：用于拆分 Claude 调用成本、上下文成本和乙方服务费。
2. **Google Gemini API Pricing** — <https://ai.google.dev/gemini-api/docs/pricing>  
   - 甲方决策价值：帮助甲方对比 Gemini API 的真实输入/输出价格与方案报价。
3. **Google Vertex AI Generative AI Pricing** — <https://cloud.google.com/vertex-ai/generative-ai/pricing>  
   - 甲方决策价值：适合评估企业云上托管模型、数据安全和平台服务溢价。
4. **Azure OpenAI Service Pricing** — <https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/>  
   - 甲方决策价值：用于判断企业 Azure 采购中模型调用与云资源是否被混合加价。
5. **Amazon Bedrock Pricing** — <https://aws.amazon.com/bedrock/pricing/>  
   - 甲方决策价值：用于核算 Bedrock 多模型托管成本，识别“平台接入费”是否合理。
6. **Mistral AI Pricing** — <https://mistral.ai/pricing>  
   - 甲方决策价值：给欧洲/开源模型 API 选型提供官方价格锚点。
7. **Cohere Pricing** — <https://cohere.com/pricing>  
   - 甲方决策价值：适合评估企业检索、rerank、embedding 类服务报价。
8. **AI21 Pricing** — <https://www.ai21.com/pricing>  
   - 甲方决策价值：用于对比企业文本生成和应用层模型调用成本。
9. **Replicate Pricing** — <https://replicate.com/pricing>  
   - 甲方决策价值：适合核算开源模型托管推理、图片/视频生成按量成本。
10. **Hugging Face Pricing** — <https://huggingface.co/pricing>  
   - 甲方决策价值：判断开源模型托管、Inference Endpoints 与团队协作成本。
11. **Together AI Pricing** — <https://www.together.ai/pricing>  
   - 甲方决策价值：用于比较开源大模型 API 推理成本与自部署报价。
12. **Fireworks AI Pricing** — <https://fireworks.ai/pricing>  
   - 甲方决策价值：可作为高速推理 API 和微调服务的价格参照。
13. **Groq Pricing** — <https://groq.com/pricing>  
   - 甲方决策价值：用于核验低延迟推理服务的真实调用成本。
14. **DeepSeek API Pricing** — <https://platform.deepseek.com/api-docs/pricing>  
   - 甲方决策价值：用于对比国产/高性价比模型 API 成本，避免报价只参考高价模型。
15. **Perplexity API Pricing** — <https://docs.perplexity.ai/guides/pricing>  
   - 甲方决策价值：适合评估联网问答、搜索增强型报告生成的调用成本。
16. **OpenRouter Models and Pricing** — <https://openrouter.ai/models>  
   - 甲方决策价值：多模型聚合价格页，可快速比较不同模型的成本水位。
17. **Stability AI Platform Pricing** — <https://platform.stability.ai/pricing>  
   - 甲方决策价值：用于判断图片/视频生成 API 成本，识别素材生产报价水分。
18. **fal.ai Pricing** — <https://fal.ai/pricing>  
   - 甲方决策价值：适合核算图片、视频、音频生成模型的按量推理成本。
19. **ElevenLabs Pricing** — <https://elevenlabs.io/pricing>  
   - 甲方决策价值：用于评估配音、TTS、数字人口播方案里的语音生成成本。
20. **AssemblyAI Pricing** — <https://www.assemblyai.com/pricing>  
   - 甲方决策价值：可核算语音转写、会议纪要和音频分析服务成本。
21. **Deepgram Pricing** — <https://deepgram.com/pricing>  
   - 甲方决策价值：用于比较实时语音识别、客服质检和语音机器人底层成本。
22. **Pinecone Pricing** — <https://www.pinecone.io/pricing/>  
   - 甲方决策价值：RAG 知识库常见向量数据库成本锚点，便于拆分存储与检索费用。
23. **Supabase Pricing** — <https://supabase.com/pricing>  
   - 甲方决策价值：用于判断小型 AI WebApp 后端、数据库和认证托管成本。
24. **MongoDB Atlas Pricing** — <https://www.mongodb.com/pricing>  
   - 甲方决策价值：帮助评估文档数据库托管成本是否被不透明加价。
25. **Vercel Pricing** — <https://vercel.com/pricing>  
   - 甲方决策价值：网页/报告站点托管报价参照，识别“部署费”合理区间。
26. **Netlify Pricing** — <https://www.netlify.com/pricing/>  
   - 甲方决策价值：用于比较静态站点、表单和边缘函数托管成本。
27. **DigitalOcean Pricing** — <https://www.digitalocean.com/pricing>  
   - 甲方决策价值：小型自部署服务器成本锚点，便于判断私有化部署报价。
28. **Modal Pricing** — <https://modal.com/pricing>  
   - 甲方决策价值：GPU/Serverless 推理和批处理任务成本参照。
29. **Baseten Pricing** — <https://www.baseten.co/pricing>  
   - 甲方决策价值：用于评估模型部署、推理服务和生产化 SLA 成本。
30. **Dify Cloud Pricing** — <https://dify.ai/pricing>  
   - 甲方决策价值：对比开源自部署与托管版 Dify 的成本边界。
31. **LangSmith Pricing** — <https://www.langchain.com/pricing>  
   - 甲方决策价值：用于评估 Agent/RAG 应用可观测性和评测平台成本。
32. **Zapier Pricing** — <https://zapier.com/pricing>  
   - 甲方决策价值：自动化集成报价参照，判断工作流服务是否过度包装。

## 开源 AI 项目与可替代方案（63 条）

33. **Dify** — <https://github.com/langgenius/dify>  
   - 甲方决策价值：开源 LLM 应用平台，可判断知识库/工作流报价中哪些是成熟组件配置。
34. **LangChain** — <https://github.com/langchain-ai/langchain>  
   - 甲方决策价值：Agent/RAG 开发生态核心项目，帮助识别“自研编排框架”是否只是常规集成。
35. **LlamaIndex** — <https://github.com/run-llama/llama_index>  
   - 甲方决策价值：RAG 数据接入和索引框架，适合评估文档问答项目实施边界。
36. **Haystack** — <https://github.com/deepset-ai/haystack>  
   - 甲方决策价值：开源 NLP/RAG 框架，可作为企业知识库方案替代基准。
37. **RAGFlow** — <https://github.com/infiniflow/ragflow>  
   - 甲方决策价值：面向文档解析和 RAG 的开源项目，可对比知识库交付质量。
38. **AnythingLLM** — <https://github.com/Mintplex-Labs/anything-llm>  
   - 甲方决策价值：本地/自托管知识库聊天工具，适合判断小团队知识库报价。
39. **Open WebUI** — <https://github.com/open-webui/open-webui>  
   - 甲方决策价值：开源 ChatGPT 式界面，可识别简单聊天 UI 是否被高价包装。
40. **LibreChat** — <https://github.com/danny-avila/LibreChat>  
   - 甲方决策价值：多模型聊天平台，适合评估内部 ChatGPT 门户交付范围。
41. **Chatbot UI** — <https://github.com/mckaywrigley/chatbot-ui>  
   - 甲方决策价值：聊天前端模板参照，帮助区分模板改造与真正定制开发。
42. **PrivateGPT** — <https://github.com/zylon-ai/private-gpt>  
   - 甲方决策价值：本地私有文档问答项目，可用于判断“私有化知识库”最低可行方案。
43. **Quivr** — <https://github.com/QuivrHQ/quivr>  
   - 甲方决策价值：开源第二大脑/RAG 应用，适合作为知识库 SaaS 替代参考。
44. **DocsGPT** — <https://github.com/arc53/DocsGPT>  
   - 甲方决策价值：文档问答开源工具，可用于评估技术文档客服类方案。
45. **Khoj** — <https://github.com/khoj-ai/khoj>  
   - 甲方决策价值：个人/团队 AI 助手和知识检索工具，可作为轻量助手方案参照。
46. **Flowise** — <https://github.com/FlowiseAI/Flowise>  
   - 甲方决策价值：低代码 LLM 工作流平台，帮助识别流程搭建类报价是否透明。
47. **Langflow** — <https://github.com/langflow-ai/langflow>  
   - 甲方决策价值：可视化 LLM 编排工具，适合评估工作流/Agent 项目工作量。
48. **n8n** — <https://github.com/n8n-io/n8n>  
   - 甲方决策价值：自动化工作流平台，可对比简单系统集成与高价定制。
49. **Activepieces** — <https://github.com/activepieces/activepieces>  
   - 甲方决策价值：开源自动化平台，适合评估 SMB 工作流自动化报价。
50. **AutoGen** — <https://github.com/microsoft/autogen>  
   - 甲方决策价值：多 Agent 框架，可判断复杂 Agent 方案是否有成熟底层可用。
51. **CrewAI** — <https://github.com/crewAIInc/crewAI>  
   - 甲方决策价值：多角色 Agent 编排框架，适合评估“AI 员工团队”类方案的真实实现难度。
52. **LangGraph** — <https://github.com/langchain-ai/langgraph>  
   - 甲方决策价值：状态图 Agent 框架，帮助评估生产级 Agent 是否具备可控流程。
53. **OpenHands** — <https://github.com/All-Hands-AI/OpenHands>  
   - 甲方决策价值：开源软件工程 Agent，适合判断“AI 程序员”服务是否夸大。
54. **AutoGPT** — <https://github.com/Significant-Gravitas/AutoGPT>  
   - 甲方决策价值：早期通用 Agent 项目，可作为自动化能力边界讨论参考。
55. **MetaGPT** — <https://github.com/geekan/MetaGPT>  
   - 甲方决策价值：多 Agent 软件开发框架，适合评估团队式 Agent 宣传与交付差距。
56. **Rasa** — <https://github.com/RasaHQ/rasa>  
   - 甲方决策价值：开源对话机器人框架，适合客服/意图识别项目采购对比。
57. **Botpress** — <https://github.com/botpress/botpress>  
   - 甲方决策价值：聊天机器人平台，帮助对比客服机器人构建与托管成本。
58. **Ollama** — <https://github.com/ollama/ollama>  
   - 甲方决策价值：本地运行大模型工具，适合判断本地部署是否真的需要复杂工程。
59. **llama.cpp** — <https://github.com/ggml-org/llama.cpp>  
   - 甲方决策价值：本地推理基础项目，可评估小模型私有化部署成本。
60. **vLLM** — <https://github.com/vllm-project/vllm>  
   - 甲方决策价值：高吞吐推理服务，适合评估生产级模型部署报价。
61. **Text Generation Inference** — <https://github.com/huggingface/text-generation-inference>  
   - 甲方决策价值：Hugging Face 推理服务，帮助判断模型服务化成本与复杂度。
62. **LiteLLM** — <https://github.com/BerriAI/litellm>  
   - 甲方决策价值：多模型 API 代理，可用于识别模型网关/统一计费方案是否重复造轮子。
63. **GPT4All** — <https://github.com/nomic-ai/gpt4all>  
   - 甲方决策价值：本地模型应用工具，可作为轻量离线助手参考。
64. **Milvus** — <https://github.com/milvus-io/milvus>  
   - 甲方决策价值：开源向量数据库，适合核算企业级 RAG 存储检索成本。
65. **Qdrant** — <https://github.com/qdrant/qdrant>  
   - 甲方决策价值：向量搜索数据库，可对比知识库检索服务报价。
66. **Weaviate** — <https://github.com/weaviate/weaviate>  
   - 甲方决策价值：开源向量数据库，适合评估语义搜索和知识库基础设施。
67. **Chroma** — <https://github.com/chroma-core/chroma>  
   - 甲方决策价值：轻量向量数据库，帮助判断小型 RAG 项目无需过度基础设施。
68. **LanceDB** — <https://github.com/lancedb/lancedb>  
   - 甲方决策价值：向量数据库/多模态检索方案，适合评估图片和文档检索报价。
69. **ComfyUI** — <https://github.com/comfyanonymous/ComfyUI>  
   - 甲方决策价值：节点式图片/视频生成工作流，适合识别电商图和视频服务底层工具。
70. **Stable Diffusion WebUI** — <https://github.com/AUTOMATIC1111/stable-diffusion-webui>  
   - 甲方决策价值：常见开源出图界面，帮助判断“AI 出图系统”是否只是现成工具。
71. **InvokeAI** — <https://github.com/invoke-ai/InvokeAI>  
   - 甲方决策价值：开源生成式视觉工具，可作为专业图片生成工作流参考。
72. **Diffusers** — <https://github.com/huggingface/diffusers>  
   - 甲方决策价值：生成模型库，适合评估图片/视频模型二开真实难度。
73. **ControlNet** — <https://github.com/lllyasviel/ControlNet>  
   - 甲方决策价值：图像可控生成核心项目，适合评估商品图/姿态控制类需求。
74. **Real-ESRGAN** — <https://github.com/xinntao/Real-ESRGAN>  
   - 甲方决策价值：图片超分辨率工具，可用于评估修图和画质提升服务成本。
75. **GFPGAN** — <https://github.com/TencentARC/GFPGAN>  
   - 甲方决策价值：人脸修复工具，适合评估头像/模特图修复服务是否合理。
76. **rembg** — <https://github.com/danielgatis/rembg>  
   - 甲方决策价值：开源抠图工具，可识别白底图/换背景服务的低成本基础。
77. **AnimateDiff** — <https://github.com/guoyww/AnimateDiff>  
   - 甲方决策价值：开源动画生成项目，适合评估图生视频/短视频方案。
78. **CogVideo** — <https://github.com/THUDM/CogVideo>  
   - 甲方决策价值：开源视频生成模型项目，帮助判断视频生成能力边界。
79. **Open-Sora** — <https://github.com/hpcaitech/Open-Sora>  
   - 甲方决策价值：开源视频生成方向项目，可作为 AI 视频方案调研入口。
80. **SadTalker** — <https://github.com/OpenTalker/SadTalker>  
   - 甲方决策价值：音频驱动口播头像项目，适合数字人/口播视频报价参照。
81. **Whisper** — <https://github.com/openai/whisper>  
   - 甲方决策价值：开源语音识别模型，适合评估转写/字幕/会议纪要成本。
82. **WhisperX** — <https://github.com/m-bain/whisperX>  
   - 甲方决策价值：带对齐能力的转写工具，可用于评估字幕和语音分析服务。
83. **Piper** — <https://github.com/rhasspy/piper>  
   - 甲方决策价值：本地 TTS 方案，可作为语音合成私有化报价参考。
84. **PaddleOCR** — <https://github.com/PaddlePaddle/PaddleOCR>  
   - 甲方决策价值：成熟 OCR 项目，适合合同/票据/图片文字识别采购对比。
85. **docTR** — <https://github.com/mindee/doctr>  
   - 甲方决策价值：文档 OCR 库，可评估文档自动化项目技术路线。
86. **Unstructured** — <https://github.com/Unstructured-IO/unstructured>  
   - 甲方决策价值：文档解析管线，适合评估 RAG 中 PDF/Office 数据处理成本。
87. **MarkItDown** — <https://github.com/microsoft/markitdown>  
   - 甲方决策价值：文档转 Markdown 工具，可作为报告/知识库预处理方案参考。
88. **MinerU** — <https://github.com/opendatalab/MinerU>  
   - 甲方决策价值：文档解析项目，适合评估论文/PDF 知识库质量。
89. **Vercel AI SDK** — <https://github.com/vercel/ai>  
   - 甲方决策价值：AI WebApp 开发 SDK，帮助区分网页 AI 功能集成与真正后端工程。
90. **Next.js** — <https://github.com/vercel/next.js>  
   - 甲方决策价值：网页和 SaaS 原型常用框架，用于判断 WebApp 开发工作量。
91. **shadcn/ui** — <https://github.com/shadcn-ui/ui>  
   - 甲方决策价值：常用 UI 组件源，帮助识别模板/组件搭建类项目成本。
92. **Supabase** — <https://github.com/supabase/supabase>  
   - 甲方决策价值：开源后端平台，适合评估小型 WebApp 的认证、数据库和存储成本。
93. **Appsmith** — <https://github.com/appsmithorg/appsmith>  
   - 甲方决策价值：开源内部工具平台，可替代部分低代码后台定制。
94. **Budibase** — <https://github.com/Budibase/budibase>  
   - 甲方决策价值：低代码内部应用平台，帮助判断后台/表单系统是否需从零开发。
95. **ToolJet** — <https://github.com/ToolJet/ToolJet>  
   - 甲方决策价值：开源低代码工具，可对比内部运营后台报价。

## 采购避坑、议价与治理资料（25 条）

96. **NIST AI Risk Management Framework** — <https://www.nist.gov/itl/ai-risk-management-framework>  
   - 甲方决策价值：给企业采购 AI 服务提供风险识别、治理和验收框架。
97. **OWASP Top 10 for LLM Applications** — <https://owasp.org/www-project-top-10-for-large-language-model-applications/>  
   - 甲方决策价值：安全尽调清单，可避免只看功能不看提示注入和数据泄露。
98. **EU AI Act Official Page** — <https://artificialintelligenceact.eu/>  
   - 甲方决策价值：涉及欧盟用户或高风险场景时，用于判断合规成本是否必要。
99. **Cloud Security Alliance AI Controls Matrix** — <https://cloudsecurityalliance.org/artifacts/ai-controls-matrix>  
   - 甲方决策价值：给 AI 服务安全评估和供应商问卷提供控制项参考。
100. **FinOps Foundation Framework** — <https://www.finops.org/framework/>  
   - 甲方决策价值：云成本治理框架，适合拆分 AI 项目持续云资源成本。
101. **FinOps FOCUS Specification** — <https://focus.finops.org/>  
   - 甲方决策价值：帮助甲方要求云成本口径标准化，避免账单混乱。
102. **AWS Pricing Calculator** — <https://calculator.aws/>  
   - 甲方决策价值：用于独立估算云资源成本，和供应商服务器报价对照。
103. **Azure Pricing Calculator** — <https://azure.microsoft.com/en-us/pricing/calculator/>  
   - 甲方决策价值：用于核算 Azure 部署方案的云资源真实成本。
104. **Google Cloud Pricing Calculator** — <https://cloud.google.com/products/calculator>  
   - 甲方决策价值：用于核对 GCP/Vertex/存储/计算资源报价。
105. **Choose a License** — <https://choosealicense.com/>  
   - 甲方决策价值：帮助甲方理解开源许可证，避免商用授权踩坑。
106. **Open Source Initiative Licenses** — <https://opensource.org/licenses>  
   - 甲方决策价值：权威许可证列表，用于核验开源项目是否真可商用。
107. **SPDX License List** — <https://spdx.org/licenses/>  
   - 甲方决策价值：可标准化记录候选开源项目许可证，便于工程落库。
108. **GitHub Licensing a Repository** — <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository>  
   - 甲方决策价值：帮助判断“无 License 仓库不能默认商用”的采购风险。
109. **GNU Licenses** — <https://www.gnu.org/licenses/licenses.html>  
   - 甲方决策价值：理解 GPL/AGPL 义务，避免把强传染许可证误用于闭源交付。
110. **OpenSSF Scorecard** — <https://github.com/ossf/scorecard>  
   - 甲方决策价值：评估开源项目供应链健康度，避免选择无人维护或安全差的组件。
111. **SLSA Framework** — <https://slsa.dev/>  
   - 甲方决策价值：供应链安全框架，可作为企业级开源组件验收标准。
112. **Sigstore** — <https://www.sigstore.dev/>  
   - 甲方决策价值：用于软件签名和供应链可信交付，适合高要求私有化项目。
113. **CycloneDX SBOM** — <https://cyclonedx.org/>  
   - 甲方决策价值：SBOM 标准可要求供应商交付依赖清单，降低黑盒风险。
114. **OWASP Dependency-Track** — <https://dependencytrack.org/>  
   - 甲方决策价值：帮助甲方持续跟踪开源依赖漏洞，适合专业/定制档验收。
115. **OpenCost** — <https://www.opencost.io/>  
   - 甲方决策价值：Kubernetes 成本监控工具，可验证生产部署运维成本。
116. **Kubernetes Cost Monitoring with OpenCost** — <https://github.com/opencost/opencost>  
   - 甲方决策价值：开源云成本工具仓库，可用于要求供应商提供成本透明度。
117. **CNCF Cloud Native Landscape** — <https://landscape.cncf.io/>  
   - 甲方决策价值：评估供应商选型是否采用成熟生态，而不是闭门造轮子。
118. **Vendor Security Alliance Questionnaire** — <https://www.vendorsecurityalliance.org/>  
   - 甲方决策价值：供应商安全问卷参考，可用于采购尽调和合同附件。
119. **Google Secure AI Framework** — <https://saif.google/>  
   - 甲方决策价值：AI 系统安全框架，适合把模型应用安全写入验收。
120. **Microsoft Responsible AI Standard** — <https://www.microsoft.com/en-us/ai/responsible-ai>  
   - 甲方决策价值：帮助甲方要求供应商说明公平性、透明度和责任边界。

## 行业报告、趋势与模型评测（18 条）

121. **Stanford AI Index Report** — <https://aiindex.stanford.edu/report/>  
   - 甲方决策价值：年度 AI 产业和技术数据，可防止采购判断只听供应商故事。
122. **State of AI Report** — <https://www.stateof.ai/>  
   - 甲方决策价值：技术、产业和投资趋势总览，适合判断 AI 服务是否顺势或过度炒作。
123. **a16z Top 100 GenAI Apps** — <https://a16z.com/100-gen-ai-apps/>  
   - 甲方决策价值：观察真实用户使用的 AI 应用，避免被冷门概念过度营销。
124. **Artificial Analysis** — <https://artificialanalysis.ai/>  
   - 甲方决策价值：模型价格、速度、质量对比，适合做 API 选型与成本谈判。
125. **LMArena Chatbot Arena** — <https://lmarena.ai/>  
   - 甲方决策价值：众包模型能力排名，帮助甲方不只听供应商指定模型。
126. **Papers with Code** — <https://paperswithcode.com/>  
   - 甲方决策价值：查找任务基准和 SOTA，适合核验“行业领先效果”说法。
127. **Hugging Face Open LLM Leaderboard** — <https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard>  
   - 甲方决策价值：开源模型评测入口，用于判断本地模型方案是否够用。
128. **Epoch AI** — <https://epoch.ai/>  
   - 甲方决策价值：AI 算力和模型趋势研究，可帮助理解训练/推理成本变化。
129. **Our World in Data: Artificial Intelligence** — <https://ourworldindata.org/artificial-intelligence>  
   - 甲方决策价值：宏观 AI 指标和趋势，适合开源项目中做科普可信背书。
130. **OECD AI Policy Observatory** — <https://oecd.ai/>  
   - 甲方决策价值：国际政策和治理资料，可判断行业合规趋势。
131. **MLCommons MLPerf** — <https://mlcommons.org/benchmarks/>  
   - 甲方决策价值：硬件/推理/训练基准，帮助评估算力报价是否有依据。
132. **HELM by Stanford CRFM** — <https://crfm.stanford.edu/helm/latest/>  
   - 甲方决策价值：多维模型评测框架，可用于判断模型能力而非只看广告语。
133. **OpenCompass** — <https://github.com/open-compass/opencompass>  
   - 甲方决策价值：开源大模型评测平台，适合中文/开源模型能力比较。
134. **EleutherAI LM Evaluation Harness** — <https://github.com/EleutherAI/lm-evaluation-harness>  
   - 甲方决策价值：模型评测工具，帮助供应商用可复现方式证明能力。
135. **Berkeley Function Calling Leaderboard** — <https://gorilla.cs.berkeley.edu/leaderboard.html>  
   - 甲方决策价值：工具调用能力评测，适合 Agent/工作流采购判断。
136. **MTEB Leaderboard** — <https://huggingface.co/spaces/mteb/leaderboard>  
   - 甲方决策价值：Embedding 模型评测，可用于 RAG/搜索项目选型。
137. **LMSYS Org on GitHub** — <https://github.com/lm-sys>  
   - 甲方决策价值：开源评测与对话竞技场相关项目入口，适合追溯评测工具。
138. **Hugging Face Models** — <https://huggingface.co/models>  
   - 甲方决策价值：开源模型生态入口，可比较自建与 API 调用的可替代性。

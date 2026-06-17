const sampleDemand = '我想给公司做一个 AI 客服，能接入官网和企业微信，自动回答客户问题，并把复杂问题转人工。希望一个月内上线，预算不要太高。';

const serviceCatalog = [
  {
    id: 'customer-support',
    label: 'AI 客服 / 企业知识库',
    keywords: ['客服', '客户', '官网', '企业微信', '知识库', '问答', 'FAQ', '工单', '转人工'],
    searchQueries: ['open source AI customer support chatbot RAG GitHub', 'site:github.com RAG knowledge base chatbot', 'Dify alternative open source AI workflow'],
    candidates: [
      {
        name: 'Dify',
        url: 'https://github.com/langgenius/dify',
        license: 'Apache-2.0 with additional restrictions noted by project',
        stars: '100k+',
        lastUpdated: '需真实 provider 查询确认',
        stack: ['LLM app platform', 'RAG', 'Workflow'],
        fitScore: 88,
        strengths: ['适合快速搭建知识库问答和工作流', '有自部署文档和应用编排能力', '便于做 PoC 验证'],
        limitations: ['企业微信/CRM 深度集成仍需开发', '生产级权限、日志、监控要单独验收'],
        selfHostDifficulty: 'medium'
      },
      {
        name: 'RAGFlow',
        url: 'https://github.com/infiniflow/ragflow',
        license: 'Apache-2.0',
        stars: '50k+',
        lastUpdated: '需真实 provider 查询确认',
        stack: ['RAG', 'Document AI', 'Search'],
        fitScore: 82,
        strengths: ['偏文档解析和知识库检索', '适合企业资料问答场景'],
        limitations: ['客服渠道接入和运营后台需要补齐', '部署资源和文档处理效果需实测'],
        selfHostDifficulty: 'medium'
      },
      {
        name: 'Chatwoot',
        url: 'https://github.com/chatwoot/chatwoot',
        license: 'MIT',
        stars: '20k+',
        lastUpdated: '需真实 provider 查询确认',
        stack: ['Customer support', 'Inbox', 'Automation'],
        fitScore: 76,
        strengths: ['成熟客服工单和会话后台', '可作为人工接管和多渠道基础'],
        limitations: ['AI 问答/RAG 通常要外接', '中文企业微信接入需额外验证'],
        selfHostDifficulty: 'medium'
      }
    ]
  },
  {
    id: 'data-analysis',
    label: 'AI 数据分析 / 报表助手',
    keywords: ['数据', '报表', 'BI', 'Excel', 'SQL', '数据库', '分析'],
    searchQueries: ['open source text to SQL data analyst agent', 'open source BI assistant LLM GitHub'],
    candidates: [
      {
        name: 'Dataherald',
        url: 'https://github.com/Dataherald/dataherald',
        license: 'Apache-2.0',
        stars: '需查询',
        lastUpdated: '需真实 provider 查询确认',
        stack: ['Text-to-SQL', 'Analytics'],
        fitScore: 80,
        strengths: ['贴近自然语言查数', '适合做 BI 助手 PoC'],
        limitations: ['权限、审计、口径管理必须另做', '生产数据接入风险高'],
        selfHostDifficulty: 'medium'
      }
    ]
  },
  {
    id: 'agent-tools',
    label: 'AI Agent / 内部工具',
    keywords: ['agent', '工具调用', 'MCP', '自动化', '浏览器', '流程'],
    searchQueries: ['AI agent workflow automation open source MCP', 'open source AI agent tool calling GitHub'],
    candidates: [
      {
        name: 'Flowise',
        url: 'https://github.com/FlowiseAI/Flowise',
        license: 'Apache-2.0',
        stars: '需查询',
        lastUpdated: '需真实 provider 查询确认',
        stack: ['Low-code LLM apps', 'Agent workflow'],
        fitScore: 78,
        strengths: ['低代码工作流易演示', '适合快速连接常见组件'],
        limitations: ['复杂生产操作需要权限隔离和审计', '不能把配置包装成高价自研'],
        selfHostDifficulty: 'low'
      }
    ]
  }
];

const fallbackCandidate = {
  id: 'general',
  label: '其他 / 低置信度',
  keywords: [],
  searchQueries: ['open source AI workflow GitHub', 'AI service open source self hosted alternatives'],
  candidates: [
    {
      name: 'Dify',
      url: 'https://github.com/langgenius/dify',
      license: 'Apache-2.0 with project terms',
      stars: '需查询',
      lastUpdated: '需真实 provider 查询确认',
      stack: ['LLM app platform'],
      fitScore: 68,
      strengths: ['可覆盖多种 LLM 应用 PoC'],
      limitations: ['需求类型不清时不能直接报价为生产级', '需要人工复核集成边界'],
      selfHostDifficulty: 'medium'
    }
  ]
};

const ReportOrderStatus = Object.freeze({
  draft: 'draft',
  paymentCreated: 'payment_created',
  pendingPayment: 'pending_payment',
  paid: 'paid',
  generating: 'generating',
  completed: 'completed',
  paymentFailed: 'payment_failed',
  generationFailed: 'generation_failed',
  expired: 'expired'
});

const reportProduct = {
  amountMinor: 140,
  currency: 'usd',
  displayPrice: '$1.40 USD',
  originalDisplayPrice: '约等于原 ¥9.9 测试价',
  productName: 'ChiveShield AI 服务采购防坑报告',
  livePaymentUrl: 'https://buy.stripe.com/9B628s2J6bok1nH26h9AA0q',
  livePaymentLinkId: 'public-stripe-checkout-link'
};

const demoPaymentProvider = {
  mode: 'demo',
  createPaymentLink(order) {
    return {
      provider: 'DemoMatrixPaymentProvider',
      mode: 'demo',
      paymentLinkId: `demo_link_${order.id}`,
      paymentUrl: `https://matrix.local/demo-pay?order_id=${encodeURIComponent(order.id)}`,
      metadata: {
        order_id: order.id,
        service: 'one_report',
        workspace: 'chiveshield',
        version: '0.1.0'
      }
    };
  }
};

let currentMarkdown = '';
let currentOrder = null;
let currentDemand = '';
let currentPreviewReport = null;

const form = document.querySelector('#demandForm');
const input = document.querySelector('#demandInput');
const sampleButton = document.querySelector('#sampleButton');
const previewSection = document.querySelector('#previewSection');
const paymentSection = document.querySelector('#paymentSection');
const reportSection = document.querySelector('#reportSection');
const toast = document.querySelector('#toast');
const markdownBuffer = document.querySelector('#markdownBuffer');
const unlockButton = document.querySelector('#unlockButton');
const mockPayButton = document.querySelector('#mockPayButton');

sampleButton.addEventListener('click', () => {
  input.value = sampleDemand;
  input.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const demand = input.value.trim();
  if (!demand) {
    showToast('请先输入业务服务需求。');
    return;
  }
  currentDemand = demand;
  currentPreviewReport = generateReport(demand);
  currentOrder = null;
  currentMarkdown = '';
  paymentSection.hidden = true;
  reportSection.hidden = true;
  renderPreview(currentPreviewReport);
  previewSection.hidden = false;
  previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('免费预览已生成；完整报告需付款后解锁。');
});

unlockButton.addEventListener('click', () => {
  if (!currentDemand) {
    showToast('请先生成免费预览。');
    return;
  }
  currentOrder = createReportOrder(currentDemand);
  currentOrder = transitionOrder(currentOrder, ReportOrderStatus.paymentCreated, {
    paymentLink: {
      provider: 'AgentRevenueStripePaymentLink',
      mode: 'live-test-link-approved',
      paymentLinkId: reportProduct.livePaymentLinkId,
      paymentUrl: reportProduct.livePaymentUrl,
      metadata: {
        workspace: 'chiveshield',
        service: 'one_report',
        version: 'v1',
        pricing: 'preview_then_full_report',
        original_price: '9.9_cny_equivalent',
        test_link: 'true'
      }
    }
  });
  currentOrder = transitionOrder(currentOrder, ReportOrderStatus.pendingPayment);
  renderOrder(currentOrder);
  paymentSection.hidden = false;
  paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('真实测试支付链接已准备；支付成功仍需 Matrix/后端确认。');
});

mockPayButton.addEventListener('click', () => {
  if (!currentOrder || currentOrder.status !== ReportOrderStatus.pendingPayment) {
    showToast('请先创建待支付订单。');
    return;
  }
  currentOrder = transitionOrder(currentOrder, ReportOrderStatus.paid, {
    matrixPaymentId: `demo_payment_${currentOrder.id}`,
    paidAt: new Date().toISOString()
  });
  renderOrder(currentOrder);
  showToast('Demo/mock 支付成功：这不代表真实收款。');
  generatePaidOrderReport();
});

function renderPreview(report) {
  document.querySelector('#previewSummaryCard').innerHTML = `
    <p class="eyebrow">Preview</p>
    <h3>${escapeHtml(report.serviceType.primary)}</h3>
    <p>${escapeHtml(report.demandSummary)}</p>
    <p>识别置信度：${escapeHtml(confidenceLabel(report.serviceType.confidence))} · 初步风险等级：${escapeHtml(riskLabel(report.riskLevel))}</p>
  `;
  const questions = report.negotiationScripts.slice(0, 3);
  document.querySelector('#previewQuestionsCard').innerHTML = cardList('先问服务商这 3 个问题', questions.map((item) => `“${item}”`));
}

function createReportOrder(demandText) {
  const id = `order_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`;
  return {
    id,
    demandText,
    amountMinor: reportProduct.amountMinor,
    currency: reportProduct.currency,
    productName: reportProduct.productName,
    status: ReportOrderStatus.draft,
    createdAt: new Date().toISOString(),
    statusHistory: [{ status: ReportOrderStatus.draft, at: new Date().toISOString(), note: '用户已提交需求，订单草稿创建。' }],
    metadata: {
      order_id: id,
      workspace: 'chiveshield',
      service: 'one_report',
      version: 'v1',
      pricing: 'preview_then_full_report',
      test_link: 'true'
    }
  };
}

function transitionOrder(order, status, patch = {}) {
  return {
    ...order,
    ...patch,
    status,
    statusHistory: [
      ...order.statusHistory,
      { status, at: new Date().toISOString(), note: statusNote(status) }
    ]
  };
}

function generatePaidOrderReport() {
  currentOrder = transitionOrder(currentOrder, ReportOrderStatus.generating);
  renderOrder(currentOrder);
  const report = generateReport(currentOrder.demandText);
  currentMarkdown = toMarkdown(report, currentOrder);
  markdownBuffer.value = currentMarkdown;
  markdownBuffer.textContent = currentMarkdown;
  markdownBuffer.setAttribute('data-ready', 'true');
  markdownBuffer.setAttribute('data-mode', 'demo');
  currentOrder = transitionOrder(currentOrder, ReportOrderStatus.completed, {
    reportId: `report_${currentOrder.id}`,
    reportMarkdown: currentMarkdown
  });
  renderOrder(currentOrder);
  renderReport(report);
  reportSection.hidden = false;
  reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('报告已生成，当前使用 Demo 调研与生成能力。');
}

function renderOrder(order) {
  document.querySelector('#orderStatusPill').textContent = statusLabel(order.status);
  document.querySelector('#orderStatusPill').setAttribute('data-status', order.status);
  document.querySelector('#orderMeta').innerHTML = `
    <div><span>订单编号</span><strong>${escapeHtml(order.id)}</strong></div>
    <div><span>收款金额</span><strong>${escapeHtml(reportProduct.displayPrice)}</strong></div>
    <div><span>服务内容</span><strong>${escapeHtml(order.productName)}</strong></div>
  `;
  document.querySelector('#paymentLinkText').textContent = order.paymentLink
    ? '支付页已准备好。你将离开本站前往 Stripe 托管收银台；付款完成后，Matrix/后端会核验付款记录，再解锁完整报告。'
    : '正在准备安全支付页。';
  document.querySelector('#statusTimeline').innerHTML = order.statusHistory.map((item, index) => `
    <li class="${index === order.statusHistory.length - 1 ? 'current' : ''}">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <div><strong>${statusLabel(item.status)}</strong><small>${new Date(item.at).toLocaleTimeString()}</small><p>${escapeHtml(item.note)}</p></div>
    </li>
  `).join('');
  paymentSection.setAttribute('data-order-status', order.status);
  paymentSection.setAttribute('data-payment-mode', order.paymentLink?.mode || 'local-demo');
  mockPayButton.disabled = order.status !== ReportOrderStatus.pendingPayment;
}

document.querySelector('#copyMarkdownButton').addEventListener('click', async () => {
  if (!currentMarkdown) return;
  try {
    await navigator.clipboard.writeText(currentMarkdown);
    showToast('Markdown 已复制。');
  } catch {
    const fallback = document.createElement('textarea');
    fallback.value = currentMarkdown;
    fallback.setAttribute('readonly', '');
    fallback.style.position = 'fixed';
    fallback.style.left = '-9999px';
    document.body.appendChild(fallback);
    fallback.select();
    document.execCommand('copy');
    fallback.remove();
    showToast('Markdown 已复制。');
  }
});

document.querySelector('#downloadMarkdownButton').addEventListener('click', () => {
  if (!currentMarkdown) return;
  const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chiveshield-report-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('Markdown 已下载。');
});

function generateReport(demand) {
  const service = classifyDemand(demand);
  const hasSensitiveData = /(客户|用户|聊天记录|订单|手机号|微信|企业微信|数据库|隐私|会员)/.test(demand);
  const needsPrivateDeploy = /(私有|本地|内网|不能上云|自部署|部署)/.test(demand);
  const needsChannelIntegration = /(企业微信|微信|官网|小程序|飞书|钉钉|CRM|工单|公众号)/.test(demand);
  const shortTimeline = /(一周|两周|一个月|月底|尽快|马上)/.test(demand);
  const budgetSensitive = /(预算|便宜|不要太高|低价|9.9|几千|万元以内)/.test(demand);
  const riskLevel = hasSensitiveData && needsChannelIntegration ? 'medium' : service.confidence === 'low' ? 'high' : 'medium';
  const recommendation = service.confidence === 'low'
    ? '先做需求澄清和小 PoC，不建议直接签生产级合同。'
    : '先用开源/成熟工具做 PoC，验收通过后再购买标准实施服务。';

  return {
    mode: 'demo',
    provider: 'DemoProvider',
    generatedAt: new Date().toISOString(),
    demand,
    demandSummary: summarizeDemand(demand, service.label),
    serviceType: {
      primary: service.label,
      confidence: service.confidence,
      reason: service.reason
    },
    recommendation,
    riskLevel,
    budgetReminder: budgetSensitive ? '预算敏感：要求供应商拆分配置、定制开发、模型调用和运维费用。' : '未发现明确预算：建议先问清报价对应 demo、内部使用还是生产级系统。',
    breakdown: {
      businessGoal: inferGoal(demand),
      users: /客户|客服/.test(demand) ? '客户、客服团队、运营人员' : '业务使用者和项目负责人',
      dataSources: hasSensitiveData ? '官网内容、FAQ、客户会话或企业内部资料' : '用户提供资料、公开页面或业务文档',
      channels: needsChannelIntegration ? '存在外部渠道/系统接入诉求' : '暂未明确渠道，需在需求阶段确认',
      automation: /自动|无人|批量/.test(demand) ? '希望较高自动化，但必须保留人工接管' : '建议先半自动，保留人工复核',
      privateDeploy: needsPrivateDeploy ? '可能需要私有化或本地部署' : '未明确私有部署，需确认数据安全要求',
      sensitiveData: hasSensitiveData ? '涉及客户或业务数据，需约定脱敏、权限和日志' : '暂未识别强敏感数据',
      acceptance: '用 10-20 条真实业务样例测试命中率、失败处理、人工接管和数据导出。'
    },
    searchQueries: service.searchQueries,
    openSourceCandidates: service.candidates,
    technicalRoutes: [
      '最小可行路线：用开源平台/模板搭建 PoC，导入少量资料，验证核心问答或自动化效果。',
      '稳妥商业路线：补权限、日志、渠道接入、人工接管、备份、部署文档和验收用例。',
      shortTimeline ? '时间风险：一个月内上线应限定范围，避免把生产级 SLA 塞进 PoC 报价。' : '不建议路线：一上来承诺全自动、高转化、无需维护或所谓“自研大模型”。'
    ],
    riskPoints: buildRisks({ hasSensitiveData, needsPrivateDeploy, needsChannelIntegration, budgetSensitive }),
    pricingTiers: buildPricingTiers(service.label),
    acceptanceChecklist: [
      '能否独立访问并完成核心流程？',
      '是否交付源码或明确不开源/不交源码原因？',
      '是否提供部署文档和环境变量说明？',
      '是否能导出用户数据和业务数据？',
      '是否明确模型供应商、API 成本和调用限制？',
      '是否有失败兜底和人工接管方式？',
      '是否有权限控制、日志和基础安全措施？',
      '是否约定修改范围、维护周期和额外费用？',
      '是否提供测试用例或验收样例？'
    ],
    negotiationScripts: [
      '这个方案里哪些部分是开源项目/成熟工具，哪些是你们真正定制开发的？',
      '能不能把费用拆成需求梳理、部署配置、定制开发、运维维护、模型调用成本？',
      '如果后续不续费，源码、数据、部署环境分别怎么交接？',
      '验收时我们按哪些具体用例测试？失败如何修复？',
      '这个报价对应的是 demo、可内部使用，还是生产级系统？',
      '是否可以先做一个小 PoC，验证效果后再扩大范围？'
    ],
    sources: service.candidates.map((candidate) => ({
      title: `${candidate.name} GitHub repository`,
      url: candidate.url,
      note: 'DemoProvider 内置候选；真实星标、活跃度和 License 需由真实 provider 查询确认。'
    }))
  };
}

function classifyDemand(demand) {
  const scored = serviceCatalog.map((item) => ({
    ...item,
    score: item.keywords.reduce((sum, word) => sum + (demand.toLowerCase().includes(word.toLowerCase()) ? 1 : 0), 0)
  })).sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.score === 0) {
    return { ...fallbackCandidate, confidence: 'low', reason: '未命中明确服务类型关键词，需要人工复核需求边界。' };
  }
  return {
    ...best,
    confidence: best.score >= 3 ? 'high' : 'medium',
    reason: `命中 ${best.score} 个场景关键词：${best.keywords.filter((word) => demand.includes(word)).join('、') || '语义相关词'}。`
  };
}

function summarizeDemand(demand, serviceLabel) {
  const clean = demand.replace(/\s+/g, ' ').slice(0, 72);
  return `用户希望采购“${serviceLabel}”相关服务：${clean}${demand.length > 72 ? '…' : ''}`;
}

function inferGoal(demand) {
  if (/客服|问答|知识库/.test(demand)) return '降低重复咨询处理成本，提高客户问题响应速度，并保留人工接管。';
  if (/报表|数据|分析/.test(demand)) return '让业务人员用自然语言获取数据分析结果，同时保持口径和权限可控。';
  if (/内容|小红书|公众号|视频/.test(demand)) return '提高内容生产效率，但不能把投放效果包装成确定承诺。';
  return '用 AI 工具提升业务流程效率，先验证最小闭环再扩大投入。';
}

function buildRisks(flags) {
  const risks = [
    '模板包装：把开源模板/低代码工具包装成高价定制。',
    '模型神化：把 API 调用说成自研大模型。',
    '交付物模糊：只说“搭建系统”，不说源码、账号、部署方式和验收指标。',
    '锁定与迁移风险：不交源码、不交数据、不支持导出。'
  ];
  if (flags.needsPrivateDeploy) risks.push('私有化溢价不透明：服务器、部署、运维和安全费用混在一起不拆分。');
  if (flags.hasSensitiveData) risks.push('数据合规风险：客户数据、聊天记录或业务资料未说明权限、脱敏和日志。');
  if (flags.needsChannelIntegration) risks.push('渠道接入低估：企微、官网、CRM、工单系统通常不是“点一下插件”就结束。');
  if (flags.budgetSensitive) risks.push('低价首单陷阱：首单便宜，后续高额年费、改动费或账号迁移费。');
  return risks;
}

function buildPricingTiers(serviceLabel) {
  return [
    {
      name: '低配',
      suitableFor: '简单 demo、模板改造、内部试用',
      deliverables: ['可运行 demo', '基础配置', '简单说明文档'],
      pricingLogic: '主要成本是配置、少量前端调整和部署协助。',
      redFlags: ['把低配 demo 报成生产级系统']
    },
    {
      name: '标准',
      suitableFor: `小企业真实使用的 ${serviceLabel}`,
      deliverables: ['稳定部署', '基础权限', '数据导入', '使用文档', '1-2 轮调整'],
      pricingLogic: '成本来自需求梳理、部署、适配和基础测试。',
      redFlags: ['不写验收用例', '不说明模型调用成本']
    },
    {
      name: '专业',
      suitableFor: '多部门使用、私有数据、较高稳定性要求',
      deliverables: ['私有部署', '日志和监控', '备份', '验收文档', '培训'],
      pricingLogic: '成本来自系统工程、数据安全和运维责任。',
      redFlags: ['私有部署费用不拆分', '没有运维边界']
    },
    {
      name: '定制',
      suitableFor: '多系统集成、复杂流程、生产级 SLA',
      deliverables: ['定制开发', '接口集成', '安全审计', 'SLA', '长期维护'],
      pricingLogic: '应按工作量、责任边界和风险报价。',
      redFlags: ['承诺全自动效果', '不提供项目计划和里程碑']
    }
  ];
}

function renderReport(report) {
  document.querySelector('#scoreStrip').innerHTML = [
    metric('服务类型', report.serviceType.primary),
    metric('置信度', confidenceLabel(report.serviceType.confidence)),
    metric('风险等级', riskLabel(report.riskLevel)),
    metric('搜索模式', report.mode === 'demo' ? 'Demo 数据' : '真实联网')
  ].join('');

  document.querySelector('#summaryCard').innerHTML = `
    <p class="eyebrow">Summary</p>
    <h3>${escapeHtml(report.demandSummary)}</h3>
    <p>${escapeHtml(report.recommendation)}</p>
    <p>${escapeHtml(report.budgetReminder)}</p>
    <div class="tag-row">${report.searchQueries.map((q) => `<span class="tag">${escapeHtml(q)}</span>`).join('')}</div>
  `;

  document.querySelector('#breakdownCard').innerHTML = cardList('需求拆解', Object.entries(report.breakdown).map(([key, value]) => `${fieldLabel(key)}：${value}`));
  document.querySelector('#routeCard').innerHTML = cardList('技术路线建议', report.technicalRoutes);
  document.querySelector('#projectsCard').innerHTML = renderProjects(report.openSourceCandidates);
  document.querySelector('#riskCard').innerHTML = cardList('割韭菜风险点', report.riskPoints);
  document.querySelector('#pricingCard').innerHTML = renderPricing(report.pricingTiers);
  document.querySelector('#acceptanceCard').innerHTML = cardList('验收清单', report.acceptanceChecklist);
  document.querySelector('#scriptsCard').innerHTML = cardList('议价话术', report.negotiationScripts.map((item) => `“${item}”`));
  document.querySelector('#sourcesCard').innerHTML = cardList('资料来源', report.sources.map((source) => `<a href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>：${escapeHtml(source.note)}`));
}

function metric(label, value) {
  return `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function cardList(title, items) {
  return `<p class="eyebrow">${escapeHtml(title)}</p><h3>${escapeHtml(title)}</h3><ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function renderProjects(projects) {
  return `
    <p class="eyebrow">Open Source Candidates</p>
    <h3>开源项目候选</h3>
    <div class="project-list">
      ${projects.map((project) => `
        <div class="project-item">
          <div class="project-title">
            <a href="${escapeAttr(project.url)}" target="_blank" rel="noreferrer">${escapeHtml(project.name)}</a>
            <span class="score">适配度 ${project.fitScore}/100</span>
          </div>
          <p>License：${escapeHtml(project.license)} · Stars：${escapeHtml(project.stars)} · 自部署难度：${escapeHtml(difficultyLabel(project.selfHostDifficulty))}</p>
          <p>优势：${escapeHtml(project.strengths.join('；'))}</p>
          <p>局限：${escapeHtml(project.limitations.join('；'))}</p>
          <div class="tag-row">${project.stack.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('')}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPricing(tiers) {
  return `
    <p class="eyebrow">Pricing Ladder</p>
    <h3>正常报价梯度</h3>
    <div class="pricing-list">
      ${tiers.map((tier) => `
        <div class="pricing-item">
          <h4>${escapeHtml(tier.name)} · ${escapeHtml(tier.suitableFor)}</h4>
          <p>合理交付：${escapeHtml(tier.deliverables.join('、'))}</p>
          <p>判断逻辑：${escapeHtml(tier.pricingLogic)}</p>
          <p>异常信号：${escapeHtml(tier.redFlags.join('、'))}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function toMarkdown(report, order = null) {
  return `# 避韭针 ChiveShield 报告

> 订单 ID：${order?.id || 'local-demo'}
> 支付状态：${order ? statusLabel(order.status) : '本地直接生成'}
> 支付模式：${order?.paymentLink?.mode === 'demo' || !order ? 'Demo/mock 支付（非真实收款）' : 'Matrix 真实收款'}
> 生成模式：${report.mode === 'demo' ? 'Demo 数据源（非真实联网）' : '真实搜索'}
> 生成时间：${report.generatedAt}

## 顶部摘要

- 服务类型：${report.serviceType.primary}
- 识别置信度：${confidenceLabel(report.serviceType.confidence)}
- 需求摘要：${report.demandSummary}
- 推荐采购策略：${report.recommendation}
- 风险等级：${riskLabel(report.riskLevel)}
- 预算提醒：${report.budgetReminder}
- 判断理由：${report.serviceType.reason}

## 需求拆解

${Object.entries(report.breakdown).map(([key, value]) => `- ${fieldLabel(key)}：${value}`).join('\n')}

## 搜索关键词

${report.searchQueries.map((query) => `- ${query}`).join('\n')}

## 开源项目候选

${report.openSourceCandidates.map((project) => `### ${project.name}

- URL：${project.url}
- License：${project.license}
- Stars：${project.stars}
- 技术栈：${project.stack.join('、')}
- 适配度：${project.fitScore}/100
- 优势：${project.strengths.join('；')}
- 局限：${project.limitations.join('；')}
- 自部署难度：${difficultyLabel(project.selfHostDifficulty)}`).join('\n\n')}

## 技术路线建议

${report.technicalRoutes.map((item) => `- ${item}`).join('\n')}

## 割韭菜风险点

${report.riskPoints.map((item) => `- ${item}`).join('\n')}

## 正常报价梯度

${report.pricingTiers.map((tier) => `### ${tier.name}

- 适用场景：${tier.suitableFor}
- 合理交付：${tier.deliverables.join('、')}
- 价格判断逻辑：${tier.pricingLogic}
- 异常信号：${tier.redFlags.join('、')}`).join('\n\n')}

## 验收清单

${report.acceptanceChecklist.map((item) => `- [ ] ${item}`).join('\n')}

## 议价话术

${report.negotiationScripts.map((item) => `- ${item}`).join('\n')}

## 资料来源

${report.sources.map((source) => `- [${source.title}](${source.url}) — ${source.note}`).join('\n')}

## 搜索 Provider 边界

当前报告由 DemoProvider 生成，只用于离线演示。真实 provider 必须返回可追溯 SearchResult：title、url、snippet、sourceType、retrievedAt、provider。没有 API key 时不能把 demo/mock 结果展示为真实联网。
`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function confidenceLabel(value) {
  return { high: '高', medium: '中', low: '低' }[value] || value;
}

function riskLabel(value) {
  return { low: '低', medium: '中', high: '高' }[value] || value;
}

function difficultyLabel(value) {
  return { low: '低', medium: '中', high: '高' }[value] || value;
}

function statusLabel(status) {
  return {
    draft: '草稿',
    payment_created: '已创建支付链接',
    pending_payment: '等待付款',
    paid: '已付款',
    generating: '生成中',
    completed: '已完成',
    payment_failed: '支付失败',
    generation_failed: '生成失败',
    expired: '已过期'
  }[status] || status;
}

function statusNote(status) {
  return {
    draft: '用户还在输入或订单刚创建。',
    payment_created: 'PaymentProvider 已创建支付链接；本地为 demo link。',
    pending_payment: '等待 Matrix 确认付款；本地演示需点击 mock 支付按钮。',
    paid: 'Matrix 已确认付款；demo 模式只代表本地状态变更。',
    generating: 'ReportGenerationProvider 开始生成报告。',
    completed: '报告已生成，可展示并导出 Markdown。',
    payment_failed: '支付失败或取消。',
    generation_failed: '报告生成失败。',
    expired: '订单或支付链接已过期。'
  }[status] || status;
}

function fieldLabel(key) {
  return {
    businessGoal: '业务目标',
    users: '目标用户/使用者',
    dataSources: '数据来源',
    channels: '接入渠道',
    automation: '自动化程度',
    privateDeploy: '私有部署',
    sensitiveData: '敏感数据',
    acceptance: '验收结果'
  }[key] || key;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

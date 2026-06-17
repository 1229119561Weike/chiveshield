export class ReportGenerationProvider {
  constructor({ mode = process.env.CHIVESHIELD_GENERATION_MODE || 'demo' } = {}) {
    this.mode = mode;
  }

  async generate(order) {
    if (process.env.CHIVESHIELD_FORCE_GENERATION_FAILURE === '1') {
      throw new Error('Forced generation failure for verification.');
    }
    const generatedAt = new Date().toISOString();
    const reportId = `report_${order.id}`;
    const markdown = `# 避韭针 ChiveShield 付费报告\n\n> 订单 ID：${order.id}\n> 支付状态：paid\n> 生成模式：${this.mode === 'demo' ? 'Demo 规则生成（非真实搜索）' : 'Matrix 托管生成'}\n> 生成时间：${generatedAt}\n\n## 需求\n\n${order.demandText}\n\n## 交付说明\n\n本后端骨架仅验证 Matrix 收款确认后触发报告生成的状态流。真实托管版应接入 Matrix 模型、SearchProvider 与完整报告生成管线。\n`;
    return { reportId, markdown, generatedAt, mode: this.mode };
  }
}

import type {AppLocale} from '@/i18n/routing';

export const companyFacts = {
  nameCn: '德州市第二职业中等专业学校服装加工厂',
  nameEn: 'Dezhou No.2 Vocational Secondary School Garment Processing Factory',
  unifiedSocialCreditCode: '91371402MA3CA4N641',
  legalRepresentative: '孔志杰',
  establishedDate: '1991-11-27',
  businessType: '集体经营单位(非法人)',
  addressCn: '迎宾路（第二职业中等专业学校院内）',
  businessScopeSummaryCn: '服装制造及相关服饰、纺织制品业务。',
  businessScopeSummaryEn:
    'Garment manufacturing and related apparel/textile products, based on licensed business activities.'
} as const;

export const contactConfig = {
  phone: '+86-158-0681-2960',
  email: 'publicrelations@timelessclothinggroup.com.cn',
  wechat: 'factory-wechat-id',
  address: '迎宾路（第二职业中等专业学校院内）'
} as const;

export type ProductCategory = {
  id: string;
  label: string;
  description: string;
  image: string;
  materials: string;
  moq: string;
  leadTime: string;
  customization: string;
};

export type SiteLocaleContent = {
  localeName: string;
  metaDescription: string;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    bullets: string[];
  };
  factoryAtGlance: {
    title: string;
    description: string;
    stats: Array<{label: string; value: string; note: string}>;
  };
  whyUs: {
    title: string;
    items: Array<{title: string; description: string}>;
  };
  trustBlocks: Array<{title: string; text: string}>;
  capabilities: {
    introTitle: string;
    introText: string;
    items: Array<{title: string; text: string}>;
    timelineTitle: string;
    timeline: string[];
    equipmentTitle: string;
    equipmentTable: Array<{item: string; placeholderSpec: string; note: string}>;
    moqLeadTitle: string;
    moqLeadItems: Array<{label: string; value: string}>;
  };
  quality: {
    title: string;
    intro: string;
    checkpoints: Array<{stage: string; details: string}>;
    certificationTitle: string;
    certifications: Array<{name: string; status: string}>;
    disclaimer: string;
  };
  about: {
    title: string;
    paragraphs: string[];
    scopeNote: string;
  };
  products: {
    title: string;
    subtitle: string;
    allFilter: string;
    categories: ProductCategory[];
  };
  faq: {
    title: string;
    items: Array<{q: string; a: string}>;
  };
  contact: {
    title: string;
    subtitle: string;
    formLabels: {
      name: string;
      company: string;
      email: string;
      whatsappWechat: string;
      productType: string;
      targetQuantity: string;
      targetPrice: string;
      deliveryDate: string;
      techPack: string;
      message: string;
    };
    placeholders: {
      productType: string;
      targetQuantity: string;
      targetPrice: string;
      message: string;
    };
    successTitle: string;
    successMessage: string;
  };
  legal: {
    privacyTitle: string;
    termsTitle: string;
  };
};

export const siteContent: Record<AppLocale, SiteLocaleContent> = {
  zh: {
    localeName: '中文',
    metaDescription:
      '面向品牌客户的服装OEM/ODM生产合作网站，提供打样、大货生产、质量管控与交付支持。',
    hero: {
      badge: '服装制造 / OEM ODM',
      title: '稳定交付的大货服装制造合作伙伴',
      subtitle:
        '面向品牌方、贸易商与渠道客户，提供从打样到量产的服装制造服务。页面数据可按实际产能与排期实时更新。',
      bullets: ['交期（占位）：20-45天', '质量管控（占位）：三道检验流程', '月产能（占位）：可按品类配置']
    },
    factoryAtGlance: {
      title: '工厂一览',
      description: '以服装加工为核心，覆盖样衣开发、材料协同、批量生产与出货准备。',
      stats: [
        {label: '合作模式', value: 'OEM / ODM', note: '按技术包与样衣管理'} ,
        {label: '服务对象', value: 'B2B', note: '品牌、贸易商、渠道客户'} ,
        {label: '业务范围', value: '服装及相关产品', note: '以营业执照登记范围为准'}
      ]
    },
    whyUs: {
      title: '为什么选择我们',
      items: [
        {title: '沟通清晰', description: '围绕技术包、样品批注与确认节点推进项目。'},
        {title: '流程透明', description: '从询盘到出货每个阶段都可追踪与复核。'},
        {title: '支持定制', description: '支持面辅料、印绣花、包装与标签等定制需求。'}
      ]
    },
    trustBlocks: [
      {title: 'Factory overview', text: '工厂概况与团队协同机制（占位内容，支持后续替换）。'},
      {title: 'Quality control', text: '来料、在线、尾检三段质检（占位指标，支持编辑）。'},
      {title: 'Compliance', text: '合规资料按客户项目需求提供。'},
      {title: 'Clients served', text: '服务客户类型示例：品牌方/贸易商/渠道商（不展示虚构品牌）。'}
    ],
    capabilities: {
      introTitle: '生产能力与服务模块',
      introText: '支持OEM/ODM合作，围绕技术资料、样衣确认和批量交付执行。',
      items: [
        {title: 'OEM/ODM', text: '按客户设计生产，或协助进行款式与工艺优化。'},
        {title: '打样开发', text: '支持样衣制作、版型修正与工艺确认。'},
        {title: '纸样与工艺', text: '支持纸样制作、尺码放码与工艺单协同。'},
        {title: '面辅料协同', text: '可按项目需求进行面料与辅料采购协同。'},
        {title: '印花/绣花', text: '支持基础工艺路径，打样确认后批量执行。'},
        {title: '包装配套', text: '支持主唛、洗标、吊牌与外箱包装方案。'}
      ],
      timelineTitle: '生产流程',
      timeline: ['询盘沟通', '技术包确认', '样品开发', '大货生产', '质量检验', '出货安排'],
      equipmentTitle: '设备与产能（占位，可编辑）',
      equipmentTable: [
        {item: '平缝机', placeholderSpec: '占位数量', note: '请替换为真实数量'},
        {item: '包缝机', placeholderSpec: '占位数量', note: '请替换为真实数量'},
        {item: '整烫设备', placeholderSpec: '占位数量', note: '请替换为真实数量'}
      ],
      moqLeadTitle: 'MOQ / 交期（占位，可编辑）',
      moqLeadItems: [
        {label: '常规MOQ', value: '按款式与面料评估'},
        {label: '样品周期', value: '占位：7-14天'},
        {label: '大货交期', value: '占位：20-45天'}
      ]
    },
    quality: {
      title: '质量与合规',
      intro: '质量管理围绕关键工序设置检查点，确保订单执行一致性。',
      checkpoints: [
        {stage: '来料检验', details: '核对面辅料规格、色差与基础物性要求。'},
        {stage: '在线检验', details: '关键工序抽检，记录工艺偏差并及时纠正。'},
        {stage: '尾检与包装检验', details: '出货前按项目标准执行成品与包装检查。'}
      ],
      certificationTitle: '认证信息清单（示意）',
      certifications: [
        {name: '质量体系相关文件', status: '可按需提供 / available upon request'},
        {name: '社会责任相关文件', status: '推进中 / working towards'},
        {name: '客户指定审核', status: '按项目安排'}
      ],
      disclaimer: '不作未核实的认证承诺，具体以双方确认资料为准。'
    },
    about: {
      title: '关于我们',
      paragraphs: [
        '本工厂长期从事服装加工及相关业务，服务于B2B服装供应链场景。',
        '我们重视样衣确认、工艺执行与批量交付的协同效率，支持品牌客户的稳定补货与新品导入。'
      ],
      scopeNote: '经营范围以营业执照登记信息为准。'
    },
    products: {
      title: '产品中心',
      subtitle: '以下为可编辑示例分类，用于展示可承接的产品方向。',
      allFilter: '全部分类',
      categories: [
        {
          id: 'tshirts',
          label: 'T恤/针织上衣',
          description: '基础款与功能款针织类服装。',
          image: '/products/tshirt-placeholder.svg',
          materials: '棉、涤棉、功能针织面料（占位）',
          moq: '占位：按款式评估',
          leadTime: '占位：20-40天',
          customization: '印花、绣花、辅料定制（占位）'
        },
        {
          id: 'hoodies',
          label: '卫衣/外套',
          description: '抓绒、毛圈、梭织拼接类产品。',
          image: '/products/hoodie-placeholder.svg',
          materials: '毛圈布、抓绒、针梭织复合（占位）',
          moq: '占位：按工艺评估',
          leadTime: '占位：25-45天',
          customization: '贴布绣、拉链、包装方案（占位）'
        },
        {
          id: 'uniforms',
          label: '工装/校服',
          description: '团体订单与配套组合款。',
          image: '/products/uniform-placeholder.svg',
          materials: '耐磨梭织与功能面料（占位）',
          moq: '占位：按项目评估',
          leadTime: '占位：30-50天',
          customization: '尺码段、标识、成套包装（占位）'
        }
      ]
    },
    faq: {
      title: '常见问题',
      items: [
        {q: 'MOQ如何计算？', a: 'MOQ依据款式复杂度、面料与配色数量评估，可在询盘后提供建议区间。'},
        {q: '打样时间多久？', a: '样品周期通常为占位7-14天，具体取决于面辅料到位与工艺难度。'},
        {q: '大货交期如何安排？', a: '大货交期通常为占位20-45天，旺季需提前锁定排期。'},
        {q: '付款方式如何约定？', a: '付款条款可按项目风险与订单规模进行双方约定。'},
        {q: '支持哪些运输方式？', a: '支持海运、空运及快递，贸易条款可根据订单需求协商。'}
      ]
    },
    contact: {
      title: '联系与询盘',
      subtitle: '提交RFQ后，我们将按您提供的技术资料进行评估并回复。',
      formLabels: {
        name: '姓名',
        company: '公司名称',
        email: '邮箱',
        whatsappWechat: 'WhatsApp / 微信',
        productType: '产品类型',
        targetQuantity: '目标数量',
        targetPrice: '目标价格（可选）',
        deliveryDate: '目标交期',
        techPack: '技术包附件（可选）',
        message: '需求说明'
      },
      placeholders: {
        productType: '如：针织T恤、工装夹克',
        targetQuantity: '如：5000件',
        targetPrice: '如：USD 6.5/pc',
        message: '请说明面料、工艺、包装或合规要求。'
      },
      successTitle: '询盘已提交',
      successMessage: '感谢您的咨询，我们会尽快与您联系。'
    },
    legal: {
      privacyTitle: '隐私政策',
      termsTitle: '使用条款'
    }
  },
  en: {
    localeName: 'English',
    metaDescription:
      'B2B garment OEM/ODM manufacturing website for brand clients, covering sampling, bulk production, quality control and shipment support.',
    hero: {
      badge: 'Garment Manufacturing / OEM ODM',
      title: 'Reliable Bulk Garment Manufacturing for Brand Buyers',
      subtitle:
        'Built for brands, traders and sourcing teams. We support your workflow from tech pack review and sampling to bulk production and shipment preparation.',
      bullets: ['Lead time (placeholder): 20-45 days', 'QC system (placeholder): 3 checkpoints', 'Monthly capacity (placeholder): configurable by category']
    },
    factoryAtGlance: {
      title: 'Factory At A Glance',
      description: 'Core garment processing with support for development, material coordination, production and delivery prep.',
      stats: [
        {label: 'Business Model', value: 'OEM / ODM', note: 'Driven by tech pack and sample approval'},
        {label: 'Client Type', value: 'B2B', note: 'Brands, traders, sourcing companies'},
        {label: 'Scope', value: 'Garment + related products', note: 'Per official business license scope'}
      ]
    },
    whyUs: {
      title: 'Why Work With Us',
      items: [
        {title: 'Clear Communication', description: 'Project execution based on tech pack details and confirmed sample comments.'},
        {title: 'Transparent Process', description: 'Each stage from inquiry to shipment can be reviewed and tracked.'},
        {title: 'Custom Support', description: 'Material, printing/embroidery, labeling and packaging options are supported.'}
      ]
    },
    trustBlocks: [
      {title: 'Factory overview', text: 'Overview of setup and collaboration model (placeholder content, editable).'},
      {title: 'Quality control', text: 'Incoming, inline and final inspection checkpoints (editable placeholders).'},
      {title: 'Compliance', text: 'Project-related documentation can be provided based on buyer requirements.'},
      {title: 'Clients served', text: 'Client types: brands / trading firms / channel buyers (no fake logos).'}
    ],
    capabilities: {
      introTitle: 'Capabilities & Service Modules',
      introText: 'OEM/ODM support aligned with technical documentation, sample approvals and bulk execution.',
      items: [
        {title: 'OEM/ODM', text: 'Manufacturing based on your design, with optional process optimization support.'},
        {title: 'Sampling', text: 'Sample making, fit adjustment and workmanship confirmation.'},
        {title: 'Pattern Making', text: 'Pattern development, grading and process-sheet collaboration.'},
        {title: 'Fabric Sourcing', text: 'Material coordination based on project requirements.'},
        {title: 'Printing/Embroidery', text: 'Standard process routes, finalized after sample confirmation.'},
        {title: 'Packaging', text: 'Main label, care label, hangtag and export carton support.'}
      ],
      timelineTitle: 'Production Flow',
      timeline: ['Inquiry', 'Tech Pack Review', 'Sample', 'Bulk', 'QC', 'Shipping'],
      equipmentTitle: 'Equipment & Capacity (placeholders, editable)',
      equipmentTable: [
        {item: 'Lockstitch Machines', placeholderSpec: 'Placeholder qty', note: 'Replace with real data'},
        {item: 'Overlock Machines', placeholderSpec: 'Placeholder qty', note: 'Replace with real data'},
        {item: 'Finishing Equipment', placeholderSpec: 'Placeholder qty', note: 'Replace with real data'}
      ],
      moqLeadTitle: 'MOQ / Lead Time (placeholders, editable)',
      moqLeadItems: [
        {label: 'Standard MOQ', value: 'Evaluated by style and material'},
        {label: 'Sampling Time', value: 'Placeholder: 7-14 days'},
        {label: 'Bulk Lead Time', value: 'Placeholder: 20-45 days'}
      ]
    },
    quality: {
      title: 'Quality & Compliance',
      intro: 'QC management focuses on key checkpoints across the full order process.',
      checkpoints: [
        {stage: 'Incoming Inspection', details: 'Check fabric/trims specification, shade and basic physical criteria.'},
        {stage: 'Inline Inspection', details: 'Inspect critical operations and correct deviations in process.'},
        {stage: 'Final Inspection', details: 'Conduct finished-goods and packing checks before shipment.'}
      ],
      certificationTitle: 'Certification Checklist (UI sample)',
      certifications: [
        {name: 'Quality-system documents', status: 'available upon request'},
        {name: 'Social compliance documents', status: 'working towards'},
        {name: 'Buyer-specific audits', status: 'project-based arrangement'}
      ],
      disclaimer: 'No unverified certification claims are made. Final status is subject to confirmed documents.'
    },
    about: {
      title: 'About Us',
      paragraphs: [
        'The factory has long been engaged in garment processing and related business activities for B2B supply-chain needs.',
        'We focus on sample alignment, process execution and stable bulk delivery for recurring and new product programs.'
      ],
      scopeNote: 'Business scope is subject to official business license registration.'
    },
    products: {
      title: 'Products',
      subtitle: 'Editable sample categories for presenting product directions you can manufacture.',
      allFilter: 'All Categories',
      categories: [
        {
          id: 'tshirts',
          label: 'T-Shirts / Knit Tops',
          description: 'Basic and functional knit garments.',
          image: '/products/tshirt-placeholder.svg',
          materials: 'Cotton, CVC, functional knits (placeholder)',
          moq: 'Placeholder: style-based evaluation',
          leadTime: 'Placeholder: 20-40 days',
          customization: 'Printing, embroidery, trims (placeholder)'
        },
        {
          id: 'hoodies',
          label: 'Hoodies / Outerwear',
          description: 'Fleece, terry and mixed constructions.',
          image: '/products/hoodie-placeholder.svg',
          materials: 'French terry, fleece, knit-woven combinations (placeholder)',
          moq: 'Placeholder: process-based evaluation',
          leadTime: 'Placeholder: 25-45 days',
          customization: 'Applique, zipper options, packaging (placeholder)'
        },
        {
          id: 'uniforms',
          label: 'Uniforms / Groupwear',
          description: 'Program orders and coordinated sets.',
          image: '/products/uniform-placeholder.svg',
          materials: 'Durable woven and functional fabrics (placeholder)',
          moq: 'Placeholder: project-based evaluation',
          leadTime: 'Placeholder: 30-50 days',
          customization: 'Size range, branding, bundled packing (placeholder)'
        }
      ]
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          q: 'How is MOQ calculated?',
          a: 'MOQ depends on style complexity, material setup and color count. We provide a practical range after RFQ review.'
        },
        {
          q: 'How long is sampling?',
          a: 'Sampling is typically placeholder 7-14 days, depending on trim readiness and workmanship complexity.'
        },
        {
          q: 'How long is bulk lead time?',
          a: 'Bulk lead time is typically placeholder 20-45 days and should be reserved earlier during peak season.'
        },
        {
          q: 'What payment terms are possible?',
          a: 'Payment terms are aligned per project risk profile and order scale by mutual agreement.'
        },
        {
          q: 'What shipping terms do you support?',
          a: 'Sea, air and express options are available. Trade terms are discussed per order requirement.'
        }
      ]
    },
    contact: {
      title: 'Contact / RFQ',
      subtitle: 'Submit your inquiry with technical details. Our team will review and reply.',
      formLabels: {
        name: 'Name',
        company: 'Company',
        email: 'Email',
        whatsappWechat: 'WhatsApp / WeChat',
        productType: 'Product Type',
        targetQuantity: 'Target Quantity',
        targetPrice: 'Target Price (optional)',
        deliveryDate: 'Target Delivery Date',
        techPack: 'Attach Tech Pack (optional)',
        message: 'Message'
      },
      placeholders: {
        productType: 'e.g. Knit T-shirt, workwear jacket',
        targetQuantity: 'e.g. 5000 pcs',
        targetPrice: 'e.g. USD 6.5/pc',
        message: 'Share material, workmanship, packaging or compliance requirements.'
      },
      successTitle: 'RFQ submitted',
      successMessage: 'Thank you. We will contact you shortly.'
    },
    legal: {
      privacyTitle: 'Privacy Policy',
      termsTitle: 'Terms of Use'
    }
  }
};

export function getContent(locale: AppLocale) {
  return siteContent[locale];
}

export const serviceCatalog = [
  {
    slug: 'website-development',
    title: 'Website Development',
    image: '/images/services/web_dev.png',
    shortDescription: 'Professional business websites engineered for speed, trust, and measurable conversion outcomes.',
    details:
      'We design and build websites aligned with your brand identity, lead-generation goals, and long-term scalability requirements.',
    offerings: [
      {
        type: 'Static Websites',
        brief: 'Fast-loading informational websites ideal for company profiles and low-maintenance publishing.',
      },
      {
        type: 'Dynamic Websites',
        brief: 'Database-driven websites with dashboards, CMS modules, secure access control, and operational flexibility.',
      },
      {
        type: 'Landing Pages',
        brief: 'High-conversion campaign pages optimized for paid traffic and lead capture.',
      },
      {
        type: 'E-commerce Websites',
        brief: 'Scalable online storefronts with catalog, payment integrations, and streamlined order management workflows.',
      },
    ],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    image: '/images/services/app_dev.png',
    shortDescription: 'Secure, scalable mobile applications for Android and iOS with high-quality user experience.',
    details:
      'Our team delivers production-ready mobile products with intuitive UX, robust integrations, and maintainable architecture.',
    offerings: [
      {
        type: 'Android Applications',
        brief: 'Native and hybrid Android apps with optimized performance for diverse device ranges.',
      },
      {
        type: 'iOS Applications',
        brief: 'Secure iOS apps with polished user experience and App Store deployment support.',
      },
      {
        type: 'Cross-Platform Apps',
        brief: 'Single-codebase applications for Android and iOS that accelerate release timelines without sacrificing quality.',
      },
      {
        type: 'App Modernization',
        brief: 'Legacy app redesign, performance tuning, and feature expansion for growth-stage products.',
      },
    ],
  },
  {
    slug: 'software-development',
    title: 'Custom Software Development',
    image: '/images/services/software_dev.png',
    shortDescription: 'Tailored business software to streamline operations, improve visibility, and scale core workflows.',
    details:
      'We build bespoke software systems for internal teams, customer portals, and mission-critical operational environments.',
    offerings: [
      {
        type: 'ERP & Workflow Systems',
        brief: 'Process-centric systems to streamline approvals, reporting, and cross-functional visibility.',
      },
      {
        type: 'SaaS Platforms',
        brief: 'Scalable SaaS products with subscription workflows, user lifecycle management, and product analytics.',
      },
      {
        type: 'CRM Solutions',
        brief: 'Customer lifecycle management software tailored to sales and support operations.',
      },
      {
        type: 'Internal Tools',
        brief: 'Department-specific systems for inventory, HR, finance, and operational automation.',
      },
    ],
  },
  {
    slug: 'cloud-devops-data',
    title: 'Cloud, DevOps & Data Services',
    image: '/images/services/cloud_devops.png',
    shortDescription: 'Cloud and data engineering services for secure, scalable, and operationally resilient platforms.',
    details:
      'We modernize deployment and data ecosystems to strengthen reliability, observability, governance, and decision velocity.',
    offerings: [
      {
        type: 'Cloud Migration',
        brief: 'Planned migration from on-premise systems to cloud-native infrastructure.',
      },
      {
        type: 'DevOps Enablement',
        brief: 'CI/CD pipelines, release automation, and observability standards for predictable engineering delivery.',
      },
      {
        type: 'Data Dashboards',
        brief: 'Unified KPI dashboards and reporting layers for business intelligence.',
      },
      {
        type: 'AI Workflow Integration',
        brief: 'Practical AI integrations for search, support automation, and insight generation.',
      },
    ],
  },
  {
    slug: 'ai-data-solutions',
    title: 'AI & Data Solutions',
    image: '/images/services/ai_data.png',
    shortDescription: 'Practical AI and analytics solutions that improve decision quality and operational efficiency.',
    details: 'We apply machine learning and modern data engineering to deliver actionable insights, smart automation, and intelligent product capabilities.',
    offerings: [
      {
        type: 'Machine Learning Models',
        brief: 'Custom ML pipelines and predictive algorithms for business use cases.',
      },
      {
        type: 'Generative AI Integration',
        brief: 'LLM-based implementations for assistants, workflow copilots, and intelligent knowledge experiences.',
      },
      {
        type: 'Business Intelligence',
        brief: 'Interactive KPI dashboards with real-time analytics and reporting.',
      },
      {
        type: 'Data Engineering',
        brief: 'Scalable ETL pipelines, curated datasets, and analytics-ready data warehouse architecture.',
      },
    ],
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    image: '/images/services/business_auto.png',
    shortDescription: 'Operational automation services that connect systems, reduce manual effort, and improve execution speed.',
    details: 'We connect your tools and automate repetitive tasks using secure integrations, workflow engines, and scalable background processing.',
    offerings: [
      {
        type: 'API Development & Integrations',
        brief: 'Connect diverse software platforms securely and seamlessly.',
      },
      {
        type: 'Workflow Automation',
        brief: 'Automation workflows with Make, Zapier, and custom logic tailored to your operational processes.',
      },
      {
        type: 'Robotic Process Automation',
        brief: 'RPA bots to execute repetitive data handling, migration, and back-office process tasks.',
      },
      {
        type: 'Document Processing Automation',
        brief: 'AI OCR systems to read, parse, and store complex document data instantly.',
      },
    ],
  },
  {
    slug: 'social-media-handling',
    title: 'Social Media Handling',
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Comprehensive social media operations for brand visibility, audience growth, and campaign performance.',
    details: 'We manage your social media presence end-to-end, including channel strategy, content operations, platform engagement, and performance optimization.',
    offerings: [
      {
        type: 'YouTube Channel Management',
        brief: 'End-to-end YouTube handling — thumbnails, SEO titles, scheduling, and analytics growth.',
      },
      {
        type: 'Instagram & Facebook Handling',
        brief: 'Consistent visual branding, reels, stories, and active community engagement across Meta platforms.',
      },
      {
        type: 'X (Twitter) & LinkedIn',
        brief: 'Thought leadership posts, thread strategies, and professional brand presence on X and LinkedIn.',
      },
      {
        type: 'Paid Ad Campaigns',
        brief: 'Targeted advertising across YouTube, Instagram, and Facebook optimized for qualified reach and ROI.',
      },
    ],
  },
]

export function getServiceBySlug(slug = '') {
  return serviceCatalog.find((service) => service.slug === slug)
}

export const serviceCatalog = [
  {
    slug: 'website-development',
    title: 'Website Development',
    image: '/svc_web.png',
    shortDescription: 'Business-ready websites engineered for performance, security, and conversion.',
    details:
      'We design and build websites aligned with your branding, lead generation goals, and scalability requirements.',
    offerings: [
      {
        type: 'Static Websites',
        brief: 'Fast-loading informational websites ideal for company profiles and low-maintenance publishing.',
      },
      {
        type: 'Dynamic Websites',
        brief: 'Database-driven websites with dashboards, CMS modules, and secure role-based access.',
      },
      {
        type: 'Landing Pages',
        brief: 'High-conversion campaign pages optimized for paid traffic and lead capture.',
      },
      {
        type: 'E-commerce Websites',
        brief: 'Online storefronts with product catalog, payment integrations, and order management workflows.',
      },
    ],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    image: '/svc_mobile.png',
    shortDescription: 'Cross-platform and native mobile applications for Android and iOS ecosystems.',
    details:
      'Our team develops robust mobile products with intuitive UX, API integrations, and release-ready architecture.',
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
        brief: 'Single codebase mobile apps for Android and iOS to accelerate launch timelines.',
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
    image: '/svc_software.png',
    shortDescription: 'Tailored business software for operations, automation, and enterprise workflows.',
    details:
      'We build bespoke software systems for internal teams, customer portals, and operational control centers.',
    offerings: [
      {
        type: 'ERP & Workflow Systems',
        brief: 'Process-centric systems to streamline approvals, reporting, and cross-functional visibility.',
      },
      {
        type: 'SaaS Platforms',
        brief: 'Scalable software products with subscription flows, user management, and analytics.',
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
    image: '/svc_cloud.png',
    shortDescription: 'Infrastructure and data engineering for secure, scalable digital platforms.',
    details:
      'We modernize deployment and data ecosystems to improve reliability, observability, and decision velocity.',
    offerings: [
      {
        type: 'Cloud Migration',
        brief: 'Planned migration from on-premise systems to cloud-native infrastructure.',
      },
      {
        type: 'DevOps Enablement',
        brief: 'CI/CD pipelines, release automation, and observability for predictable delivery.',
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
    image: '/svc_ai.png',
    shortDescription: 'Advanced machine learning, predictive analytics, and data-driven business intelligence.',
    details: 'We build intelligent systems that turn complex data into actionable insights through custom ML models and reporting dashboards.',
    offerings: [
      {
        type: 'Machine Learning Models',
        brief: 'Custom AI models for classification, regression, and pattern recognition tailored to business data.',
      },
      {
        type: 'Data Warehousing',
        brief: 'Scalable data storage and ETL pipelines designed for high-velocity information processing.',
      },
      {
        type: 'Business Intelligence',
        brief: 'Unified KPI dashboards providing real-time visibility into operational performance and growth metrics.',
      },
      {
        type: 'Predictive Analytics',
        brief: 'Forecasting systems to anticipate market trends, user behavior, and resource requirements.',
      },
    ],
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    image: '/svc_automation.png',
    shortDescription: 'Streamline operations with intelligent workflow automation and API integrations.',
    details: 'Our automation solutions eliminate manual bottlenecks by connecting disparate systems and optimizing repetitive tasks.',
    offerings: [
      {
        type: 'Workflow Orchestration',
        brief: 'End-to-end automation of complex business processes using modern middleware and logic apps.',
      },
      {
        type: 'API Integrations',
        brief: 'Seamlessly connecting internal software with third-party platforms for synchronized data flow.',
      },
      {
        type: 'Legacy Modernization',
        brief: 'Upgrading older systems with automation layers to improve efficiency without total replacement.',
      },
      {
        type: 'Process Optimization',
        brief: 'Technical audits and implementation of scripts to handle bulk data and repetitive operational tasks.',
      },
    ],
  },
]

export function getServiceBySlug(slug = '') {
  return serviceCatalog.find((service) => service.slug === slug)
}

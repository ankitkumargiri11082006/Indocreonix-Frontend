export const serviceCatalog = [
  {
    slug: 'website-development',
    title: 'Website Development',
    image: '/images/services/web_dev.png',
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
    image: '/images/services/app_dev.png',
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
    image: '/images/services/software_dev.png',
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
    image: '/images/services/cloud_devops.png',
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
    image: '/images/services/ai_data.png',
    shortDescription: 'Advanced machine learning, predictive analytics, and data-driven business intelligence.',
    details: 'Harness the power of Artificial Intelligence and Big Data to unlock actionable insights, automate decisions, and build intelligent products predicting market trends.',
    offerings: [
      {
        type: 'Machine Learning Models',
        brief: 'Custom ML pipelines and predictive algorithms for business use cases.',
      },
      {
        type: 'Generative AI Integration',
        brief: 'LLM implementations to power intelligent chatbots and content generation.',
      },
      {
        type: 'Business Intelligence',
        brief: 'Interactive KPI dashboards with real-time analytics and reporting.',
      },
      {
        type: 'Data Engineering',
        brief: 'Scalable ETL pipelines and data warehouses.',
      },
    ],
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    image: '/images/services/business_auto.png',
    shortDescription: 'Streamline operations with intelligent workflow automation and API integrations.',
    details: 'We connect your tools and automate repetitive tasks by building seamless API bridges, RPA bots, and robust background workers, saving thousands of manual hours.',
    offerings: [
      {
        type: 'API Development & Integrations',
        brief: 'Connect diverse software platforms securely and seamlessly.',
      },
      {
        type: 'Workflow Automation',
        brief: 'Zapier, Make, and custom coded background agents matching your logic.',
      },
      {
        type: 'Robotic Process Automation',
        brief: 'Bots created to perform repetitive data entry and migration tasks.',
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
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Comprehensive digital marketing, brand building, and engagement strategies across all platforms.',
    details: 'We manage your online presence end-to-end. From eye-catching content creation to scheduled posting and lead-generating ad campaigns.',
    offerings: [
      {
        type: 'Social Media Management',
        brief: 'Organic growth, consistent branding, and daily engagement workflows.',
      },
      {
        type: 'Paid Advertising Campaigns',
        brief: 'Targeted Facebook, Instagram, and LinkedIn ads optimizing ROI.',
      },
      {
        type: 'Content Creation',
        brief: 'High-quality graphics, reels, and copyrighting tailored to your audience.',
      },
      {
        type: 'Brand Strategy & Analytics',
        brief: 'Data-driven audience targeting and monthly performance reporting.',
      },
    ],
  },
]

export function getServiceBySlug(slug = '') {
  return serviceCatalog.find((service) => service.slug === slug)
}

export const serviceCatalog = [
  {
    slug: 'website-development',
    title: 'Website Development',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
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
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
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
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
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
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
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
]

export function getServiceBySlug(slug = '') {
  return serviceCatalog.find((service) => service.slug === slug)
}

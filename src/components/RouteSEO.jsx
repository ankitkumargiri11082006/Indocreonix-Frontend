import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from './SEO';

const ROUTE_META = {
  '/': {
    title: 'Indocreonix | Software, Web, App & AI Solutions',
    description:
      'Indocreonix helps businesses grow with web development, mobile apps, custom software, cloud, and AI solutions.',
    keywords: ['software company', 'web development company', 'IT services India'],
  },
  '/about': {
    title: 'About Indocreonix',
    description:
      'Learn about Indocreonix, our technology expertise, and how we deliver scalable digital products for modern businesses.',
  },
  '/services': {
    title: 'Technology Services',
    description:
      'Explore Indocreonix services including web development, app development, cloud, AI, and business automation.',
  },
  '/solutions': {
    title: 'Business Solutions',
    description:
      'Discover industry-focused software and automation solutions by Indocreonix for growth-ready organizations.',
  },
  '/clients': {
    title: 'Clients & Partnerships',
    description:
      'See how businesses partner with Indocreonix to build reliable digital platforms and long-term technology success.',
  },
  '/request-quote': {
    title: 'Request a Project Quote',
    description:
      'Share your project requirements with Indocreonix and get a tailored plan for software, web, app, or cloud delivery.',
  },
  '/projects-delivered': {
    title: 'Projects Delivered',
    description:
      'Review selected project outcomes delivered by Indocreonix across software, mobile, and web engineering.',
  },
  '/careers': {
    title: 'Careers at Indocreonix',
    description:
      'Join Indocreonix and build impactful technology products with a high-performance engineering and delivery team.',
  },
  '/insights': {
    title: 'Insights & Updates',
    description:
      'Read practical insights from Indocreonix on software development, cloud engineering, product strategy, and AI.',
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    description:
      'Find answers to common questions about Indocreonix services, timelines, pricing approach, and engagement process.',
  },
  '/terms-and-conditions': {
    title: 'Terms and Conditions',
    description: 'Read Indocreonix terms and conditions for using our website and services.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description: 'Read how Indocreonix collects, uses, and protects personal and project information.',
  },
  '/contact': {
    title: 'Contact Indocreonix',
    description:
      'Contact Indocreonix for web, app, software, cloud, and AI projects. Talk to our team and start your next build.',
  },
};

function getRoleTypeTitle(pathname) {
  if (!pathname.startsWith('/careers/apply/')) return null;
  const roleType = pathname.split('/').pop() || 'role';
  const humanRole = roleType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Apply for ${humanRole}`,
    description: `Apply for ${humanRole} opportunities at Indocreonix and grow your career in technology.`,
  };
}

function shouldNoindex(pathname) {
  if (pathname.startsWith('/admin')) return true;
  const privateRoutes = [
    '/login',
    '/forgot-password',
    '/portal',
    '/portal-forgot-password',
    '/portal/signin',
    '/portal/signup',
    '/career/dashboard',
    '/project/dashboard',
    '/career/onboarding-documents',
  ];
  return privateRoutes.some((route) => pathname === route);
}

export default function RouteSEO() {
  const { pathname } = useLocation();

  const meta = useMemo(() => {
    return (
      ROUTE_META[pathname] ||
      getRoleTypeTitle(pathname) || {
        title: 'Indocreonix',
        description:
          'Indocreonix delivers professional software, web, app, cloud, and AI engineering services.',
      }
    );
  }, [pathname]);

  const noindex = shouldNoindex(pathname) || pathname === '*';

  return <SEO {...meta} canonical={pathname} noindex={noindex} />;
}

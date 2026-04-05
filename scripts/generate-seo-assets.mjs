import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serviceCatalog } from '../src/data/serviceCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const BASE_URL = 'https://indocreonix.com';
const TODAY = new Date().toISOString().slice(0, 10);

function normalizePath(value) {
  const raw = String(value || '').trim();
  if (!raw) return '/admin';
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
  const withoutTrailingSlash = withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/g, '') : withLeadingSlash;
  return withoutTrailingSlash || '/admin';
}

const ADMIN_BASE_PATH = normalizePath(process.env.VITE_ADMIN_PATH || process.env.ADMIN_PATH || '/admin');

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/solutions', priority: '0.8', changefreq: 'monthly' },
  { path: '/clients', priority: '0.7', changefreq: 'monthly' },
  { path: '/request-quote', priority: '0.9', changefreq: 'monthly' },
  { path: '/projects-delivered', priority: '0.8', changefreq: 'monthly' },
  { path: '/careers', priority: '0.8', changefreq: 'weekly' },
  { path: '/careers/apply/job', priority: '0.6', changefreq: 'monthly' },
  { path: '/careers/apply/internship', priority: '0.6', changefreq: 'monthly' },
  { path: '/insights', priority: '0.7', changefreq: 'weekly' },
  { path: '/faq', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
];

const serviceRoutes = serviceCatalog.map((service) => ({
  path: `/services/${service.slug}`,
  priority: '0.85',
  changefreq: 'monthly',
}));

function urlNode({ path: routePath, priority, changefreq }) {
  return [
    '  <url>',
    `    <loc>${BASE_URL}${routePath}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

async function generateSitemap() {
  const routes = [...staticRoutes, ...serviceRoutes];
  const content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(urlNode),
    '</urlset>',
    '',
  ].join('\n');

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), content, 'utf8');
}

async function generateRobots() {
  const adminDisallow = ADMIN_BASE_PATH.endsWith('/') ? ADMIN_BASE_PATH : `${ADMIN_BASE_PATH}/`;
  const disallows = Array.from(
    new Set([
      '/admin/',
      adminDisallow,
      '/api/',
    ]),
  );

  const content = [
    'User-agent: *',
    'Allow: /',
    ...disallows.map((entry) => `Disallow: ${entry}`),
    '',
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  await fs.writeFile(path.join(publicDir, 'robots.txt'), content, 'utf8');
}

await generateSitemap();
await generateRobots();

console.log('SEO assets generated: public/sitemap.xml and public/robots.txt');

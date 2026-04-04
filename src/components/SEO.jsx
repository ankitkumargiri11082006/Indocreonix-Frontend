import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Indocreonix';
const SITE_URL = 'https://indocreonix.com';
const DEFAULT_OG_IMAGE = 'https://indocreonix.com/og-image.png';
const DEFAULT_KEYWORDS = [
  'Indocreonix',
  'Indocreonix Infotech',
  'software company in Delhi',
  'web development',
  'mobile app development',
  'custom software development',
  'cloud solutions',
  'AI solutions',
  'business automation',
];

function absoluteUrl(pathOrUrl = '/') {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

function dedupeKeywords(keywords) {
  return [...new Set([...(keywords || []), ...DEFAULT_KEYWORDS])].join(', ');
}

function buildTitle(title) {
  if (!title) return SITE_NAME;
  return title.toLowerCase().includes(SITE_NAME.toLowerCase()) ? title : `${title} | ${SITE_NAME}`;
}

const SEO = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
}) => {
  const fullTitle = buildTitle(title);
  const canonicalUrl = absoluteUrl(canonical || (typeof window !== 'undefined' ? window.location.pathname : '/'));
  const robots = noindex
    ? 'noindex, nofollow, noarchive, nosnippet'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const organizationId = `${SITE_URL}#organization`;
  const websiteId = `${SITE_URL}#website`;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: SITE_NAME,
    legalName: 'Indocreonix Infotech',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Indocreonix delivers software engineering, web development, app development, cloud, and AI solutions for modern businesses.',
    alternateName: ['Indocreonix Infotech', 'Indocrenix', 'Indocieonix'],
    sameAs: [
      'https://www.facebook.com/profile.php?id=61578548155863',
      'https://www.instagram.com/indocreonix/',
      'https://x.com/indocreonix',
      'https://www.linkedin.com/in/indocreonix-infotech-672a173b7/',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: SITE_NAME,
    alternateName: 'Indocreonix Infotech',
    url: SITE_URL,
    publisher: {
      '@id': organizationId,
    },
    inLanguage: 'en-IN',
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle,
    description,
    url: canonicalUrl,
    inLanguage: 'en-IN',
    about: {
      '@id': organizationId,
    },
    isPartOf: {
      '@id': websiteId,
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={dedupeKeywords(keywords)} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="geo.region" content="IN-DL" />
      <meta name="geo.placename" content="New Delhi" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteUrl(ogImage)} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteUrl(ogImage)} />
      <meta name="twitter:site" content="@indocreonix" />

      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webpageSchema)}</script>
    </Helmet>
  );
};

export default SEO;

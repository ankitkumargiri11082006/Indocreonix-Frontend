import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for dynamic meta tags
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Page keywords (optional)
 * @param {string} props.ogImage - Page Open Graph image (optional)
 * @param {string} props.canonical - Canonical URL (optional)
 * @param {boolean} props.noindex - If true, adds noindex to meta (optional, default false)
 */
const SEO = ({ 
  title, 
  description, 
  keywords = "", 
  ogImage = "https://indocreonix.com/og-image.png", 
  canonical, 
  noindex = false 
}) => {
  const siteName = "Indocreonix";
  const defaultKeywords = "web development, webdeveloipments, android social media handling, tech services, indocreonix, indocreonix.com, digital marketing, website design, android app development";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  const fullTitle = `${title} | ${siteName}`;
  const currentUrl = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical Link */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Advanced JSON-LD Schema (optional but good for SEO) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": fullTitle,
          "description": description,
          "provider": {
            "@type": "Organization",
            "name": "Indocreonix",
            "url": "https://indocreonix.com/",
            "logo": "https://indocreonix.com/logo.png"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;

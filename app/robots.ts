import { MetadataRoute } from 'next';

/**
 * Restrictive robots.txt configuration disallowing all web crawlers.
 * Note: While this discourages indexing by search engines, it does not provide access security.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}

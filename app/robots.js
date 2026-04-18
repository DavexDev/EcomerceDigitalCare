export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/cuenta/'],
      },
    ],
    sitemap: 'https://digitalcare.gt/sitemap.xml',
  };
}

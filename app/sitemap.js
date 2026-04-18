export default function sitemap() {
  const base = 'https://digitalcare.gt';
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/accesorios`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/licencias`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/cuenta/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/cuenta/registro`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}

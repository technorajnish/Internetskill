export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // 🔒 एडमिन पैनल और API को Google से छुपाना
    },
    sitemap: 'https://internetskill.in/sitemap.xml',
  }
}
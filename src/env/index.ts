export const env = {
  google: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    siteKey: import.meta.env.VITE_GOOGLE_SITE_KEY,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  },
}

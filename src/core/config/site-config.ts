export const siteConfig = {
  name: "CSV Comparison Tool",
  description: "Compare and analyze Instagram CSV files with ease",
  subtitle: "Analyze and compare your Instagram follower data",
  links: {
    github: "https://github.com/remcostoeten/instagram-csv-comparer",
  },
} as const

export type SiteConfig = typeof siteConfig

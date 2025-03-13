export const siteConfig = {
  name: "Instagram Snitch'r",
  nameShort: "Snitch'r",
  namePlatform: "Instagram",
  description: "Track who unfollowed you on Instagram with ease",
  subtitle: "Find out who unfollowed you and analyze your Instagram follower data",
  links: {
    github: "https://github.com/remcostoeten/Instagram-snitchr-find-out-who-unfollowed-you",
  },
  author: "Remco Stoeten",
} as const

export type SiteConfig = typeof siteConfig

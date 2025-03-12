export const siteConfig = {
  name: "Instagram Snitch'r",
  description: "Track who unfollowed you on Instagram with style",
  subtitle: "Find out who unfollowed you and analyze your Instagram follower data",
  links: {
    github: "https://github.com/remcostoeten/Instagram-snitchr-find-out-who-unfollowed-you",
  },
} as const

export type SiteConfig = typeof siteConfig

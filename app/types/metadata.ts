// app/types/metadata.ts

export const siteConfig = {
    name: 'Betta-MD',
    description: 'Aquarium Management System',
    url: 'https://your-domain.com',
    ogImage: 'https://your-domain.com/og.jpg',
    links: {
      twitter: 'https://twitter.com/yourusername',
      github: 'https://github.com/yourusername/betta-md',
    },
  } as const;
  
  export type SiteConfig = typeof siteConfig;
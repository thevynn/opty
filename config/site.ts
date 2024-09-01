import { type LucideIconName } from '@/lib/lucide-icon'

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconName
  description: string
}

export const siteConfig: SiteConfig = {
  name: 'OpenTypo™',
  title: 'OpenTypo™: Free, but Better.',
  description: 'Free, But Better Quality Fonts for Commercial Uses.',
  symbol: 'Activity', // LucideIcon
}

export interface PricingPlan {
  name: string
  post: number
}

export const pricingPlans: PricingPlan[] = [
  { name: 'free', post: 3 },
  { name: 'basic', post: -1 },
  { name: 'standard', post: -1 },
  { name: 'premium', post: -1 },
]

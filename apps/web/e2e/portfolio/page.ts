import type { Locator, Page } from '@playwright/test'

export default class PortfolioPage {
  readonly assetsSection: Locator
  readonly stakingSection: Locator

  constructor(private readonly page: Page) {
    this.assetsSection = page.getByTestId('assets')
    this.stakingSection = page.locator('#staking')
  }

  async goto() {
    await this.page.goto('/portfolio')
  }
}

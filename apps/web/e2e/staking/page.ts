import type { Page } from '@playwright/test'

export default class StakingPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/staking')
  }

  async openPoolSelectors() {
    await this.page.getByRole('button', { name: 'Show pool detail' }).click()
    await this.page.getByRole('button', { name: 'Pick a different pool' }).click()
  }
}

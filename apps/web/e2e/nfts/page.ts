import type { Locator, Page } from '@playwright/test'

export default class NftsPage {
  readonly title: Locator
  readonly panelSection: Locator

  constructor(private readonly page: Page) {
    this.title = page.locator('h1')
    this.panelSection = page.locator('.panel-section')
  }

  async goto() {
    await this.page.goto('/collectibles')
  }
}

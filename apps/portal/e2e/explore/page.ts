import type { Locator, Page } from '@playwright/test'

export default class ExplorePage {
  readonly title: Locator

  constructor(private readonly page: Page) {
    this.title = page.locator('h1')
  }

  async goto() {
    await this.page.goto('/explore')
  }
}

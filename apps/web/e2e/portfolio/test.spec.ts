import { expect, test } from '@playwright/test'

import PortfolioPage from './page'

test('should show correct messages when no wallet is connected', async ({ page }) => {
  const portfolio = new PortfolioPage(page)

  await portfolio.goto()

  await expect(portfolio.assetsSection.locator('p')).toHaveText([
    "Hmm... It doesn't look like you have a wallet connected.",
    'Please download or connect your wallet, we recommend the Talisman Wallet Extension.',
  ])
})

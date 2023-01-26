import { expect, test } from '@playwright/test'

import NftsPage from './page'

test.describe('nfts', () => {
  let nfts: NftsPage

  test.beforeEach(async ({ page }) => {
    nfts = new NftsPage(page)
    await nfts.goto()
  })

  test('should have correct page with title', async () => {
    await expect(nfts.title).toHaveText(/nfts/i)
  })

  test('should show correct messages when no wallet is connected', async () => {
    await expect(nfts.panelSection.locator('p')).toHaveText([
      "Hmm... It doesn't look like you have a wallet connected.",
      'Please download or connect your wallet, we recommend the Talisman Wallet Extension. ',
    ])
  })
})

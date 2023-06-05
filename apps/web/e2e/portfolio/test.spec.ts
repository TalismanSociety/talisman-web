import { test } from '@playwright/test'
import { wallet1, wallet2 } from '../fixtures/data.json'
import PortfolioPage from './page'

test('add watched account', async ({ page }) => {
  const portfolio = new PortfolioPage(page)
  await test.step('go to portfolio page', async () => {
      await portfolio.goto()
  })
  await test.step('add watched account from portfolio main view (default view when no watched account exists)', async () => {
      await portfolio.addWatchedAccountFromMain(wallet1)
  })
  await test.step('verify wallet address is added to watched accounts', async () => {
      await portfolio.spanAddress(wallet1).click()
      await portfolio.divAddress(wallet1).waitFor()
  })
  await test.step('add watched account from account selection drop down menu', async () => {
      await portfolio.addWatchedAccountFromMenu(wallet2)
  })
  await test.step('verify wallet address is added to watched accounts', async () => {
      await portfolio.divAddress(wallet2).waitFor()
  })
})
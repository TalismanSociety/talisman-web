import { expect, test } from '@playwright/test'

test('should redirect to staking page', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/.*\/staking/)
})

test('should redirect invalid link to portfolio page', async ({ page }) => {
  await page.goto('/definitely-not-a-valid-link')

  await expect(page).toHaveURL(/.*\/staking/)
})

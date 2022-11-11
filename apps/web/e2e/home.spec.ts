import { expect, test } from '@playwright/test'

test('should redirect to portfolio page', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/.*\/portfolio/)
})

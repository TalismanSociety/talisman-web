import { expect, test } from '@playwright/test'

import ExplorePage from './page'

test('should contains correct tags', async ({ page }) => {
  const explore = new ExplorePage(page)

  await explore.goto()

  await expect(explore.title).toHaveText(/explore/i)
})

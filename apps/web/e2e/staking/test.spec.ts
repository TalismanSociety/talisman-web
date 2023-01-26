import { expect, test } from '@playwright/test'

import StakingPage from './page'

test('should show pool selectors', async ({ page }) => {
  const staking = new StakingPage(page)

  await staking.goto()

  await staking.openPoolSelectors()

  // eslint-disable-next-line testing-library/prefer-screen-queries
  await expect(page.getByRole('heading', { name: 'Select a pool' })).toBeVisible()
})

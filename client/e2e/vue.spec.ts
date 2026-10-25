import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('switches the portfolio between English and French URLs', async ({ page }) => {
  await page.goto('/fr')

  await expect(page).toHaveURL(/\/fr$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.getByText('Projets récents')).toBeVisible()

  await page.getByRole('button', { name: 'Switch to English' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByText('Recent Projects')).toBeVisible()
})

import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('loads the dashboard by default', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('h2')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Overview' })).toHaveClass(/active/)
  })

  test('nav links route to correct pages', async ({ page }) => {
    await page.goto('/')

    const routes = [
      { link: 'Inventory', url: '/inventory' },
      { link: 'Orders', url: '/orders' },
      { link: 'Finance', url: '/spending' },
      { link: 'Reports', url: '/reports' },
      { link: 'Restocking', url: '/restocking' }
    ]

    for (const { link, url } of routes) {
      await page.getByRole('link', { name: link }).click()
      await expect(page).toHaveURL(url)
    }
  })

  test('active nav link is highlighted', async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.getByRole('link', { name: 'Inventory' })).toHaveClass(/active/)
  })
})

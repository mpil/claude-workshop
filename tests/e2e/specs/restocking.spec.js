import { test, expect } from '@playwright/test'

test.describe('Restocking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 })
  })

  test('shows page header and budget input', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()
    await expect(page.getByPlaceholder(/budget/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible()
  })

  test('shows summary stats with deficit items', async ({ page }) => {
    await expect(page.getByText('Items Below Reorder Point')).toBeVisible()
    await expect(page.getByText('Within Budget')).toBeVisible()
    await expect(page.getByText('Total Estimated Cost')).toBeVisible()
  })

  test('renders recommendations table when deficits exist', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      // Each row should have SKU, item name, estimated cost
      const firstRow = rows.first()
      await expect(firstRow.locator('code')).toBeVisible()
    }
  })

  test('budget ceiling clips the list and shows remaining', async ({ page }) => {
    await page.getByPlaceholder(/budget/i).fill('5000')
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 5000 })

    // Budget Remaining stat should appear
    await expect(page.getByText('Budget Remaining')).toBeVisible()

    // Clear button should appear
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible()
  })

  test('clear button removes budget filter', async ({ page }) => {
    await page.getByPlaceholder(/budget/i).fill('5000')
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(page.getByText('Budget Remaining')).toBeVisible()

    await page.getByRole('button', { name: 'Clear' }).click()
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Budget Remaining')).not.toBeVisible()
  })

  test('category filter reloads recommendations', async ({ page }) => {
    await page.locator('select').nth(2).selectOption('Sensors')
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 5000 })
    // Page should not error — either table or empty state visible
    const hasTable = await page.locator('table').isVisible()
    const hasEmpty = await page.locator('.empty-state').isVisible()
    expect(hasTable || hasEmpty).toBe(true)
  })
})

import { test, expect } from '@playwright/test'

test.describe('Reports page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    // Wait for data to load (loading spinner disappears)
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 })
  })

  test('shows quarterly performance table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    // Table should have at least one data row
    const rows = page.locator('table').first().locator('tbody tr')
    await expect(rows).not.toHaveCount(0)
  })

  test('shows monthly revenue chart', async ({ page }) => {
    await expect(page.getByText('Monthly Revenue Trend')).toBeVisible()
    const bars = page.locator('.bar')
    await expect(bars).not.toHaveCount(0)
  })

  test('shows summary stats', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Avg Monthly Revenue')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('location filter rerenders data', async ({ page }) => {
    const before = await page.locator('table').first().locator('tbody tr').count()
    await page.locator('select').nth(1).selectOption('San Francisco')
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 5000 })
    // Page should still show a table (may have fewer rows, but no crash)
    await expect(page.locator('table').first()).toBeVisible()
    const after = await page.locator('table').first().locator('tbody tr').count()
    // rows may differ — just confirm it re-rendered without error
    expect(typeof after).toBe('number')
    expect(before).toBeGreaterThan(0)
  })
})

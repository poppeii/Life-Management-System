import { expect, test } from '@playwright/test';

test.describe('LifeOS core flows', () => {
  test('register/login flow renders', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'สร้างบัญชี LifeOS' })).toBeVisible();
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'เข้าสู่ LifeOS' })).toBeVisible();
  });

  test('protected pages exist for goals, habits, tasks, and journal', async ({ page }) => {
    await page.goto('/goals');
    await expect(page).toHaveURL(/login/);
    await page.goto('/habits');
    await expect(page).toHaveURL(/login/);
    await page.goto('/tasks');
    await expect(page).toHaveURL(/login/);
    await page.goto('/journal');
    await expect(page).toHaveURL(/login/);
  });
});

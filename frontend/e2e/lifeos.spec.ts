import { expect, test } from '@playwright/test';

test.describe('LifeOS core flows', () => {
  test('register/login flow renders', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'สร้างบัญชี LifeOS' })).toBeVisible();
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'เข้าสู่ LifeOS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ลืมรหัสผ่าน?' })).toBeVisible();
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: 'ลืมรหัสผ่าน' })).toBeVisible();
    await page.goto('/reset-password?token=test-token');
    await expect(page.getByRole('heading', { name: 'ตั้งรหัสผ่านใหม่' })).toBeVisible();
  });

  test('register password validation shows every password requirement', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('ชื่อ').fill('Test User');
    await page.getByLabel('อีเมล').fill('test@example.com');
    await page.getByRole('button', { name: 'สมัครสมาชิก' }).click();

    const form = page.getByRole('main');
    await expect(form.getByText('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')).toBeVisible();
    await expect(form.getByText('รหัสผ่านต้องมีตัวพิมพ์ใหญ่ A-Z')).toBeVisible();
    await expect(form.getByText('รหัสผ่านต้องมีตัวพิมพ์เล็ก a-z')).toBeVisible();
    await expect(form.getByText('รหัสผ่านต้องมีตัวเลข 0-9')).toBeVisible();
    await expect(form.getByText('รหัสผ่านต้องมีอักขระพิเศษ เช่น ! @ # $ %')).toBeVisible();
  });

  test('protected pages exist for goals, habits, tasks, and journal', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('lifeos-auth'));
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

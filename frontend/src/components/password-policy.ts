export const passwordRequirements = [
  {
    message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
    test: (value: string) => value.length >= 8
  },
  {
    message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่ A-Z',
    test: (value: string) => /[A-Z]/.test(value)
  },
  {
    message: 'รหัสผ่านต้องมีตัวพิมพ์เล็ก a-z',
    test: (value: string) => /[a-z]/.test(value)
  },
  {
    message: 'รหัสผ่านต้องมีตัวเลข 0-9',
    test: (value: string) => /[0-9]/.test(value)
  },
  {
    message: 'รหัสผ่านต้องมีอักขระพิเศษ เช่น ! @ # $ %',
    test: (value: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value)
  }
];

export function passwordIssues(value = '') {
  return passwordRequirements.filter((requirement) => !requirement.test(value)).map((requirement) => requirement.message);
}

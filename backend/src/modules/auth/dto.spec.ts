import { validateSync } from 'class-validator';
import { RegisterDto } from './dto';

function buildDto(password: string) {
  const dto = new RegisterDto();
  dto.name = 'Pat';
  dto.email = 'pat@test.dev';
  dto.password = password;
  return dto;
}

describe('RegisterDto password policy', () => {
  it.each([
    ['short passwords', 'Aa1!aaa', 'Password must be at least 8 characters'],
    ['passwords without uppercase letters', 'password1!', 'Password must include an uppercase letter'],
    ['passwords without lowercase letters', 'PASSWORD1!', 'Password must include a lowercase letter'],
    ['passwords without numbers', 'Password!', 'Password must include a number'],
    ['passwords without special characters', 'Password1', 'Password must include a special character']
  ])('rejects %s', (_case, password, message) => {
    const errors = validateSync(buildDto(password));

    expect(errors.flatMap((error) => Object.values(error.constraints ?? {}))).toContain(message);
  });

  it('accepts passwords that satisfy every rule', () => {
    expect(validateSync(buildDto('Password1!'))).toHaveLength(0);
  });
});

import { PasswordHasherMiddleware } from './password-hasher.middleware';

describe('PasswordHasherMiddleware', () => {
  it('should be defined', () => {
    expect(new PasswordHasherMiddleware()).toBeDefined();
  });
});

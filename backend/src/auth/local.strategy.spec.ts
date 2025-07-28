/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('wrong@example.com', 'badpass')).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith('wrong@example.com', 'badpass');
    });
  });
});

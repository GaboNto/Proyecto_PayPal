import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CardService', () => {
  let service: CardService;
  let mockCardRepo: { findOne: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    mockCardRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockCardRepo,
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should toggle is_blocked if user is owner', async () => {
    const cardMock = {
      id: '123',
      is_blocked: false,
      cuenta: { usuario: { id_usuario: 1 } },
    };

    mockCardRepo.findOne.mockResolvedValue(cardMock);
    mockCardRepo.save.mockResolvedValue({ ...cardMock, is_blocked: true });

    const result = await service.toggleBlock('123', { sub: 1 });
    expect(result.is_blocked).toBe(true);
    expect(mockCardRepo.findOne).toHaveBeenCalled();
    expect(mockCardRepo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if card not found', async () => {
    mockCardRepo.findOne.mockResolvedValue(null);
    await expect(service.toggleBlock('invalid', { sub: 1 })).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not the owner', async () => {
    mockCardRepo.findOne.mockResolvedValue({
      id: '123',
      is_blocked: false,
      cuenta: { usuario: { id_usuario: 99 } },
    });

    await expect(service.toggleBlock('123', { sub: 1 })).rejects.toThrow(ForbiddenException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  const mockCardService = {
    toggleBlock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: mockCardService,
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call toggleBlock on service', async () => {
    const mockId = '123';
    const mockUser = { sub: 1 };
    const expectedResult = { id: '123', is_blocked: true };

    mockCardService.toggleBlock.mockResolvedValue(expectedResult);

    const result = await controller.toggleBlockStatus(mockId, { user: mockUser });

    expect(result).toEqual(expectedResult);
    expect(service.toggleBlock).toHaveBeenCalledWith(mockId, mockUser);
  });
});

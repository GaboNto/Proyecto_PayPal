/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { DestinatariosController } from './destinatarios.controller';
import { DestinatariosService } from './destinatarios.service';
import { UsersService } from '../users/users.service';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';

describe('DestinatariosController', () => {
  let controller: DestinatariosController;
  let destinatariosService: DestinatariosService;
  let usersService: UsersService;

  const mockDestService = {
    create: jest.fn(),
    findByPropietarioId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    toggleFavorito: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinatariosController],
      providers: [
        { provide: DestinatariosService, useValue: mockDestService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<DestinatariosController>(DestinatariosController);
    destinatariosService = module.get<DestinatariosService>(DestinatariosService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a destinatario', async () => {
    const dto: CreateDestinatarioDto = {
      nombre: 'Carlos',
      rut: '12345678-9',
      banco: 'Banco',
      tipo_cuenta: 'Corriente',
      numero_cuenta: '12345678',
    };
    const req = { user: { sub: 1 } };
    const user = { id_usuario: 1 };
    const expected = { id: 1, ...dto };

    mockUserService.findById.mockResolvedValue(user);
    mockDestService.create.mockResolvedValue(expected);

    const result = await controller.create(dto, req);
    expect(result).toEqual(expected);
    expect(usersService.findById).toHaveBeenCalledWith(1);
    expect(destinatariosService.create).toHaveBeenCalledWith(dto, user);
  });

  it('should get all destinatarios', async () => {
    const req = { user: { sub: 1 } };
    const expected = [{ id: 1, nombre: 'Carlos' }];
    mockDestService.findByPropietarioId.mockResolvedValue(expected);

    const result = await controller.findAll(req);
    expect(result).toEqual(expected);
  });

  it('should update a destinatario', async () => {
    const req = { user: { sub: 1 } };
    const dto: UpdateDestinatarioDto = { alias: 'nuevo' };
    const expected = { id: 1, alias: 'nuevo' };

    mockDestService.update.mockResolvedValue(expected);

    const result = await controller.update(1, dto, req);
    expect(result).toEqual(expected);
  });

  it('should delete a destinatario', async () => {
    const req = { user: { sub: 1 } };
    mockDestService.delete.mockResolvedValue(undefined);

    await expect(controller.remove(1, req)).resolves.toBeUndefined();
  });

  it('should toggle favorito', async () => {
    const req = { user: { sub: 1 } };
    const expected = { id: 1, es_favorito: true };

    mockDestService.toggleFavorito.mockResolvedValue(expected);

    const result = await controller.toggleFavorito(1, req);
    expect(result).toEqual(expected);
  });
});

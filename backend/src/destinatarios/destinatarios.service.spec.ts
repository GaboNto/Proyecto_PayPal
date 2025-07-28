/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { DestinatariosService } from './destinatarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Destinatario } from './entities/destinatario.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';

describe('DestinatariosService', () => {
  let service: DestinatariosService;
  let repo: Repository<Destinatario>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinatariosService,
        {
          provide: getRepositoryToken(Destinatario),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<DestinatariosService>(DestinatariosService);
    repo = module.get(getRepositoryToken(Destinatario));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a destinatario', async () => {
    const dto: CreateDestinatarioDto = {
      nombre: 'Carlos',
      rut: '12345678-9',
      banco: 'Banco de Chile',
      tipo_cuenta: 'Cuenta Corriente',
      numero_cuenta: '12345678',
    };
    const user = { id_usuario: 1 };
    const expected = { id: 1, ...dto, propietario: user };

    mockRepo.create.mockReturnValue(expected);
    mockRepo.save.mockResolvedValue(expected);

    const result = await service.create(dto, user as any);
    expect(result).toEqual(expected);
    expect(repo.create).toHaveBeenCalledWith({ ...dto, propietario: user });
  });

  it('should return all destinatarios by user ID', async () => {
    const expected = [{ id: 1, nombre: 'Carlos' }];
    mockRepo.find.mockResolvedValue(expected);

    const result = await service.findByPropietarioId(1);
    expect(result).toEqual(expected);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should update an existing destinatario', async () => {
    const dto: UpdateDestinatarioDto = { alias: 'Prueba' };
    const existing = { id: 1, propietario: { id_usuario: 1 } };

    mockRepo.findOne.mockResolvedValue(existing);
    mockRepo.merge.mockReturnValue({ ...existing, ...dto });
    mockRepo.save.mockResolvedValue({ ...existing, ...dto });

    const result = await service.update(1, 1, dto);
    expect(result).toEqual({ ...existing, ...dto });
  });

  it('should throw if destinatario not found on update', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.update(1, 1, {})).rejects.toThrow(NotFoundException);
  });

  it('should delete a destinatario', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 1 });
    await expect(service.delete(1, 1)).resolves.toBeUndefined();
  });

  it('should throw if destinatario not found on delete', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.delete(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('should toggle favorito', async () => {
    const dest = { id: 1, propietario: { id_usuario: 1 }, es_favorito: false };
    mockRepo.findOne.mockResolvedValue(dest);
    mockRepo.save.mockResolvedValue({ ...dest, es_favorito: true });

    const result = await service.toggleFavorito(1, 1);
    expect(result.es_favorito).toBe(true);
  });

  it('should throw if destinatario not found on toggle', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.toggleFavorito(1, 1)).rejects.toThrow(NotFoundException);
  });
});

import { Repository } from 'typeorm';
import { Destinatario } from './entities/destinatario.entity';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { User } from 'src/users/user.entity';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';
export declare class DestinatariosService {
    private destinatariosRepository;
    constructor(destinatariosRepository: Repository<Destinatario>);
    create(createDestinatarioDto: CreateDestinatarioDto, propietario: User): Promise<Destinatario>;
    findByPropietarioId(propietarioId: number): Promise<Destinatario[]>;
    update(id: number, propietarioId: number, updateDestinatarioDto: UpdateDestinatarioDto): Promise<Destinatario>;
    delete(id: number, propietarioId: number): Promise<void>;
    toggleFavorito(destinatarioId: number, propietarioId: number): Promise<Destinatario>;
}

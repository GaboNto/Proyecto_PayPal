import { DestinatariosService } from './destinatarios.service';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';
export declare class DestinatariosController {
    private readonly destinatariosService;
    private readonly usersService;
    constructor(destinatariosService: DestinatariosService, usersService: UsersService);
    create(createDestinatarioDto: CreateDestinatarioDto, req: any): Promise<import("./entities/destinatario.entity").Destinatario>;
    findAll(req: any): Promise<import("./entities/destinatario.entity").Destinatario[]>;
    update(id: number, updateDestinatarioDto: UpdateDestinatarioDto, req: any): Promise<import("./entities/destinatario.entity").Destinatario>;
    remove(id: number, req: any): Promise<void>;
    toggleFavorito(id: number, req: any): Promise<import("./entities/destinatario.entity").Destinatario>;
}

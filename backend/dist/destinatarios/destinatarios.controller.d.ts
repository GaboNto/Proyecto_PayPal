import { DestinatariosService } from './destinatarios.service';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';
export declare class DestinatariosController {
    private readonly destinatariosService;
    private readonly usersService;
    constructor(destinatariosService: DestinatariosService, usersService: UsersService);
    create(createDestinatarioDto: CreateDestinatarioDto, req: any): unknown;
    findAll(req: any): unknown;
    update(id: number, updateDestinatarioDto: UpdateDestinatarioDto, req: any): unknown;
    remove(id: number, req: any): unknown;
    toggleFavorito(id: number, req: any): unknown;
}

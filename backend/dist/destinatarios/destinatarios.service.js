"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinatariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const destinatario_entity_1 = require("./entities/destinatario.entity");
let DestinatariosService = class DestinatariosService {
    destinatariosRepository;
    constructor(destinatariosRepository) {
        this.destinatariosRepository = destinatariosRepository;
    }
    async create(createDestinatarioDto, propietario) {
        const nuevoDestinatario = this.destinatariosRepository.create({
            ...createDestinatarioDto,
            propietario,
        });
        return this.destinatariosRepository.save(nuevoDestinatario);
    }
    findByPropietarioId(propietarioId) {
        return this.destinatariosRepository.find({
            where: { propietario: { id_usuario: propietarioId } },
            order: {
                es_favorito: 'DESC',
                nombre: 'ASC',
            },
        });
    }
    async update(id, propietarioId, updateDestinatarioDto) {
        const destinatario = await this.destinatariosRepository.findOne({ where: { id, propietario: { id_usuario: propietarioId } } });
        if (!destinatario) {
            throw new common_1.NotFoundException('Destinatario no encontrado.');
        }
        this.destinatariosRepository.merge(destinatario, updateDestinatarioDto);
        return this.destinatariosRepository.save(destinatario);
    }
    async delete(id, propietarioId) {
        const result = await this.destinatariosRepository.delete({ id, propietario: { id_usuario: propietarioId } });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Destinatario no encontrado o no tienes permiso para eliminarlo.');
        }
    }
    async toggleFavorito(destinatarioId, propietarioId) {
        const destinatario = await this.destinatariosRepository.findOne({ where: { id: destinatarioId, propietario: { id_usuario: propietarioId } } });
        if (!destinatario) {
            throw new common_1.NotFoundException('Destinatario no encontrado.');
        }
        destinatario.es_favorito = !destinatario.es_favorito;
        return this.destinatariosRepository.save(destinatario);
    }
};
exports.DestinatariosService = DestinatariosService;
exports.DestinatariosService = DestinatariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(destinatario_entity_1.Destinatario)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], DestinatariosService);
//# sourceMappingURL=destinatarios.service.js.map
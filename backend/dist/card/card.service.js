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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const card_entity_1 = require("./card.entity");
const user_entity_1 = require("../users/user.entity");
let CardService = class CardService {
    cardRepository;
    userRepository;
    constructor(cardRepository, userRepository) {
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
    }
    async createCard(dto, userId) {
        const user = await this.userRepository.findOneBy({ id_usuario: Number(userId) });
        if (!user)
            throw new Error('Usuario no encontrado');
        const card = this.cardRepository.create({ ...dto, user });
        throw this.cardRepository.save(card);
    }
    async getAll() {
        return this.cardRepository.find({ relations: ['user'] });
    }
    async getByUser(userId) {
        return this.cardRepository.find({
            where: { user: { id_usuario: Number(userId) } },
            relations: ['user'],
        });
    }
    async deleteCard(id) {
        await this.cardRepository.delete(id);
    }
};
exports.CardService = CardService;
exports.CardService = CardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(card_entity_1.Card)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CardService);
//# sourceMappingURL=card.service.js.map
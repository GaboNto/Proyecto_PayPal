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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findUserProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id_usuario: userId },
            relations: ['cuentas'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User profile with ID ${userId} not found`);
        }
        return user;
    }
    findUserByEmail(email) {
        return this.usersRepository.findOne({ where: { email }, relations: ['cuentas'] });
    }
    async create(createUserDto) {
        const newUser = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(newUser);
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({
            where: { id_usuario: id },
            relations: ['cuentas'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async verifyBepass(userId, verifyBepassDto) {
        const { bepass } = verifyBepassDto;
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        if (!user.bepass) {
            throw new common_1.BadRequestException('El usuario no ha configurado una clave Be Pass.');
        }
        const isBepassValid = await bcrypt.compare(bepass, user.bepass);
        if (!isBepassValid) {
            throw new common_1.UnauthorizedException('La clave Be Pass es incorrecta.');
        }
        return { success: true };
    }
    async setBepass(userId, setBepassDto) {
        const { newBepass, confirmBepass, currentPassword } = setBepassDto;
        if (newBepass !== confirmBepass) {
            throw new common_1.BadRequestException('Las claves Be Pass no coinciden.');
        }
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new common_1.UnauthorizedException('La contraseña actual es incorrecta.');
        }
        if (user.bepass) {
            if (!setBepassDto.isChange) {
                throw new common_1.BadRequestException('Ya tienes una clave Be Pass. Solo puedes cambiarla.');
            }
        }
        else {
            if (setBepassDto.isChange) {
                throw new common_1.BadRequestException('No tienes una clave Be Pass configurada. Debes crearla primero.');
            }
        }
        const hashedBepass = await bcrypt.hash(newBepass, 10);
        user.bepass = hashedBepass;
        await this.usersRepository.save(user);
        return { message: user.bepass ? 'Clave Be Pass actualizada con éxito.' : 'Clave Be Pass creada con éxito.' };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new common_1.UnauthorizedException('La contraseña actual es incorrecta.');
        }
        if (newPassword.length < 6) {
            throw new common_1.BadRequestException('La nueva contraseña debe tener al menos 6 caracteres.');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.save(user);
        return { message: 'Contraseña actualizada correctamente.' };
    }
    async save(user) {
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map
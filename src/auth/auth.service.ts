import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {
      // 1. Encriptar la contraseña
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      // 2. Guardar el usuario
      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();
      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} ya está registrado!`)
      }
      throw new InternalServerErrorException('Algo salió mal, contacta al admin!')
    }
  }

  async login(loginDto: LoginDto) {
    /**
     * User { _isd, name, email, roles }
     * Token -> ASDASD.ASDASD.ASDASD (JWT)
     */

    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if(!user) {
      throw new UnauthorizedException('Credenciales de acceso no válidas!')
    }

    if(!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales de acceso no válidas!')
    }

    const { password:_, ...rest } = user.toJSON();
    
    return {
      user: rest,
      token: 'ABC123'
    }

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { isValidID } from '../helpers/id_validation';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    isValidID(id);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required');
    }
    const newUser = this.userRepository.create({
      login,
      password,
    });
    await this.userRepository.save(newUser);
    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: +newUser.createdAt,
      updatedAt: +newUser.updatedAt,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    isValidID(id);
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updateUserDto.newPassword;
    user.version += 1;
    await this.userRepository.save(user);
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: +user.createdAt,
      updatedAt: +user.updatedAt,
    };
  }

  async remove(id: string) {
    isValidID(id);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }
}

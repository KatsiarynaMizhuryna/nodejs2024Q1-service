import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { isValidID } from '../helpers/id_validation';
import { database } from '../database/db';

@Injectable()
export class UserService {
  //private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required');
    }

    const newUser: User = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    database.users.push(newUser);
    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  findAll(): User[] {
    return database.users;
  }

  findOne(id: string): User {
    isValidID(id);
    const user = database.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    isValidID(id);
    if (!updateUserDto.newPassword || !updateUserDto.oldPassword) {
      throw new BadRequestException(
        'Old password and New password are required',
      );
    }
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updateUserDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  remove(id: string): void {
    isValidID(id);
    const userIndex = database.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    database.users.splice(userIndex, 1);
  }
}

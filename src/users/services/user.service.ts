import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto, User } from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAllUsers() {
    return this.users;
  }

  getUserById(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User does not found');
    }
    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    if (!login || !password) {
      throw new BadRequestException('Login and password are required');
    }

    const newUser = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    console.log(newUser);
    this.users.push(newUser);

    return {
      statusCode: 201,
      data: newUser,
    };
  }
  updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): { statusCode: number; data: User } {
    const user = this.getUserById(id);

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return {
      statusCode: 200,
      data: user,
    };
  }

  deleteUser(id: string): { statusCode: number } {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(userIndex, 1);
    return {
      statusCode: 204,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePOCUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomString } from './users.utils';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    createUserDto.password = hashedPassword;
    return this.prisma.user.create({
      data: createUserDto,
    });
  }
  async createPOCUser(createPOCUserDto: CreatePOCUserDto) {
    const password = generateRandomString(8);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password', password);
    const user = {
      ...createPOCUserDto,
      password: hashedPassword,
      isPoc: true,
      isVerified: true,
    };
    return this.prisma.user.create({
      data: user,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(userId: number) {
    return this.prisma.user.findUnique({
      where: { userId },
      include: {
        organization: true,
      },
    });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }
    return this.prisma.user.update({
      where: { userId },
      data: updateUserDto,
    });
  }

  remove(userId: number) {
    return this.prisma.user.delete({
      where: { userId },
    });
  }
}

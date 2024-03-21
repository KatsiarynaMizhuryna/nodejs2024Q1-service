import { BadRequestException } from '@nestjs/common';

export const isValidID = (id: string) => {
  if (!id.match(/[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}/i)) {
    throw new BadRequestException('Invalid UUID format');
  }
};

import { Prisma } from '@prisma/client';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export async function handleDatabaseOperation<T>(
  operation: () => Promise<T>,
  customMessage?: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2000':
          throw new BadRequestException(
            customMessage || 'Input value is too long for the field.',
          );
        case 'P2002':
          throw new BadRequestException(
            customMessage ||
              `A record with this ${error.meta?.target} already exists.`,
          );
        case 'P2003':
          throw new BadRequestException(
            customMessage || 'Foreign key constraint violation.',
          );
        case 'P2004':
          throw new BadRequestException(
            customMessage || 'Required constraint violation.',
          );
        case 'P2005':
          throw new BadRequestException(
            customMessage || 'Invalid value for the specified field.',
          );
        case 'P2006':
          throw new InternalServerErrorException(
            customMessage || 'Stored value is invalid for this field.',
          );
        case 'P2011':
          throw new BadRequestException(
            customMessage || 'A required field is missing or set to null.',
          );
        case 'P2025':
          throw new NotFoundException(customMessage || 'Record not found.');
        default:
          throw new InternalServerErrorException(
            customMessage ||
              'An error occurred while performing the database operation.',
          );
      }
    }
    throw new InternalServerErrorException(
      customMessage || 'Unexpected database error.',
    );
  }
}

import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common'
import { Types } from 'mongoose'

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Не валидный формат ID')
    }

    return value
  }
}

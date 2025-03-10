import {
    PipeTransform,
    Injectable,
    HttpException,
    HttpStatus,
    ArgumentMetadata,
  } from '@nestjs/common';
  
  @Injectable()
  export class ValidParamIdPipe implements PipeTransform {
    async transform(value: string, metadata: ArgumentMetadata): Promise<number> 
    {
      if (!value || isNaN(Number(value)))
        throw new HttpException((metadata.data ? (metadata.data + ' ') : '') + 'parameter must be a number', HttpStatus.NOT_ACCEPTABLE);
      if (Number(value) < 0)
        throw new HttpException((metadata.data ? (metadata.data + ' ') : '') + 'parameter must be greater than or equal to 0', HttpStatus.NOT_ACCEPTABLE);
      return Number(value);
    }
  }
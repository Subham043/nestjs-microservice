import {
    PipeTransform,
    Injectable,
    HttpException,
    HttpStatus,
    ArgumentMetadata,
  } from '@nestjs/common';
  
  @Injectable()
  export class ValidQueryPaginatePipe implements PipeTransform {
    async transform(value: string|undefined, metadata: ArgumentMetadata): Promise<number|undefined> 
    {
      if (!value) return undefined;
      if (isNaN(Number(value)))
        throw new HttpException((metadata.data ? (metadata.data + ' ') : '') + 'parameter must be a number', HttpStatus.NOT_ACCEPTABLE);
      if (Number(value) < 0)
        throw new HttpException((metadata.data ? (metadata.data + ' ') : '') + 'parameter must be greater than or equal to 0', HttpStatus.NOT_ACCEPTABLE);
      return Number(value);
    }
  }
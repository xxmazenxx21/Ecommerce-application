
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class passwordMatchPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(metadata.type ==='body'){
 const { password, confirmpassword } = value ;
 
      if(password !== confirmpassword){
        throw new BadRequestException('password does not match');
      }
    }
    return value;
  }
}

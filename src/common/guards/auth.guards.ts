
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/DB/models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,@InjectModel(User.name) private readonly userModel:Model<UserDocument>) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
if(!authHeader || !authHeader.startsWith('Bearer '))
        throw new UnauthorizedException("authorization header is missing");

    const token = authHeader.split(' ')[1];
    
if(!token)
    throw new UnauthorizedException("token is missing");

const payload = this.jwtService.verify(token,{
    secret: process.env.ACCESS_TOKEN_SECRET
})

const user =await this.userModel.findById(payload.id);
if(!user)
    throw new UnauthorizedException("user not found");

request.user = user ; 
    return true;
  }
}
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';
import { User, UserDocument } from 'src/DB/models/user.model';

@Injectable()
export class AuthService {
constructor(@InjectModel(User.name) private readonly userModel:Model<User>){}
async SignUp(signUpDto):Promise<{mesage:string,user:UserDocument}>{

const {email,userName,password}=signUpDto; 
if(await this.userModel.findOne({email}))
    throw new ConflictException("user already exists");

  const[user] = await this.userModel.create([{email,userName,password}])||[];

  return {mesage:"user created successfully",user};

}


}

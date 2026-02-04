import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from 'src/DB/models/Brand.model';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private readonly BrandModel :Model<Brand>) {}
  async create(createBrandDto: CreateBrandDto) {
   const brand = await this.BrandModel.findOne({name : createBrandDto.name});
if(brand) 
  throw new ConflictException("brand already exists");
const newBrand = await this.BrandModel.create(createBrandDto); 
return newBrand;

  }

  async findAll() {
    const brands = await this.BrandModel.find();
    return brands;
  }

  async findOne(id: string) {
    const brand = await this.BrandModel.findById(id);
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.BrandModel.findById(id);
    if(!brand)
      throw new NotFoundException('brand not found')
   if(updateBrandDto.name) brand.name = updateBrandDto.name;
     if(updateBrandDto.image) brand.image = updateBrandDto.image
     await brand.save();
    return brand ;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}

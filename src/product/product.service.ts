import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from 'src/DB/models/Brand.model';
import { Model } from 'mongoose';
import { Category } from 'src/DB/models/category.model';
import { Product } from 'src/DB/models/product.model';

@Injectable()
export class ProductService {
  
  constructor(@InjectModel(Brand.name) private readonly brandModel:Model<Brand>,
  @InjectModel(Category.name) private readonly categoryModel:Model<Category>,
 @InjectModel(Product.name) private readonly productModel:Model<Product>,
){}

  async create(createProductDto: CreateProductDto, userid: string, files: Express.Multer.File[]) {
    const brandexists = await this.brandModel.findById(createProductDto.brand); 
    if(!brandexists){
      throw new NotFoundException('brand not found');
    } 
    const categoryexists = await this.categoryModel.findById(createProductDto.category); 
    if(!categoryexists){{
      throw new NotFoundException('category not found');
    }}  
    
const images:string[]= []; 
 if (files?.length){
  for (const file of files) {
    images.push(`./src/uploads/products/${file.filename}`);
  }
 }
    
 const product = await this.productModel.create({
      ...createProductDto,
      createdBy: userid,
      images,   
    });


    return product;
  
}

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Category, CategorySchema } from 'src/DB/models/category.model';
import { Brand, brandSchema } from 'src/DB/models/Brand.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/DB/models/product.model';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
imports:[  UserModule,MongooseModule.forFeature([{name:Category.name,schema:CategorySchema},{name:Brand.name,schema:brandSchema},
  {name:Product.name,schema:ProductSchema}
])],
  controllers: [ProductController],
  providers: [ProductService,JwtService],
})
export class ProductModule {}

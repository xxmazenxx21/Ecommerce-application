import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from 'src/DB/models/category.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, brandSchema } from 'src/DB/models/Brand.model';

@Module({
  imports:[MongooseModule.forFeature([{name:Category.name,schema:CategorySchema},{name:Brand.name,schema:brandSchema}])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

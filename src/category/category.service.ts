import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "src/DB/models/category.model";
import { Model } from "mongoose";
import { Brand } from "src/DB/models/Brand.model";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly CategoryModel: Model<Category>,
    @InjectModel(Brand.name) private readonly BrandModel: Model<Brand>
  ) {}

  
  async create(createCategoryDto: CreateCategoryDto, image: string) {
    const category = await this.CategoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (category) throw new BadRequestException("category already exists");

    if (createCategoryDto.brands && createCategoryDto.brands.length > 0) {
      const brandsID = await this.BrandModel.find({
        _id: { $in: createCategoryDto.brands },
      });
      if (brandsID.length !== createCategoryDto.brands.length) {
        const findingBrandIds = brandsID.map((brands) => brands._id.toString());
        const notFoundIds = createCategoryDto.brands.filter(
          (id) => !findingBrandIds.includes(id.toString())
        );
        throw new BadRequestException(
          `brands with ids ${notFoundIds.join(", ")} not found`
        );
      }
    }

    const newCategory = await this.CategoryModel.create({
      ...createCategoryDto,
      image,
    });
    return newCategory;
  }


  async findAll() {
    return await this.CategoryModel.find().populate({
      path: "brands",
      select: "name image -_id",
    });
  }

  async findOne(id: string) {
    return await this.CategoryModel.findById(id).populate({
      path: "brands",
      select: "name image -_id",
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}

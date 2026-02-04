import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,

} from "@nestjs/common";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { Types } from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/common/utils/multer/multer";

@Controller("api/brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image", multerOptions("brand")))
  create(
    @Body("name") name: string, @Body("createdBy") createdBy: Types.ObjectId , @UploadedFile() file: Express.Multer.File) 
  {
    const createBrandDto: CreateBrandDto = {
      name,
      createdBy,
      image: file.filename,
    };

    return this.brandService.create(createBrandDto);
  }


  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("image", multerOptions("brand")))
  update(@Param("id") id: string, @Body() updateBrandDto: UpdateBrandDto,@UploadedFile() file:Express.Multer.File) {
    if(file) updateBrandDto.image = `src/uplaods/brand/${file.filename}`;

    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.brandService.remove(+id);
  }
}

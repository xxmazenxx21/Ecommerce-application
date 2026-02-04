import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";
import fs from 'fs';
export const multerOptions = (foldername:string)=>  {
const uplaodpath = `./src/uploads/${foldername}`;
if(!fs.existsSync(uplaodpath)){
    fs.mkdirSync(uplaodpath,{recursive:true});
}

return{

    storage:diskStorage({
            destination:uplaodpath,
            filename:(req,file,cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                cb(null,filename);
            }
        }),
        fileFilter:(req,file,cb)=>{
            if(!file.mimetype.startsWith('image/'))
              return cb(new BadRequestException('Only image files are allowed!'),false);
            cb(null,true);
        },

}
    
    }

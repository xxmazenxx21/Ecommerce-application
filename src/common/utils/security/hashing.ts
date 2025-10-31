import bcrypt from "bcrypt"
import pl from "zod/v4/locales/pl.js";



export const HashPlainText = async ({plainText,saltRounds=Number(process.env.SALT)})=>{

return await bcrypt.hash(plainText,saltRounds);

}



export const compareHash = async ({plainText,hashedText})=>{

return await bcrypt.compare(plainText,hashedText);

}
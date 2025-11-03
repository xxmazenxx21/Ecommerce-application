export const   generateotp = ():string =>{
return String(Math.floor(100000 + Math.random() * (900000-100000)+100000));


}
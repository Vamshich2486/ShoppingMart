import jwt from "jsonwebtoken";

// const JWT_SECRET="yafcvds";

const generateToken=(res,userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"30d",
    });
    //set jwt as an HTTp-Only Cookie
    res.cookie("jwt",token,{
        httpOnly:true,
        secure:"DEVELOPMENT",
        sameSite:"strict",
        maxAge:30*24*60*60*1000
    })
    //by using this cookie user is successfully loged in
    return token;
};

export default generateToken;

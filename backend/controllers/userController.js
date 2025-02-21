import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
//
// export const signup = async (req, res) => {
//   const { user_name, email, password } = req.body;

//   try {
//     //checking credentials
//     if (!user_name || !password || !email) {
//       return res
//         .status(400)
//         .json({ message: "please enter all credentials properly" });
//     }
//     if (password.length < 5) {
//       return res
//         .status(400)
//         .json({ message: "password sould contain atleat 5 characters" });
//     }
//     if (!isValidEmail(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }
//     //create new user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email is already registered" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       user_name,
//       email,
//       password: hashedPassword,
//     });
//     await newUser.save();
//     res.status(200).json({
//       user_name,
//       email,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ message: "server error" });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const existing_user = await User.findOne({ email });
//     if (!existing_user) {
//       return res.status(400).json({ message: "register first" });
//     }
//     // if (existing_user.password !== password){
//     //     return res.status(401).json({message:"invalid password"});
//     // }
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       existing_user.password
//     );
//     if (!isPasswordCorrect) {
//       return res.status(401).json({ message: "Invalid password" });
//     }
//     if (isPasswordCorrect) {
//       console.log("login successful");
//       return res.status(201).json({
//         user_name: existing_user.user_name,
//         email: existing_user.email,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "server error" });
//   }
// };

//creating a user or signup page
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }
  //using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //checking completed so lets create a user
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//login page
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return; //exit function after sending response
    }else{
      res.status(400).send("Pls provide correct password")
    }
  }
  else{
    res.status(400).send("wrong email,dont have account? register first")
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    throw new Error("User not found");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  //const {user_name,email}=req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

const deleteUserById=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.params.id);

  if(user){
    if(user.Admin){
      res.status(400);
      throw new Error("admin user cant be deleted");
    }else{
      await User.deleteOne({_id:user._id});
      res.json({message:"user removed"});

    }

  }else{
    res.status(404);
    throw new Error("user not found");
  }

})

const getUserById=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.params.id).select("-password");

  if(user){
    res.json(user);
  }else{
    res.status(404);
    throw new Error("user not found");
  }

});

const updateUserById=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.params.id);

  if(user){
    user.username=req.body.username || user.username;
    user.email=req.body.email || user.email
    user.isAdmin=Boolean(req.body.isAdmin);

    const updatedUser=await user.save();

    res.json({
      _id:updatedUser._id,
      username:updatedUser.username,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin
    })
  }else{
    res.status(404);
    throw new Error("user not found");

  }
})

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById
};
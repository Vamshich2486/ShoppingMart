import mongoose from "mongoose";
const {ObjectId} =mongoose.Schema;

const reviewSchema = mongoose.Schema({
    name:{type: String, required:true},
    rating: {type: Number, required:true},
    comment: {type: String, required:true},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },

},
 {timestamsps: true},
);
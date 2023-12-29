const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "title is required"],
  },
  snippet: {
    type: String,
    trim: true,
    required: [true, "snippet is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "author",
    required: [true, "author is required"],
  },
  image: {
    type: [""],
    default: "",
  },
  price:{
    type:Number,
    default:0,
    max:[200,"price cant exceed 200 rupees"]
  }
});

module.exports = model("blog", blogSchema);

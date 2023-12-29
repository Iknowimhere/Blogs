const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    blogId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    bill: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports=model("order",orderSchema);

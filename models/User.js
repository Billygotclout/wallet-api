const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter username"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    profile_pic: {
      type: String,
      required: true,
    },
    resetCode: {
      type: Number,
    },
  },
  { timestamps: true }
);
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
  },
});
module.exports = mongoose.model("User", userSchema);

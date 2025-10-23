import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  income: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
export default User;

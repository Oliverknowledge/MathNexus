import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  xp: { type: Number, default: 0 }, // ✅ XP Points
  credits: { type: Number, default: 0 }, // ✅ In-App Credits
  password: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

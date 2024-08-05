import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  moneyBalance: { type: Number, required: true },
  refreshToken: { type: String },
  boughtTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }] 
});

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  departurePlace: { type: String, required: true },
  arrivalPlace: { type: String, required: true },
  arrivalPlaceImgUrl: { type: String, required: true },
  userId: { type: String, required: true },
});

export default mongoose.model("Ticket", ticketSchema);

import { v4 as uuidv4 } from "uuid";
import TicketModel from "../model/ticket.js";
import UserModel from "../model/user.js";

const BUY_TICKET = async (req, res) => {
  try {
    const {
      title,
      price,
      departurePlace,
      arrivalPlace,
      arrivalPlaceImgUrl,
      userId,
    } = req.body;

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has enough money to buy the ticket
    if (user.moneyBalance < price) {
      return res
        .status(400)
        .json({ message: "Not enough money, so you can't buy this ticket" });
    }

    // Create and save the ticket
    const ticket = new TicketModel({
      title,
      price,
      departurePlace,
      arrivalPlace,
      arrivalPlaceImgUrl,
      id: uuidv4(),
      userId,
    });

    const savedTicket = await ticket.save();

    // Add ticket ID to user's boughtTickets array and deduct the ticket price from user's balance
    user.boughtTickets.push(savedTicket._id);
    user.moneyBalance -= price;
    await user.save();

    return res
      .status(201)
      .json({ message: "Ticket was added", response: savedTicket });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_USER_TICKETS = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await TicketModel.find({
      userId: userId,
    });

    return res.status(200).json({ tickets: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error in application" });
  }
};

export { BUY_TICKET, GET_USER_TICKETS };

import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import ticketsRouter from "./src/route/ticket.js";
import usersRouter from "./src/route/user.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("connected to DB successfully"))
  .catch((err) => {
    console.log(err);
  });

app.use(ticketsRouter);
app.use(usersRouter);

app.listen(process.env.PORT, () => {
  console.log(
    `Your application was launched successfully on port ${process.env.PORT}`
  );
});

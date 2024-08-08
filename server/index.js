import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import postRoutes from "./routes/postRoute.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-type"],
  },
});
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.error("DB Connection Error: ", err.message);
  });

app.use("/api", authRoutes, postRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// socket.io
io.on("connect", (socket) => {
  socket.on("new-post", (newPost) => {
    socket.broadcast.emit("new-post", newPost);
  });
});

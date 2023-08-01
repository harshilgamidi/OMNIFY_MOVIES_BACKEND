import express from "express";
import mongoose from "mongoose";
import router from "./Routes/User_routes";
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
const routes = express.Router();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use("/users",router);
dotenv.config();
mongoose.connect(process.env.DATABASE).then(app.listen(port)).then(()=>console.log("Connected to DataBase and Server is running at port 5000 ")).catch(err=>console.log(err));



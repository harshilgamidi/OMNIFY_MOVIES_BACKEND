import express from "express";
import { forgetpassword, getAllUsers, GetDetails, ImageUpload, login, NewPassword, OTP, signup } from "../Controllers/User-Controllers";

const router = express.Router();

router.get("/",getAllUsers);
router.post("/signup",signup);
router.post("/login",login);
router.post("/forgetpassword",forgetpassword);
router.post("/OTP",OTP);
router.post("/Newpassword",NewPassword);
router.post('/UploadImg',ImageUpload);
router.get('/GetDetails',GetDetails);


export default router;
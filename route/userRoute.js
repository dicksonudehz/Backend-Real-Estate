import express from "express";
import {
  addFavoriteResidence,
  allFavoriteResidence,
  bookedVisitByUser,
  cancelAVisit,
  createUser,
  getAllBookings,
} from "../controller/userCntrl.js";
import jwtCheck from "../config/authconfig.js";

const router = express.Router(); 

router.post("/register", jwtCheck, createUser);
router.post("/bookedVisit/:id", jwtCheck, bookedVisitByUser);
router.post("/allBookedResidence", jwtCheck,  getAllBookings);
router.post("/cancelABooking/:id", jwtCheck, cancelAVisit);
router.post("/addToFavorite/:rid", jwtCheck, addFavoriteResidence);
router.post("/allFavResidence", jwtCheck, allFavoriteResidence);

export { router as userRoute }

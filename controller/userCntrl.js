import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// create a user endpoint
export const createUser = asyncHandler(async (req, res) => {
  const email = req.body;
  try {
    const {
      name,
      email,
      image,
      bookedVisits,
      faveResisdenceID,
      ownedResidencies,
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        bookedVisits,
        faveResisdenceID,
        ownedResidencies,
      },
    });

    // Return success response
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// booked a visit
export const bookedVisitByUser = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res.send({ message: "This Residence is already booked" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: { bookedVisits: { push: { id, date } } },
      });
      res.send({ message: "Residence book successfully" });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// endpoint to get all bookings

export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    res.status(200).send({ message: "all book residences", bookings });
  } catch (err) {
    throw new Error(err.message);
  }
});

// cancel a book visit appointment

export const cancelAVisit = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);
    if (index === -1) {
      res.status(404).json({ message: "booking can not be found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email: email },
        data: { bookedVisits: user.bookedVisits },
      });
      res.send({ message: "booking cancel successfully", user });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// add favorite residence to favorite residence
export const addFavoriteResidence = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (user.faveResisdenceID.includes(rid)) {
      // If the residence ID is already in the favorites, remove it
      const updateUser = await prisma.user.update({
        where: { email: email },
        data: {
          faveResisdenceID: {
            set: user.faveResisdenceID.filter((id) => id !== rid),
          },
        },
      });
      res.send({
        message: "Removed from favorite residences",
        user: updateUser,
      });
    } else {
      // If the residence ID is not in the favorites, add it
      const updateUser = await prisma.user.update({
        where: { email: email },
        data: {
          faveResisdenceID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Added to favorite residences", user: updateUser });
    }
  } catch (err) {
    console.error("Error adding favorite residence:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

// get all favorite residence

export const allFavoriteResidence = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const favResidence = await prisma.user.findUnique({
      where: { email: email },
      select: { faveResisdenceID: true },
    });
    res
      .status(200)
      .json({
        message: "This are the list of favorite residence",
        favResidence,
      });
  } catch (err) {
    throw new Error(err.message);
  }
});

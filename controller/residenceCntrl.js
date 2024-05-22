import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail
  } = req.body.data;


  console.log("Request body:", req.body);

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    }
  );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        owner: { connect: { email: userEmail } },
      },
    });
    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with address already there");
    }
    throw new Error(err.message);
  }
});

// get all residencies registered
export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
      // where: { email: email },
      orderBy: { createdAt: "desc" },
    });
    res.send({ message: "This are all available residence", residencies });
  } catch (error) {
    // Handle errors
    console.error("Error fetching residencies:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// get a single residence by the id
export const getResidenceById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const residency = await prisma.Residency.findUnique({
      where: { id: id },
    });
    res.send({ message: "Residency fetch successfully", residency });
  } catch (err) {
    throw new Error(err.message);
  }
});

// delete a residence
export const deleteResidence = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResidence = await prisma.residency.delete({
      where: { id: id },
    });
    res.send({ message: "Residence deleted successfully", deleteResidence });
  } catch (err) {
    throw new Error(err.message);
  }
});

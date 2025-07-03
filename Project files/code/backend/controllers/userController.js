const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userModel");
const propertySchema = require("../schemas/propertyModel");
const bookingSchema = require("../schemas/bookingModel");

//////////for registering/////////////////////////////
const registerController = async (req, res) => {
  try {
    let granted = "";
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res.status(409).send({
        success: false,
        message: "Email already in use",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new userSchema({
      ...req.body,
      password: hashedPassword,
      role: req.body.role || "renter",
    });
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Registration failed" });
  }
};

//////////User requests booking/////////////
const requestBookingController = async (req, res) => {
  try {
    const booking = new bookingSchema({
      userId: req.body.userId,
      propertyId: req.body.propertyId,
      status: "pending owner confirmation",
    });
    await booking.save();
    return res.status(200).send({
      success: true,
      message: "Booking request sent",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error requesting booking" });
  }
};

module.exports = {
  registerController,
  requestBookingController,
};
const bookingSchema = require("../schemas/bookingModel");
const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");

//////////adding property by owner////////
const addPropertyController = async (req, res) => {
  try {
    let images = [];
    if (req.files) {
      images = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    const user = await userSchema.findById({ _id: req.body.ownerId });

    const property = new propertySchema({
      ...req.body,
      images,
      owner: req.body.ownerId,
      status: "available",
    });

    await property.save();
    return res.status(200).send({
      success: true,
      message: "Property added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error adding property" });
  }
};

//// Owner confirms booking
const confirmBookingController = async (req, res) => {
  try {
    const booking = await bookingSchema.findById(req.body.bookingId);
    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }
    booking.status = "confirmed";
    await booking.save();
    return res.status(200).send({
      success: true,
      message: "Booking confirmed by owner",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error confirming booking" });
  }
};

module.exports = {
  addPropertyController,
  confirmBookingController,
};
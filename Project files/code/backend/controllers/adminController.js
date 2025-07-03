const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");
const bookingSchema = require("../schemas/bookingModel");

/////////getting all users///////////////
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find({});
    return res.status(200).send({ success: true, users: allUsers });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching users" });
  }
};

//////// Approve Owner Account ////////
const approveOwnerController = async (req, res) => {
  try {
    const owner = await userSchema.findById(req.body.ownerId);
    if (!owner) {
      return res.status(404).send({ success: false, message: "Owner not found" });
    }
    owner.isApproved = true;
    await owner.save();
    return res.status(200).send({ success: true, message: "Owner approved" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Approval failed" });
  }
};

module.exports = {
  getAllUsersController,
  approveOwnerController,
};
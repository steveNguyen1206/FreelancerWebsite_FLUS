const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const db = require("../models");
const OTP = db.otp;

const generateOTP = () => {
  // Generate a 6-digit OTP code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendCode = async (req, res) => {
  console.log(req.body);
  const { phone_number } = req.body;

  try {
    // Check if there is an existing OTP record for the phone number
    const existingRecord = await OTP.findOne({
      where: { phone_number: phone_number }
    });

    if (existingRecord) {
      // Delete the existing OTP record for the phone number
      await OTP.destroy({ where: { phone_number: phone_number } });
    }

    // Generate OTP code
    const otp = generateOTP();

    console.log("OTP: ", otp)

    // Store the generated OTP code in your database
    await OTP.create({ phone_number: phone_number, code: otp });

    // Send the OTP code to the user's phone number using Twilio
    // await client.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: TWILIO_PHONE_NUMBER,
    //   to: phone_number
    // });

    return res.status(200).json({ message: "OTP sent successfully", phone_number });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send OTP", phone_number });
  }
};

const verifyCode = async (req, res) => {
  const { phone_number, code } = req.body;
  console.log("backend: ",req.body);

  try {
    // Retrieve the stored OTP code associated with the phone number from your database
    const otpRecord = await OTP.findOne({
      where: { phone_number: phone_number }
    });

    if (!otpRecord) {
      // No OTP code found for the phone number
      return res.status(400).json({ message: "No OTP code found for the phone number" });
    }

    const storedOTP = otpRecord.code;

    if (code === storedOTP) {
      // OTP verification successful
      // Delete the OTP record for the phone number
      await OTP.destroy({ where: { phone_number: phone_number } });
      return res.status(200).json({ message: "OTP verification successful" });
    } else {
      // OTP verification failed
      return res.status(400).json({ message: "OTP verification failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to verify OTP", phone_number });
  }
};

module.exports = {
  sendCode,
  verifyCode
};
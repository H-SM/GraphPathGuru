const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const Forgot = require("../models/Forgot");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET_HERE;
const REACT_HOST = process.env.REACT_HOST;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

// Create a Nodemailer transporter using SMTP details of your email provider
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

//ROUTE 1: create a user using : POST "/api/auth/createuser". doesnt require Auth ( authenitication ), No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must have a minimum of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwt_token = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, jwt_token });
    } catch (err) {
      if (err.code === 11000) {
        //Duplicate key error
        return res.status(400).json({ success, error: "Email Already Exist" });
      }
      console.error(err);
      res
        .status(500)
        .json({ success, error: "server error", message: err.message });
    }
  }
);

//ROUTE 2: Authenticate a user using : POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Check over your credentials again" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Check over your credentials again" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const auth_token = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, auth_token });
    } catch (err) {
      console.error(err);
      res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }
  }
);

//ROUTE 3:GET logged-in user details : POST "/api/auth/getuser". login required
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err_hsm) {
    console.error(err_hsm);
    res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
  }
});

//ROUTE 4: Update user name. verification required

router.put(
  "/settings/name",
  [fetchuser, body("name", "Enter a valid name").isLength({ min: 3 })],
  async (req, res) => {
    try {
      const userId = req.user.id;
      let success = false;
      const { name } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Check over your credentials again" });
      }

      const updInfo = {};
      if (name) {
        updInfo.name = name;
      }
      success = true;
      const user_upd = await User.findByIdAndUpdate(
        userId,
        { $set: updInfo },
        { new: true }
      );
      res.json({ success, user_upd });
    } catch (err) {
      console.error(err);
      res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }
  }
);
//ROUTE 4: Update profile pic. verification required

router.put("/settings/pfp", [fetchuser, body("image")], async (req, res) => {
  try {
    const userId = req.user.id;
    let success = false;
    const { image } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success, error: "Check over your credentials again" });
    }

    const updInfo = {};
    updInfo.image = image;
    success = true;
    const user_upd = await User.findByIdAndUpdate(
      userId,
      { $set: updInfo },
      { new: true }
    );
    res.json({ success, user_upd });
  } catch (err) {
    console.error(err);
    res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
  }
});

//ROUTE 5: Update user info. verification required [ for password ]
router.put(
  "/settings/pw",
  [
    fetchuser,
    body("newpassword", "Password cannot be blank").exists(),
    body("oldpassword", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    try {
      const userId = req.user.id;
      let success = false;
      const { oldpassword, newpassword } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Check over your credentials again" });
      }

      const passwordCompare = await bcrypt.compare(oldpassword, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Incorrect Password Entered" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(newpassword, salt);

      const updInfo = {};
      if (newpassword) {
        updInfo.password = secPass;
      }
      success = true;
      const user_upd = await User.findByIdAndUpdate(
        userId,
        { $set: updInfo },
        { new: true }
      );
      res.json({ success, user_upd });
    } catch (err) {
      console.error(err);
      res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }
  }
);

//ROUTE 6:GET user details : GET "/api/auth/showuser".no login required
router.get("/showuser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select({
      password: 0,
      _id: 0,
      email: 0,
    });
    if (!user) {
      return res.status(404).send("NOT FOUND!");
    }

    res.send(user);
  } catch (err_hsm) {
    console.error(err_hsm);
    res.status(500).send("INTERNAL SERVER ERROR: Some error occurred");
  }
});

//ROUTE 6:PUT user details : GET "/api/auth/incGraphs".login required
router.put(
  "/incGraphs",
  [fetchuser, body("graphs", "Enter a valid graph").exists()],
  async (req, res) => {
    try {
      const userId = req.user.id;
      let success = false;
      const { graphs } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Check over your credentials again" });
      }

      const updInfo = {};
      if (graphs) {
        updInfo.graphs = graphs;
      }
      success = true;
      const user_upd = await User.findByIdAndUpdate(
        userId,
        { $set: updInfo },
        { new: true }
      );
      res.json({ success, user_upd });
    } catch (err) {
      console.error(err);
      res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }
  }
);

// Forgot password
router.post(
  "/forgotPassword",
  [body("password", "Password cannot be blank").exists()],
  [body("email", "Email cannot be blank").exists()],
  async (req, res) => {
    const email = req.body.email;
    await Forgot.deleteOne({ email });

    if (req.body.sendMail) {
      try {
        const payload = {
          user: {
            email: req.body.email,
          },
        };

        const auth_token = jwt.sign(payload, JWT_SECRET);

        let forgot = new Forgot({
          email: req.body.email,
          token: auth_token,
        });

        await forgot.save();

        const mailOptions = {
          from: "vinay@gmail.com",
          to: email,
          subject: "Password Reset",
          html: `We have sent you this email in response to your request to reset your password on GraphPathGuru. 
          To reset your password, please follow the link below:
      
          <a href = "${REACT_HOST}/forgot-password?auth_token=${auth_token}">Click here to reset your password</a>
          <br><br>
          We recommend that you keep your password secure and not share it with anyone. If your feel your password has been compromised, you can change it again by going to Forgot password again.
          
          <br><br>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
              success: false,
              error:
                "Failed to send reset password email. Please try again later.",
            });
          }


          res.json({
            success: true,
            message: "Token saved and email sent (if applicable)",
          });
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("INTERNAL SERVER ERROR: Some error occurred");
      }
    } else {
      // Reset user password
      try {
        const { token, password } = req.body;

        // Find the token in the 'Forgot' collection
        const forgotToken = await Forgot.findOne({ token });

        if (!forgotToken) {
          return res.status(400).json({
            success: false,
            error:
              "Invalid or expired token. Please request a new password reset.",
          });
        }

        const user = await User.findOne({ email: forgotToken.email });

        if (!user) {
          return res.status(400).json({
            success: false,
            error: "User not found. Please check your email.",
          });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        user.password = secPass;
        await user.save();

        // Remove the token from the 'Forgot' collection once used
        await Forgot.deleteOne({ token });

        res.json({ success: true, message: "Password reset successful" });
      } catch (err) {
        console.error(err);
        res.status(500).send("INTERNAL SERVER ERROR: Some error occurred");
      }
    }
  }
);

module.exports = router;

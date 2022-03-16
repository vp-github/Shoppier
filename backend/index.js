const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

dotenv.config({ path: "./config.env" });
const db = process.env.MONGODB.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(db, {
    useNewUrlparser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connected Successfully");
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty"],
  },
  role: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    required: [true, "Email cant be empty"],
  },
  password: {
    type: String,
    required: [true],
  },
});

const User = new mongoose.model("User", userSchema);

// const user1 = new User({
//   name: "user one",
//   email: "user@email.com",
//   password: "password",
// });
// user1
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "success", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

const port = process.nextTick.PORT || 4000;
app.listen(port, () => {
  console.log(`App is connected in the port ${port}`);
});

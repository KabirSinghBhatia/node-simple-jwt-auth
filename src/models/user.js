const mongoose = require("mongoose");
const validator = require("validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is invalid");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [7, "Password length should be more than 6 characters"],
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Password should not contain 'password'");
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) throw new Error("Age is invalid");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// NOTE
// Cannot use arrow function in middleware because of 'this' binding
//Hashing before saving
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// NOTE
// Cannot use arrow function in middleware because of 'this' binding
//Hashing before saving
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Unable to login");

  const isMatch = await argon2.verify(user.password, password);

  if (!isMatch) throw new Error("Unable to login");

  return user;
};

// NOTE
// Cannot use arrow function in middleware because of 'this' binding
//Hashing before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await argon2.hash(user.password, {
      type: argon2.argon2id,
      timeCost: 1000,
      memoryCost: 4096,
      parallelism: 2,
    });
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Users need a name"],
    },
    email: {
      type: "string",
      lowercase: true,
      unique: true,
      required: [true, "Users need an email address"],
      index: true,
      validate: [isEmail, "invalid email"],
    },
    password: {
      type: "string",
      required: [true, "Users need a password"],
    },
    picture: {
      type: "string",
    },
    newMessages: {
      type: "object",
      default: {},
    },
    status: {
      type: "string",
      default: "online",
    },
  },
  { minimize: false }
);

userSchema.pre("save", async function (next) {
  // Only run if the password was modified
  if (!this.isModified('password')) return next();

  // Encrypt password (hashed with cost of 12)
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();

  // if(!this.isModified('password')) return next();
  // this.password = await bcrypt.hash(this.password,12);
  // this.password = undefined;
  // next();

  // const user = this;
  // if (!user.isModified("password")) return next();

  // bcrypt.genSalt(10, (err, salt) => {
  //   if (err) return next(err);
  //   bcrypt.hash(user.password, salt, (err, hash) => {
  //     if (err) return next(err);
  //     user.password = hash;
  //     next();
  //   });
  // });
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("invalid email or password");

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

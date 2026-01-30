const mongoose = require ('mongoose')


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['user', 'worker', 'admin'],
    default: 'user',
    required: true
  },
  workerRequest: { type: Boolean, default: false }
}, { timestamps: true });



const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel
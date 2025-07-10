import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  assistantname: {        // ✅ this stays lowercase
    type: String
  },
  assistantImage: {       // ✅ Capital "I" matches backend
    type: String
  },
  history: [{
    type: String
  }],
}, {
  timestamps: true
});

const User = mongoose.model('user', userSchema);

export default User;

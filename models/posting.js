const mongoose = require("mongoose");

const PostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "cannot be blank"]
    },
    pay: Number,
    desc: String,
    req: String,
    location: String,
    type: String,
    commitment: Array,
    status: String,
    interested: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
      }
    ],
    applicants: Array,
    confirmed: Array,
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true
    }
  },
  { timestamps: true }
);

const Posting = mongoose.model("Posting", PostingSchema);

module.exports = Posting;

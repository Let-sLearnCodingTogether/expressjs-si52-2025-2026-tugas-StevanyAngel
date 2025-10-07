const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Nama perusahaan harus diisi"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Posisi harus diisi"],
      trim: true,
    },
    applyDate: {
      type: Date,
      required: [true, "Tanggal lamaran harus diisi"],
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, "Status harus diisi"],
      enum: ["Applied", "Interview", "Rejected", "Accepted", "Pending"],
      default: "Applied",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);

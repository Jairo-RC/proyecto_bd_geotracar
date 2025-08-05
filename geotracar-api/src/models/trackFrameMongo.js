// src/models/trackFrameMongo.js
const mongoose = require("mongoose");

const trackFrameSchema = new mongoose.Schema(
  {
    order_tracker_id: { type: Number, required: true },
    status_id: { type: Number, required: true },
    create_date: { type: Date, default: Date.now },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  {
    collection: "track_frame",
  }
);

trackFrameSchema.index({ location: "2dsphere" });
trackFrameSchema.index({ create_date: 1 });

module.exports = mongoose.model("TrackFrameMongo", trackFrameSchema);

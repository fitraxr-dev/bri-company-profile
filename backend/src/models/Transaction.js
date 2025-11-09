import mongoose from "mongoose";

const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    fromAccount: { type: String, required: true, index: true },
    toAccount: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    initiatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add indexes for faster lookups
TransactionSchema.index({ fromAccount: 1 });
TransactionSchema.index({ toAccount: 1 });

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
export default Transaction;

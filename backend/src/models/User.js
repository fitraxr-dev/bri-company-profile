import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Nama lengkap wajib diisi"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Format email tidak valid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      minlength: [8, "Password minimal 8 karakter"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Nomor telepon wajib diisi"],
      match: [/^[0-9]{10,15}$/, "Nomor telepon harus 10-15 digit angka"],
    },
    accountNumber: {
      type: String,
      required: [true, "Nomor rekening wajib diisi"],
      unique: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Saldo tidak boleh negatif"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    autoIndex: false,
    collection: "users",
  }
);

// Index untuk performa query
userSchema.index({ email: 1 });
userSchema.index({ accountNumber: 1 });
userSchema.index({ phoneNumber: 1 });

// Virtual untuk format balance ke Rupiah
userSchema.virtual("formattedBalance").get(function () {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(this.balance);
});

// Method untuk menyembunyikan password saat JSON response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Prevent OverwriteModelError during hot-reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

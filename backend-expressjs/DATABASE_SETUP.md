# 🏦 BRImo Database Setup - MongoDB + Mongoose

Implementasi lengkap schema, migration, dan seeding untuk aplikasi BRImo menggunakan MongoDB, Mongoose, dan Node.js dengan ES Modules.

---

## 📁 Struktur Folder

```
backend/
├── models/
│   └── User.js                    # Schema User dengan validasi lengkap
├── migrations/
│   └── initUserCollection.js      # Migration untuk inisialisasi koleksi
├── seeders/
│   └── seedUsers.js               # Seeding data user contoh
└── package.json                   # Dependencies dan scripts
```

---

## 📋 Prerequisites

- **Node.js**: >= 18.x
- **MongoDB**: >= 5.x (running di `localhost:27017`)
- **npm** atau **yarn**

---

## 🚀 Instalasi

### 1. Install Dependencies

```bash
cd backend
npm install
```

Dependencies yang akan terinstall:

- `mongoose` - ODM untuk MongoDB
- `bcrypt` - Untuk hashing password
- `express`, `cors`, `dotenv` - Framework dan utilities

### 2. Pastikan MongoDB Berjalan

```bash
# Cek apakah MongoDB running
mongosh --eval "db.runCommand({ ping: 1 })"

# Atau start MongoDB service
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
```

---

## 🗄️ Database Setup

### Cara 1: Setup Otomatis (Recommended)

Jalankan migration dan seeding sekaligus:

```bash
npm run db:setup
```

### Cara 2: Step by Step

#### Step 1: Jalankan Migration

```bash
npm run migrate
# atau
node migrations/initUserCollection.js
```

**Output yang diharapkan:**

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB successfully
🔄 Initializing User collection and creating indexes...
📋 Created indexes: _id_, email_1, accountNumber_1, phoneNumber_1
✅ Migration success - User collection initialized
🔌 Disconnected from MongoDB
```

#### Step 2: Jalankan Seeding

```bash
npm run seed
# atau
node seeders/seedUsers.js
```

**Output yang diharapkan:**

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB successfully
🗑️  Clearing existing user data...
✅ Old data cleared
🔐 Password hashed successfully
🌱 Seeding user data...

✅ Seeding success!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Total users created: 3

👥 User List:

1. Ahmad Fadli
   📧 Email: ahmad.fadli@example.com
   📱 Phone: 081234567890
   💳 Account: 1001234567890
   💰 Balance: Rp5.000.000
   🔑 Password: password123 (default)

2. Siti Rahmawati
   📧 Email: siti.rahmawati@example.com
   📱 Phone: 081298765432
   💳 Account: 1001234567891
   💰 Balance: Rp2.500.000
   🔑 Password: password123 (default)

3. Budi Santoso
   📧 Email: budi.santoso@example.com
   📱 Phone: 081356789012
   💳 Account: 1001234567892
   💰 Balance: Rp10.000.000
   🔑 Password: password123 (default)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔌 Disconnected from MongoDB
```

---

## 📊 Schema User

### Field Definitions

| Field           | Type    | Required | Unique | Default    | Validasi                |
| --------------- | ------- | -------- | ------ | ---------- | ----------------------- |
| `fullName`      | String  | ✅       | ❌     | -          | Trim                    |
| `email`         | String  | ✅       | ✅     | -          | Lowercase, Email format |
| `password`      | String  | ✅       | ❌     | -          | Min 8 karakter          |
| `phoneNumber`   | String  | ✅       | ❌     | -          | 10-15 digit angka       |
| `accountNumber` | String  | ✅       | ✅     | -          | Trim                    |
| `balance`       | Number  | ❌       | ❌     | `0`        | Min 0                   |
| `isActive`      | Boolean | ❌       | ❌     | `true`     | -                       |
| `createdAt`     | Date    | ❌       | ❌     | `Date.now` | -                       |

### Timestamps

Schema menggunakan `{ timestamps: true }` yang otomatis menambahkan:

- `createdAt` - Tanggal pembuatan record
- `updatedAt` - Tanggal terakhir update

### Indexes

Index otomatis dibuat pada:

- `email` (unique)
- `accountNumber` (unique)
- `phoneNumber`
- `_id` (default MongoDB)

### Virtual Fields

- `formattedBalance` - Format balance ke Rupiah (e.g., "Rp5.000.000")

### Methods

- `toJSON()` - Otomatis menghapus field `password` dari response

---

## 👥 Data User Default

| Nama           | Email                      | Phone        | Account Number | Balance       |
| -------------- | -------------------------- | ------------ | -------------- | ------------- |
| Ahmad Fadli    | ahmad.fadli@example.com    | 081234567890 | 1001234567890  | Rp 5.000.000  |
| Siti Rahmawati | siti.rahmawati@example.com | 081298765432 | 1001234567891  | Rp 2.500.000  |
| Budi Santoso   | budi.santoso@example.com   | 081356789012 | 1001234567892  | Rp 10.000.000 |

**Password untuk semua user:** `password123`

---

## 🧪 Testing Database

### Verifikasi Data dengan MongoDB Shell

```bash
mongosh brimo_db

# Tampilkan semua users
db.users.find().pretty()

# Count total users
db.users.countDocuments()

# Cari user by email
db.users.findOne({ email: "ahmad.fadli@example.com" })

# Tampilkan indexes
db.users.getIndexes()
```

### Verifikasi dengan Node.js

Buat file test `test-db.js`:

```javascript
import mongoose from "mongoose";
import User from "./models/User.js";

await mongoose.connect("mongodb://localhost:27017/brimo_db");

// Get all users
const users = await User.find();
console.log("Total users:", users.length);
console.log(users);

// Get user by email
const user = await User.findOne({ email: "ahmad.fadli@example.com" });
console.log("User found:", user.fullName);
console.log("Balance:", user.formattedBalance);

await mongoose.connection.close();
```

Jalankan:

```bash
node test-db.js
```

---

## 🔧 Troubleshooting

### Error: MongoDB Connection Failed

**Masalah:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solusi:**

1. Pastikan MongoDB service running
2. Check connection string di migration/seeder files
3. Verifikasi MongoDB listening di port 27017

```bash
# Cek status MongoDB
# Windows:
sc query MongoDB

# macOS/Linux:
systemctl status mongod
```

### Error: E11000 Duplicate Key

**Masalah:** `E11000 duplicate key error collection`

**Solusi:**
Data sudah ada di database. Hapus data lama:

```bash
mongosh brimo_db --eval "db.users.deleteMany({})"
```

Kemudian jalankan seeding lagi.

### Error: bcrypt Not Found

**Masalah:** `Cannot find module 'bcrypt'`

**Solusi:**

```bash
npm install bcrypt
```

Jika masih error, install build tools:

```bash
# Windows:
npm install --global windows-build-tools

# macOS:
xcode-select --install

# Linux:
sudo apt-get install build-essential
```

---

## 📝 Scripts npm

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run migrate`  | Jalankan migration (init collection + indexes) |
| `npm run seed`     | Jalankan seeding (populate data)               |
| `npm run db:setup` | Jalankan migration + seeding sekaligus         |
| `npm start`        | Start aplikasi                                 |
| `npm run dev`      | Start dengan nodemon (auto-reload)             |

---

## 🔐 Security Notes

⚠️ **PENTING untuk Production:**

1. **Password Hashing**: Gunakan bcrypt dengan salt rounds >= 10
2. **Environment Variables**: Jangan hardcode connection string
3. **Validation**: Schema validation sudah built-in
4. **Sanitization**: Gunakan express-validator untuk input sanitization

### Contoh dengan .env:

```env
MONGODB_URI=mongodb://localhost:27017/brimo_db
MONGODB_URI_PROD=mongodb+srv://user:pass@cluster.mongodb.net/brimo_db
BCRYPT_ROUNDS=10
```

Update connection di migration/seeder:

```javascript
await mongoose.connect(process.env.MONGODB_URI);
```

---

## 📚 Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 🎯 Next Steps

Setelah setup berhasil, Anda bisa:

1. ✅ Buat API endpoints (CRUD operations)
2. ✅ Tambahkan authentication (JWT)
3. ✅ Implementasi authorization middleware
4. ✅ Tambahkan transaction schema untuk transfer
5. ✅ Setup testing dengan Jest/Mocha

---

## 📄 License

This project is part of BRI Redesign - Politeknik Negeri Bandung

---

**Made with ❤️ for BRImo Application**

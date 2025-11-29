# Build & Troubleshooting Guide

## 🔨 Build Process

### First Time Build

```bash
cd backend-rust
cargo build
```

**What happens:**
1. Download all dependencies (~100MB)
2. Compile dependencies (2-3 minutes)
3. Compile your code (30-60 seconds)
4. Total: **3-5 minutes**

### Subsequent Builds

```bash
cargo build
```

**What happens:**
1. Only recompile changed code
2. Total: **5-10 seconds**

### Release Build

```bash
cargo build --release
```

**Differences from debug:**
- Full optimizations enabled
- No debug symbols
- Smaller binary size
- Faster runtime (10x+)
- Longer compile time (2x)

## 🐛 Common Build Errors

### 1. "linking with `link.exe` failed" (Windows)

**Problem:** Missing Visual Studio Build Tools

**Solution:**
```powershell
# Option 1: Install Visual Studio Build Tools
winget install Microsoft.VisualStudio.2022.BuildTools

# Option 2: Install full Visual Studio Community
winget install Microsoft.VisualStudio.2022.Community

# Then restart terminal
```

### 2. "could not find `Cargo.toml`"

**Problem:** Wrong directory

**Solution:**
```bash
cd backend-rust
cargo build
```

### 3. OpenSSL errors (Linux)

**Problem:** Missing OpenSSL development files

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install pkg-config libssl-dev

# Fedora/RHEL
sudo dnf install pkgconfig openssl-devel

# Arch
sudo pacman -S pkg-config openssl
```

### 4. "failed to resolve: use of undeclared crate"

**Problem:** Missing dependency in Cargo.toml

**Solution:**
```bash
# Clean and rebuild
cargo clean
cargo build
```

### 5. Network/Download errors

**Problem:** Firewall or network issues

**Solution:**
```bash
# Set alternative registry
export CARGO_REGISTRIES_CRATES_IO_PROTOCOL=sparse

# Or use mirror
[source.crates-io]
replace-with = "tuna"

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

### 6. Out of memory during compilation

**Problem:** Low RAM

**Solution:**
```bash
# Reduce parallel compilation
cargo build -j 1

# Or increase swap space (Linux)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🚀 Runtime Errors

### 1. "MongoDB connection error"

**Symptoms:**
```
Error: Failed to connect to MongoDB
```

**Diagnosis:**
```bash
# Check internet
ping 8.8.8.8

# Check MongoDB URI
echo $MONGODB_URI

# Test MongoDB connection
mongosh "mongodb+srv://..."
```

**Solutions:**
- Verify MONGODB_URI in `.env`
- Check MongoDB Atlas IP whitelist
- Verify credentials
- Check network firewall

### 2. "JWT_SECRET must be set"

**Symptoms:**
```
Error: JWT_SECRET must be set in environment
```

**Solution:**
```bash
# Check .env file exists
ls -la .env

# Verify JWT_SECRET is set
grep JWT_SECRET .env

# If missing, add it
echo "JWT_SECRET=your-secret-key-here" >> .env
```

### 3. "Address already in use"

**Symptoms:**
```
Error: Address already in use (os error 48)
```

**Solutions:**

Windows:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change port in .env
echo "PORT=5001" >> .env
```

Linux/macOS:
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port
echo "PORT=5001" >> .env
```

### 4. "Collection not found" errors

**Symptoms:**
```
Error: Collection 'users' not found
```

**Solution:**
```bash
# Collections are created automatically
# But ensure database is correct

# Check database name in MONGODB_URI
# Format: mongodb+srv://.../DATABASE_NAME

# Or manually create via mongosh
mongosh "mongodb+srv://..."
use bromo_db
db.createCollection("users")
db.createCollection("articles")
db.createCollection("transactions")
```

### 5. "Invalid credentials" even with correct password

**Symptoms:**
- Login fails
- Password is definitely correct

**Diagnosis:**
```bash
# Check bcrypt cost
grep BCRYPT_COST .env

# Different cost = different hash
```

**Solution:**
- Ensure BCRYPT_COST is consistent
- If changed, reset all passwords
- Or directly update in MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { password: "new_bcrypt_hash" } }
)
```

## 🔍 Debugging

### Enable Detailed Logging

```bash
# Full debug logs
RUST_LOG=debug cargo run

# Specific module
RUST_LOG=brimo_backend_rust=debug cargo run

# Multiple modules
RUST_LOG=brimo_backend_rust=debug,actix_web=info cargo run
```

### Check Running Process

```bash
# Linux/macOS
ps aux | grep brimo

# Windows
tasklist | findstr brimo
```

### Monitor Resource Usage

```bash
# Linux
htop  # or top

# Windows
# Open Task Manager

# Check specific process
ps -p <PID> -o %cpu,%mem,cmd
```

### Network Debugging

```bash
# Test endpoint
curl -v http://localhost:5000/api/ping

# Test with headers
curl -v -H "Authorization: Bearer token" http://localhost:5000/api/auth/me

# Test POST
curl -v -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## 🧪 Testing

### Run Tests

```bash
# All tests
cargo test

# Specific test
cargo test test_name

# Show output
cargo test -- --nocapture

# Show test names
cargo test -- --list
```

### Integration Testing

```bash
# Start server in background
cargo run &
SERVER_PID=$!

# Run tests
./test_api.sh

# Kill server
kill $SERVER_PID
```

## 📊 Performance Profiling

### Compile Time Analysis

```bash
# Show compilation time for each crate
cargo build --timings

# Opens HTML report
```

### Runtime Profiling

```bash
# Install flamegraph
cargo install flamegraph

# Profile application
cargo flamegraph

# Opens flamegraph.svg
```

### Memory Profiling

```bash
# Install valgrind (Linux)
sudo apt install valgrind

# Run with memcheck
valgrind --leak-check=full ./target/debug/brimo-backend-rust
```

## 🛠️ Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "rust-lang.rust-analyzer",
    "vadimcn.vscode-lldb",
    "serayuzgur.crates",
    "tamasfe.even-better-toml"
  ]
}
```

### Cargo Watch

```bash
# Install
cargo install cargo-watch

# Watch and run
cargo watch -x run

# Watch, clear, and run
cargo watch -c -x run

# Watch and test
cargo watch -x test
```

### Cargo Edit

```bash
# Install
cargo install cargo-edit

# Add dependency
cargo add actix-web

# Remove dependency
cargo rm actix-web

# Upgrade dependency
cargo upgrade actix-web
```

## 📈 Build Optimization

### Faster Compilation

Add to `Cargo.toml`:
```toml
[profile.dev]
opt-level = 1

[profile.dev.package."*"]
opt-level = 2
```

### Reduce Binary Size

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
strip = true
panic = "abort"
```

### Caching

```bash
# Use sccache for faster rebuilds
cargo install sccache
export RUSTC_WRAPPER=sccache

# Check cache stats
sccache --show-stats
```

## 🔐 Security Checks

### Audit Dependencies

```bash
# Install cargo-audit
cargo install cargo-audit

# Check for vulnerabilities
cargo audit

# Fix vulnerable dependencies
cargo update
```

### Check for Unsafe Code

```bash
# Find all unsafe blocks
rg "unsafe" src/

# Should be minimal or zero
```

## 📝 Code Quality

### Format Code

```bash
# Format all code
cargo fmt

# Check without modifying
cargo fmt -- --check
```

### Lint Code

```bash
# Run clippy
cargo clippy

# Deny warnings
cargo clippy -- -D warnings

# Fix automatically (where possible)
cargo clippy --fix
```

### Check Code

```bash
# Type check without building
cargo check

# Much faster than cargo build
```

## 🔄 Dependency Management

### Update Dependencies

```bash
# Check outdated
cargo outdated

# Update all
cargo update

# Update specific
cargo update -p actix-web
```

### Clean Build

```bash
# Remove target directory
cargo clean

# Fresh build
cargo build
```

## 📚 Documentation

### Generate Docs

```bash
# Generate documentation
cargo doc

# Open in browser
cargo doc --open

# Include private items
cargo doc --document-private-items
```

## 🎯 Performance Tips

1. **Use `--release` for benchmarks**
2. **Profile before optimizing**
3. **Avoid premature optimization**
4. **Use appropriate data structures**
5. **Minimize allocations**
6. **Use references when possible**
7. **Consider async/await overhead**
8. **Cache frequently accessed data**

## 💡 Best Practices

1. Run `cargo clippy` regularly
2. Run `cargo test` before commit
3. Keep dependencies updated
4. Use `cargo fmt` consistently
5. Write tests for new features
6. Document public APIs
7. Handle all errors explicitly
8. Avoid `unwrap()` in production code

---

**Still having issues?** Check:
- Rust version: `rustc --version` (should be 1.70+)
- Cargo version: `cargo --version`
- System logs
- GitHub issues
- Rust community forums

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const validator = require("validator");

const app = express();
const PORT = 3001;
const JWT_SECRET =
  "6a49d482993d0d5cb7f07798dd65aeb009a65b23f271eb150f813bbcb0b58732";

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with actual database in production)
let users = [];

// Helper function to find user by email or phone
const findUserByEmailOrPhone = (email, phone) => {
  return users.find((user) => user.email === email || user.phone === phone);
};

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Validate phone number (basic validation)
    if (!validator.isMobilePhone(phone)) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = findUserByEmailOrPhone(email, phone);
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message:
            "An account with this email already exists. Please try logging in instead.",
        });
      } else if (existingUser.phone === phone) {
        return res.status(400).json({
          message:
            "An account with this phone number already exists. Please try logging in instead.",
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error. Please try again.",
    });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validation
    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Please provide email or phone number and password",
      });
    }

    // Find user by email or phone
    const user = findUserByEmailOrPhone(email, phone);
    if (!user) {
      return res.status(401).json({
        message: "Account not found. Please try signing up first.",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error. Please try again.",
    });
  }
});

// Get all users endpoint (for testing purposes)
app.get("/api/users", (req, res) => {
  const safeUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  }));
  res.json(safeUsers);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get("/api/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("POST /api/register - Register new user");
  console.log("POST /api/login - Login user");
  console.log("GET /api/users - Get all users (testing)");
  console.log("GET /api/profile - Get user profile (requires authentication)");
});

module.exports = app;

require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const conn = require("./db/db");
const User = require("./model/user");

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes

// Home route
app.get("/", (req, res) => {
  res.render("index", { fetchedImageUrl: null });
});

// Get image by ID
app.get("/prev/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.render("index", { fetchedImageUrl: null });
    }
    res.render("index", { fetchedImageUrl: user.imageUrl });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.render("index", { fetchedImageUrl: null });
  }
});

// Upload image route
app.post("/upload", async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Name and image URL are required" });
    }

    const existingUser = await User.findOne({ name: name.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name: name.toLowerCase(), imageUrl });

    return res.status(201).json({ message: "File Upload Successful", user });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Find image form
app.get("/findImage", (req, res) => {
  res.render("find", { fetchedImageUrl: null });
});

// Find image by name
app.post("/findImage", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findOne({ name: name.toLowerCase() });
    if (!user) {
      return res.render("find", {
        fetchedImageUrl: null,
        msg: "Image not found, please upload it",
      });
    }

    res.render("find", { fetchedImageUrl: user.imageUrl });
  } catch (error) {
    console.error("Find image error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Show all uploaded images
app.get("/all/images", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("all", { users });
  } catch (error) {
    console.error("Error fetching all images:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Connect to DB and start server
conn().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
  });
});

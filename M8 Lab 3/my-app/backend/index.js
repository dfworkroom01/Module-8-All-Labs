require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Like = require("./models/Like");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

// User Registration Route
app.post("/users/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Unable to create user" });
  }
});

// User Login Route
app.post("/users/login", async (req, res) => {
  console.log("Login request received:", req.body); // Log the request body
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//Post comment route
app.post('/posts', async (req, res) => {
    try {
        const { title, description, user_id } = req.body;

        if (!title || !content || !user_id) {
            return res.status(400).json({ error: 'title, description, image_url and user ID are required.' });
        }

        const post = await Post.create({ title, description, user_id });
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error); // Log the error
        res.status(400).json({ error: 'Unable to create post' });
    }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({ include: [User, Comment, Like] });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch posts" });
  }
});

// Comment Routes
app.post("/comments", async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Unable to create comment" });
  }
});

// Like Routes
app.post("/likes", async (req, res) => {
  try {
    const like = await Like.create(req.body);
    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Unable to like post" });
  }
});

// Error Handling for JSON Parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ error: "Invalid JSON payload" });
  }
  next();
});

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

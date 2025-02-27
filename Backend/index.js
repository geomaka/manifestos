const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const Candidate = require("./Models/candidate.js");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("./Models/Students.js")


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).send("Access denied");
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send("Invalid token");
      req.user = user;t
      next();
    });
  };

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

  const uploadDir = path.join(__dirname, "uploads");


  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
  }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/candidates", upload.single("picture"), async (req, res) => {
  try {
    const { name, email, videoUrl, manifesto } = req.body;
    const picture = req.file ? `/uploads/${req.file.filename}` : "";

    const newCandidate = new Candidate({ name, email, videoUrl, picture,manifesto });
    await newCandidate.save();

    res.status(200).json({ message: "Candidate created", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: "Error adding candidate", error });
  }
});

app.get("/candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ upvotes: -1 });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching candidates", error });
    }
});

app.post("/candidates/:id/vote", async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; 

        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        if (type === "upvote") candidate.upvotes += 1;
        if (type === "downvote") candidate.downvotes += 1;

        await candidate.save();

        res.json({ message: "Vote updated", upvotes: candidate.upvotes, downvotes: candidate.downvotes });
    } catch (error) {
        res.status(500).json({ message: "Error updating vote", error });
    }
});

app.get("/candidates/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: "Error fetching candidate", error });
    }
});

app.post("/students/register", async (req, res) => {
    const { registrationNumber,password} = req.body;
  
    try {
      const studentExists = await Student.findOne({ registrationNumber });
      if (studentExists) return res.status(400).json({ message: "Student already registered" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newStudent = new Student({ registrationNumber,  password: hashedPassword });
      await newStudent.save();
  
      res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering student", error });
    }
  });
  
  app.post("/students/login", async (req, res) => {
    const { registrationNumber, password } = req.body;
  
    try {
      const student = await Student.findOne({ registrationNumber });
      if (!student) return res.status(404).json({ message: "Student not found" });
  
      const validPassword = await bcrypt.compare(password, student.password);
      if (!validPassword) return res.status(400).json({ message: "Invalid password" });
  
      const token = jwt.sign({ id: student._id, registrationNumber: student.registrationNumber }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in student", error });
    }
  });

  app.post("/candidates/:id/vote", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
  
    try {
      const student = await Student.findById(req.user.id);
      if (!student) return res.status(404).json({ message: "Student not found" });
  
      const existingVote = student.votes.find(vote => vote.candidateId.toString() === id);
      if (existingVote) return res.status(400).json({ message: "You have already voted for this candidate" });
  
      const candidate = await Candidate.findById(id);
      if (!candidate) return res.status(404).json({ message: "Candidate not found" });
  
      student.votes.push({ candidateId: id, voteType: type });
      await student.save();
  
      if (type === "upvote") candidate.upvotes += 1;
      if (type === "downvote") candidate.downvotes += 1;
      await candidate.save();
  
      res.json({ message: "Vote recorded", upvotes: candidate.upvotes, downvotes: candidate.downvotes });
    } catch (error) {
      res.status(500).json({ message: "Error recording vote", error });
    }
  });
  
  


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

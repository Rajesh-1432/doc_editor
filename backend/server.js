const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = 'mongodb://localhost:27017/docUploaderDB'; // DB name is now part of the URI
const client = new MongoClient(uri);
let db;

client.connect().then(() => {
  db = client.db(); // No need to pass dbName since it's in the URI
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});


// Setup storage with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowed = ['.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only .doc and .docx files are allowed!'));
    }
    cb(null, true);
  }
});

// Upload API
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileData = {
    originalName: req.file.originalname,
    storedName: req.file.filename,
    path: req.file.path,
    uploadDate: new Date(),
  };

  try {
    const result = await db.collection('files').insertOne(fileData);
    res.status(200).json({ message: 'File uploaded successfully', fileId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save file info to database' });
  }
});

// Download API
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.download(filePath);
});

// List uploaded files
app.get('/files', async (req, res) => {
  try {
    const files = await db.collection('files').find().toArray();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

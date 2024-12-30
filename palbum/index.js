const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const albumRoutes = require('./routes/album.routes');
const path = require('path');

const app = express();

const corsOptions = {
  origin: ['https://thepalbum-1.onrender.com'], // Allow only your frontend's deployed domain
  methods: ['GET', 'POST', 'DELETE'],          // Specify allowed HTTP methods
  credentials: true,                           // Allow cookies or authentication if needed
};

// MongoDB Connection
mongoose
  .connect('mongodb+srv://fidati15:7Bd4hi9fXDOas5js@palbumcluster.azccv.mongodb.net/?retryWrites=true&w=majority&appName=PalbumCluster') // Updated database name
  .then(() => console.log('Connected to MongoDB (phototheque2)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Apply fileUpload middleware specifically for /albums routes
app.use('/albums', fileUpload({
  //limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  abortOnLimit: true,                     // Reject files that exceed the size limit
  useTempFiles: true,                     // Store uploaded files in temporary storage
  tempFileDir: '/tmp/'                    // Directory for temporary files
}));

// Routes
app.use('/albums', albumRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

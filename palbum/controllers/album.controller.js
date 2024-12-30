const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { rimraf } = require('rimraf');
const Album = require('../models/Album');

// Fetch all albums
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
};

// Fetch a specific album
const getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: 'Album not found' });
    res.json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Failed to fetch album' });
  }
};

// Create a new album
const createAlbum = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newAlbum = new Album({ title, images: [] });
    await newAlbum.save();

    res.status(201).json(newAlbum);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
};

// Add an image to an album
const addImage = async (req, res) => {
  try {
    const idAlbum = req.params.id;
    const album = await Album.findById(idAlbum);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const image = req.files.image;

    if (!['image/jpeg', 'image/png'].includes(image.mimetype)) {
      return res.status(400).json({ error: 'Only JPG and PNG files are allowed' });
    }

    const imageName = image.name;
    const uploadPath = path.join(__dirname, '../public/uploads', idAlbum);
    fs.mkdirSync(uploadPath, { recursive: true });

    const imagePath = path.join(uploadPath, imageName);
    await image.mv(imagePath);

    album.images.push(imageName);
    await album.save();

    res.status(200).json(album);
  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).json({ error: 'Failed to add image' });
  }
};

// Delete an album
const deleteAlbum = async (req, res) => {
  try {
    const idAlbum = req.params.id;
    const album = await Album.findByIdAndDelete(idAlbum);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const albumPath = path.join(__dirname, '../public/uploads', idAlbum);
    if (fs.existsSync(albumPath)) {
      await rimraf(albumPath);
    }

    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
};

// Delete a specific image
const deleteImage = async (req, res) => {
  try {
    const idAlbum = req.params.id;
    const imageIndex = req.params.imageIndex;
    const album = await Album.findById(idAlbum);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const imageName = album.images[imageIndex];
    if (!imageName) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imagePath = path.join(__dirname, '../public/uploads', idAlbum, imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    album.images.splice(imageIndex, 1);
    await album.save();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = {
  getAlbums,
  getAlbum,
  createAlbum,
  addImage,
  deleteAlbum,
  deleteImage,
};

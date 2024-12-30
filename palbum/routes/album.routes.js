const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');

router.get('/', albumController.getAlbums);
router.get('/:id', albumController.getAlbum);
router.post('/', albumController.createAlbum);
router.post('/:id', albumController.addImage); // Add an image to an album
router.delete('/:id', albumController.deleteAlbum); // Delete an album
router.delete('/:id/image/:imageIndex', albumController.deleteImage); // Delete a specific image

module.exports = router;

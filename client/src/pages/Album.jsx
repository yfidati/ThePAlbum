import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Album() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/albums/${id}`)
      .then((response) => setAlbum(response.data))
      .catch((err) => setError('Failed to load album'));
  }, [id]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddImage = () => {
    console.log(image)
    const formData = new FormData();
    formData.append('image', image);
    
    axios
      .post(`http://localhost:3000/albums/${id}`, formData )
      .then((response) => setAlbum(response.data))
      .catch((err) => setError('Failed to add image'));
  };

  const handleDeleteImage = (index) => {
    axios
      .delete(`http://localhost:3000/albums/${id}/image/${index}`)
      .then(() => {
        const updatedImages = album.images.filter((_, i) => i !== index);
        setAlbum({ ...album, images: updatedImages });
      })
      .catch((err) => setError('Failed to delete image'));
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 ">{album?.title}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <input type="file" onChange={handleImageUpload} />
        <button onClick={handleAddImage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Image
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {album?.images.map((img, index) => (
          <div key={index} className="border p-2">
            <img src={`http://localhost:3000/uploads/${id}/${img}`} alt={img} className="w-full" />
            <button
              onClick={() => handleDeleteImage(index)}
              className="bg-red-500 text-white  px-2 py-1 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')} className="bg-gray-500 text-white mt-4 px-4 py-2 rounded">
        Back to Albums
      </button>
    </div>
  );
}

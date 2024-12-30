import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch albums on component mount
  useEffect(() => {
    axios
      .get('https://thepalbum.onrender.com/albums')
      .then((response) => {
        console.log('Fetched albums:', response.data);
        setAlbums(response.data);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching albums:', err.message);
        setError('Failed to fetch albums');
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle album deletion
  const handleDeleteAlbum = (id) => {
    axios
      .delete(`https://thepalbum.onrender.com/albums/${id}`)
      .then(() => {
        setAlbums((prevAlbums) => prevAlbums.filter((album) => album._id !== id));
      })
      .catch((err) => {
        console.error('Error deleting album:', err.message);
        setError('Failed to delete album');
      });
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">My Albums</h1>
      {loading ? (
        <p>Loading albums...</p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          <Link to="/albums/create" className="bg-green-500 text-white px-4 py-2 rounded">
            New Album
          </Link>
          <ul className="mt-4">
            {albums.length === 0 ? (
              <p>No albums found.</p>
            ) : (
              albums.map((album) => (
                <li key={album._id} className="border-b py-2 flex justify-between items-center">
                  <Link to={`/albums/${album._id}`} className="text-blue-500">
                    {album.title}
                  </Link>
                  <button
                    onClick={() => handleDeleteAlbum(album._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}

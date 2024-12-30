import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Albums from './pages/Albums';
import Album from './pages/Album';
import NewAlbum from './pages/NewAlbum';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Albums />} />
        <Route path="/albums/create" element={<NewAlbum />} />
        <Route path="/albums/:id" element={<Album />} />
      </Routes>
    </BrowserRouter>
  );
}

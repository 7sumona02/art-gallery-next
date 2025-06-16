'use client'
import { useState, useEffect } from 'react';

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('https://api.artic.edu/api/v1/artworks');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        setArtworks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-[#EEEEEEff] h-full w-screen'>
      <div className="container mx-auto px-4 py-8 font-mono">
        <h1 className="text-3xl font-bold mb-8">Art Institute of Chicago Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold mb-2">{artwork.title || 'Untitled'}</h2>
              <p className="text-gray-600 mb-2">{artwork.artist_title || 'Unknown artist'}</p>
              {artwork.image_id && (
                <img
                  src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`}
                  alt={artwork.title}
                  className="mt-2 w-full h-auto object-cover"
                  loading="lazy"
                />
              )}
              {artwork.thumbnail?.alt_text && (
                <p className="mt-2 text-sm text-gray-500">{artwork.thumbnail.alt_text}</p>
              )}
              {artwork.date_display && (
                <p className="mt-1 text-sm">Date: {artwork.date_display}</p>
              )}
              {artwork.place_of_origin && (
                <p className="mt-1 text-sm">Origin: {artwork.place_of_origin}</p>
              )}
              {artwork.place_of_origin && (
                <p className="mt-1 text-sm">Department: {artwork.department_title}</p>
              )}
              {artwork.term_titles && artwork.term_titles.length > 0 && (
                <p className="mt-2 text-sm">
                  #{artwork.term_titles.map((title, index) => (
                    <span key={index}>
                      {title}
                      {index !== artwork.term_titles.length - 1 && ", #"}
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
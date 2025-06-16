'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ArtworkDetail({ params }) {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.artic.edu/api/v1/artworks/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch artwork');
        }
        const data = await response.json();
        setArtwork(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [params.id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8">Error: {error}</div>;
  if (!artwork) return <div className="text-center py-8">Artwork not found</div>;

  return (
    <div className='bg-[#EEEEEEff] min-h-screen w-full'>
      <div className="container mx-auto max-w-6xl px-4 py-8 font-mono">
        <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to gallery
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg">
            {artwork.image_id ? (
              <img
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                alt={artwork.title || 'Untitled artwork'}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500">
                Image not available
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">{artwork.title || 'Untitled'}</h1>
            {artwork.artist_title && (
              <p className="text-lg mb-4">By {artwork.artist_title}</p>
            )}
            
            {artwork.date_display && (
              <p className="text-sm mb-4">{artwork.date_display}</p>
            )}
            
            {artwork.medium_display && (
              <div className="mb-4">
                <h2 className="font-bold">Medium</h2>
                <p>{artwork.medium_display}</p>
              </div>
            )}
            
            {artwork.dimensions && (
              <div className="mb-4">
                <h2 className="font-bold">Dimensions</h2>
                <p>{artwork.dimensions}</p>
              </div>
            )}
            
            {artwork.credit_line && (
              <div className="mb-4">
                <h2 className="font-bold">Credit Line</h2>
                <p>{artwork.credit_line}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
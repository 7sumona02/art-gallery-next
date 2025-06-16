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
    <div className='bg-[#EEEEEEff] h-screen w-screen overflow-hidden'>
      <div className="font-mono">
        
        <div className="grid md:grid-cols-2 translate-y-20">
          {/* Details Column - Now on the left */}
          <div className="order-1 md:order-none p-2 max-w-sm">
            {artwork.artist_title && (
              <p className="max-w-60 font-extrabold pb-2">Various works by<br /> {artwork.artist_title}</p>
            )}
            
            {artwork.date_display && (
              <p className="text-xs font-extrabold pb-1">{artwork.date_display}</p>
            )}
            
            {artwork.medium_display && (
              <div>
                <h2 className="text-xs font-medium text-neutral-400 pt-2">Medium</h2>
                <p className='text-xs font-extrabold'>{artwork.medium_display}</p>
              </div>
            )}
            
            {artwork.dimensions && (
              <div>
                <h2 className="text-xs font-medium text-neutral-400 pt-2">Dimensions</h2>
                <p className='text-xs font-extrabold'>{artwork.dimensions}</p>
              </div>
            )}
            
            {artwork.credit_line && (
              <div>
                <h2 className="text-xs font-medium text-neutral-400 pt-2">Credit Line</h2>
                <p className='text-xs font-extrabold'>{artwork.credit_line}</p>
              </div>
            )}
          </div>
          
          {/* Image Column - Now on the right */}
          <div className="w-full h-screen">
            {artwork.image_id ? (
              <img
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                alt={artwork.title || 'Untitled artwork'}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                Image not available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
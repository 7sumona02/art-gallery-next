'use client'
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchArtworks = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNum}&limit=12`);
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }
      const data = await response.json();
      
      const artworksWithImages = data.data.filter(artwork => artwork.image_id);
      setArtworks(prev => [...prev, ...artworksWithImages]);
      setHasMore(data.pagination.current_page < data.pagination.total_pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const lastArtworkElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchArtworks(page);
  }, [page, fetchArtworks]);

  if (error) return <div className="text-center py-8">Error: {error}</div>;

  return (
    <div className='bg-[#EEEEEEff] min-h-screen w-full'>
      <div className="container mx-auto max-w-4xl px-4 py-8 font-mono">
        <h1 className="text-xl font-extrabold pb-2">Art Gallery</h1>
        
        {/* Grid container with original card design */}
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {artworks.map((artwork, index) => (
            <Link 
              href={`/artworks/${artwork.id}`} 
              key={artwork.id} 
              ref={index === artworks.length - 1 ? lastArtworkElementRef : null}
              className="flex flex-col items-start justify-end pb-3 hover:opacity-90 transition-opacity"
            >
              <h2 className="text-xs font-bold">
                {artwork.title 
                  ? (artwork.title.length > 30 
                    ? `${artwork.title.substring(0, 30)}...`
                    : artwork.title)
                  : 'Untitled'}
              </h2>
              <h2 className="text-[10.5px] font-medium text-neutral-400 pb-1">
                {artwork.place_of_origin}
              </h2>
              <div className="relative group bg-transparent flex items-center justify-center overflow-hidden w-full">
                {artwork.image_id ? (
                  <img
                    src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                    alt={artwork.title || 'Untitled artwork'}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                    image not available
                  </div>
                )}
                <div className='absolute bottom-2 right-2 bg-white/70 rounded-full flex items-center p-0.5 opacity-0 group-hover:opacity-100 duration-200 transition-all'>
                  <ArrowUpRight className='size-4' />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {!hasMore && !loading && (
          <div className="text-center py-8 text-gray-500">
            You've reached the end of the collection
          </div>
        )}
      </div>
    </div>
  );
}
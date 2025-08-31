import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../client.js';

const ViewCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreator();
  }, [id]);

  const fetchCreator = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCreator(data);
    } catch (error) {
      console.error('Error fetching creator:', error);
      setError('Failed to load creator');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const creatorName = creator?.name || 'this creator';
    
    if (window.confirm(`Are you sure you want to delete "${creatorName}" from your Creatorverse?\n\nThis action cannot be undone and will permanently remove all their information.`)) {
      try {
        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        // Navigate back to home page after successful deletion
        navigate('/');
      } catch (error) {
        console.error('Error deleting creator:', error);
        alert('Failed to delete creator. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="container loading">Loading creator...</div>;
  }

  if (error || !creator) {
    return (
      <div className="container">
        <div className="error">{error || 'Creator not found'}</div>
        <Link to="/" className="back-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="creator-detail">
        <div className="creator-header">
          <Link to="/" className="back-btn">← Back to All Creators</Link>
          
          {/* Display the content creator's image */}
          {(creator.image || creator.imageURL) ? (
            <div className="creator-image">
              <img src={creator.image || creator.imageURL} alt={`${creator.name}'s profile image`} />
            </div>
          ) : (
            <div className="creator-image-placeholder">
              <div className="placeholder-icon">📸</div>
              <span>No Image Available</span>
            </div>
          )}
          
          {/* Display the content creator's name */}
          <h1 className="creator-name">{creator.name}</h1>
          
          {/* Display the content creator's URL */}
          <div className="creator-url-section">
            <h3>🔗 Channel URL:</h3>
            <a 
              href={creator.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="creator-url-display"
            >
              {creator.url}
            </a>
          </div>
          
          {/* Display the content creator's description */}
          <div className="creator-description-section">
            <h3>📝 About:</h3>
            <p className="creator-description">{creator.description}</p>
          </div>
        </div>

        <div className="creator-actions">
          <a 
            href={creator.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="visit-channel-btn"
          >
            🌐 Visit Channel
          </a>
          
          <Link to={`/edit/${creator.id}`} className="edit-btn">
            ✏️ Edit Creator
          </Link>
          
          <button onClick={handleDelete} className="delete-btn">
            🗑️ Delete Creator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCreator;

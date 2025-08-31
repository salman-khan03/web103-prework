import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../client.js';

const EditCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingCreator, setLoadingCreator] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreator();
  }, [id]);

  const fetchCreator = async () => {
    try {
      setLoadingCreator(true);
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setFormData({
        name: data.name || '',
        url: data.url || '',
        description: data.description || '',
        imageURL: data.image || data.imageURL || data.image_url || data.imageUrl || ''
      });
    } catch (error) {
      console.error('Error fetching creator:', error);
      setError('Failed to load creator');
    } finally {
      setLoadingCreator(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.url || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate URL format
    try {
      new URL(formData.url);
    } catch {
      setError('Please enter a valid URL for the channel');
      return;
    }

    // Validate image URL if provided
    if (formData.imageURL) {
      try {
        new URL(formData.imageURL);
      } catch {
        setError('Please enter a valid URL for the image');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Base update data without image field first
      const baseUpdateData = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim()
      };

      let { data, error } = await supabase
        .from('creators')
        .update(baseUpdateData)
        .eq('id', id)
        .select();

      if (error) throw error;

      // If successful and we have an image URL, try to update with image column
      if (formData.imageURL?.trim()) {
        const imageUrl = formData.imageURL.trim();
        const imageColumns = ['image', 'imageURL', 'image_url', 'imageUrl'];
        
        for (const column of imageColumns) {
          try {
            const imageUpdate = { [column]: imageUrl };
            
            const { error: imageError } = await supabase
              .from('creators')
              .update(imageUpdate)
              .eq('id', id);

            if (!imageError) {
              console.log(`Successfully updated image using column: ${column}`);
              break; // Success, stop trying other columns
            } else if (!imageError.message.includes(column) && !imageError.message.includes('column')) {
              // If it's not a column-related error, log and continue
              console.log(`Error with ${column}:`, imageError.message);
            }
          } catch (columnError) {
            // Continue to next column name
            console.log(`Column ${column} not available, trying next...`);
          }
        }
      }
      
      // Navigate back to creator detail page on success
      navigate(`/${id}`);
    } catch (error) {
      console.error('Error updating creator:', error);
      setError('Failed to update creator. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete creator function
  const handleDelete = async () => {
    const creatorName = formData.name || 'this creator';
    
    if (window.confirm(`Are you sure you want to delete "${creatorName}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        setError(null);

        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        // Navigate back to home page after successful deletion
        navigate('/');
      } catch (error) {
        console.error('Error deleting creator:', error);
        setError('Failed to delete creator. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loadingCreator) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading creator information...</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
            Getting the latest details for editing
          </div>
        </div>
      </div>
    );
  }

  if (error && loadingCreator) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" className="back-btn">← Back to Home</Link>
          <span style={{ margin: '0 10px' }}>or</span>
          <button 
            onClick={fetchCreator} 
            className="submit-btn"
            style={{ display: 'inline-block', margin: '0' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <Link to={`/${id}`} className="back-btn">← Back to Creator</Link>
          <h1>Edit Creator</h1>
        </div>

        <form onSubmit={handleSubmit} className="creator-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Creator Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter creator's name (e.g., MrBeast, PewDiePie)"
              required
              maxLength="100"
            />
            <small className="form-help">The name of the content creator</small>
          </div>

          <div className="form-group">
            <label htmlFor="url">Channel URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://youtube.com/@creator or https://twitch.tv/creator"
              required
            />
            <small className="form-help">Link to their YouTube, Twitch, TikTok, or other channel</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what makes this creator special, what content they create, why you recommend them..."
              rows="5"
              required
              maxLength="500"
            />
            <small className="form-help">
              Tell us about this creator ({formData.description.length}/500 characters)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="imageURL">Profile Image URL (optional)</label>
            <input
              type="url"
              id="imageURL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <small className="form-help">Link to their profile picture or channel avatar</small>
            {formData.imageURL && (
              <div className="image-preview">
                <img 
                  src={formData.imageURL} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '✏️ Updating...' : '✏️ Update Creator'}
            </button>
            <Link to={`/${id}`} className="cancel-btn">Cancel</Link>
          </div>

          {/* Delete section - separated for emphasis */}
          <div className="delete-section">
            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #dee2e6' }} />
            <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>Danger Zone</h3>
            <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.9rem' }}>
              Deleting this creator will permanently remove them from your Creatorverse. This action cannot be undone.
            </p>
            <button 
              type="button" 
              onClick={handleDelete} 
              disabled={loading}
              className="delete-btn"
              style={{ width: 'auto' }}
            >
              {loading ? '🗑️ Deleting...' : '🗑️ Delete Creator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCreator;

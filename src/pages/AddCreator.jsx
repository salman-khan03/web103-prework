import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../client.js';

const AddCreator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateURL = (urlString) => {
    try {
      const url = new URL(urlString);
      // Allow http and https protocols
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.url || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate URL format
    if (!validateURL(formData.url)) {
      setError('Please enter a valid URL for the channel (must start with http:// or https://)');
      return;
    }

    // Validate image URL if provided
    if (formData.imageURL && !validateURL(formData.imageURL)) {
      setError('Please enter a valid URL for the image (must start with http:// or https://)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create basic creator data
      const creatorData = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim()
      };

      console.log('Attempting to insert creator:', creatorData);

      // First insert without image to ensure basic functionality works
      const { data, error } = await supabase
        .from('creators')
        .insert([creatorData])
        .select();

      console.log('Basic insert response:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // If we have an image URL and basic insert worked, try to update with image
      if (data && data.length > 0 && formData.imageURL) {
        const creatorId = data[0].id;
        const imageUrl = formData.imageURL.trim();
        
        // Try different possible column names for the image
        const possibleImageColumns = ['image', 'imageURL', 'image_url', 'imageUrl'];
        let imageUpdateSuccess = false;
        
        for (const columnName of possibleImageColumns) {
          const updateData = { [columnName]: imageUrl };
          
          const { error: updateError } = await supabase
            .from('creators')
            .update(updateData)
            .eq('id', creatorId);

          if (!updateError) {
            console.log(`Successfully updated image using column: ${columnName}`);
            imageUpdateSuccess = true;
            break;
          } else {
            console.log(`Failed with column ${columnName}:`, updateError.message);
          }
        }

        if (!imageUpdateSuccess) {
          console.warn('Could not update image - no matching column found');
          // Don't fail the entire operation, just proceed without image
        }
      }

      console.log('Creator added successfully:', data);
      
      // Navigate back to home page on success
      navigate('/');
    } catch (error) {
      console.error('Error adding creator:', error);
      setError(`Failed to add creator: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" data-theme="light">
      <div className="form-container">
        <div className="form-header">
          <Link to="/" className="back-btn">← Back to All Creators</Link>
          <h1>✨ Add New Creator</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>
            Share an amazing content creator with the Creatorverse community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="creator-form">
          {error && (
            <article style={{ 
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)', 
              border: '2px solid #fca5a5',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: '#dc2626', margin: 0, fontWeight: '600' }}>
                ⚠️ {error}
              </p>
            </article>
          )}
          
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
              {loading ? '✨ Adding Creator...' : '✨ Add Creator'}
            </button>
            <Link to="/" className="cancel-btn">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddCreator;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { supabase } from '../../client.js';
import { testConnection, createSampleData, detectTableSchema } from '../utils/database.js';

const ShowCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSetupOptions, setShowSetupOptions] = useState(false);

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleCreateSampleData = async () => {
    setLoading(true);
    const success = await createSampleData();
    if (success) {
      await fetchCreators();
      setShowSetupOptions(false);
    } else {
      setError('Failed to create sample data. Please check console for details.');
    }
    setLoading(false);
  };

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to fetch creators...');
      
      // First, detect the table schema for debugging
      const schema = await detectTableSchema();
      console.log('Detected table schema:', schema);
      
      // Then try to fetch all creators
      const { data, error } = await supabase
        .from('creators')
        .select('*');

      console.log('Database response:', { data, error });
      
      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      setCreators(data || []);
      console.log('Successfully loaded creators:', data?.length || 0);
      
      // If no creators exist, show setup options
      if (!data || data.length === 0) {
        setShowSetupOptions(true);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
      
      // Provide more specific error messages
      if (error.message.includes('relation "creators" does not exist')) {
        setError('Database table "creators" not found. Please create the table first.');
      } else if (error.message.includes('permission denied')) {
        setError('Permission denied. Please check your database permissions.');
      } else if (error.message.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(`Failed to load creators: ${error.message}`);
      }
      setShowSetupOptions(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container" data-theme="light">
        <div className="loading-state">
          <article style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
            <h2>Loading Creatorverse...</h2>
            <p>Discovering amazing creators for you</p>
            <progress></progress>
          </article>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container" data-theme="light">
        <article style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchCreators} className="secondary">
            Try Again
          </button>
        </article>
      </main>
    );
  }

  return (
    <main className="container" data-theme="light">
      {/* Hero Header Section */}
      <header className="hero-header">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">✨ Creatorverse</span>
          </h1>
          <p className="hero-subtitle">
            Discover and explore amazing content creators from across the digital universe
          </p>
          <div className="hero-stats">
            <div className="stat">
              <strong>{creators.length}</strong>
              <span>Creators</span>
            </div>
            <div className="stat">
              <strong>∞</strong>
              <span>Possibilities</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/new" className="contrast" role="button">
              🚀 Add New Creator
            </Link>
          </div>
        </div>
      </header>

      {creators.length === 0 ? (
        <section className="empty-state">
          <article style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎭</div>
            <h2>Your Creatorverse Awaits!</h2>
            <p>
              No creators have been added yet. Be the first to populate your universe 
              with amazing content creators!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to="/new" role="button">
                ✨ Add Your First Creator
              </Link>
              {showSetupOptions && (
                <button 
                  onClick={handleCreateSampleData} 
                  className="secondary"
                  disabled={loading}
                >
                  🚀 Add Sample Data
                </button>
              )}
            </div>
            {error && showSetupOptions && (
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                backgroundColor: '#fee2e2', 
                border: '1px solid #fca5a5', 
                borderRadius: '8px',
                color: '#dc2626'
              }}>
                <strong>Setup Help:</strong>
                <p>{error}</p>
                <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                  If you're seeing database errors, please make sure:
                  <br />• Your Supabase project is active
                  <br />• The 'creators' table exists
                  <br />• Row Level Security is properly configured
                </p>
              </div>
            )}
          </article>
        </section>
      ) : (
        <section className="creators-section">
          <div className="section-header">
            <h2>Featured Creators</h2>
            <p>Explore our curated collection of amazing content creators</p>
          </div>
          
          <div className="creators-grid">
            {creators.map((creator) => (
              <Card key={creator.id} creator={creator} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ShowCreators;

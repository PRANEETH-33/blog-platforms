import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts?limit=3').then(({ data }) => {
      setPosts(data.posts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-tag">Blog App</div>
          <h1 className="hero-title">
            Ideas Worth<br />
            <em>Writing About</em>
          </h1>
          <p className="hero-desc">
            Discover thoughtful articles, share your perspective, and join
            a community of curious minds.
          </p>
          <div className="hero-actions">
            <Link to="/blog" className="btn btn-accent btn-lg">Explore Posts</Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">Start Writing</Link>
            )}
            {user && (
              <Link to="/create" className="btn btn-outline btn-lg">Write a Post</Link>
            )}
          </div>
        </div>
        <div className="hero-decoration">
          <div className="deco-circle c1" />
          <div className="deco-circle c2" />
          <div className="deco-line" />
        </div>
      </section>

      {/* Features strip */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">✍️</span>
              <h4>Write Freely</h4>
              <p>Simple editor, powerful publishing</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <h4>Engage & Discuss</h4>
              <p>Comments and community built-in</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <h4>Secure & Private</h4>
              <p>JWT auth, full account control</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      <section className="recent-posts container">
        <div className="section-header">
          <h2>Recent Posts</h2>
          <Link to="/blog" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Be the first to write!</p>
            <Link to={user ? '/create' : '/register'} className="btn btn-primary mt-16">
              {user ? 'Create Post' : 'Get Started'}
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to share your story?</h2>
              <p>Join Blog App and start writing today. Free forever.</p>
              <Link to="/register" className="btn btn-accent btn-lg">Create Account</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

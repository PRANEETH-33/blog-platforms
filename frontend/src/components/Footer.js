import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>✦</span>
            Blog App
          </Link>
          <p>
            A modern place to read thoughtful stories, publish ideas, and join
            conversations around every post.
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/blog">All Posts</Link>
          <Link to="/create">Write</Link>
        </div>

        <div className="footer-column">
          <h4>Topics</h4>
          <Link to="/blog">Writing</Link>
          <Link to="/blog">Design</Link>
          <Link to="/blog">Community</Link>
        </div>

        <div className="footer-column">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright {year} Blog App. All rights reserved.</span>
        <span>Built for readers and writers.</span>
      </div>
    </footer>
  );
}

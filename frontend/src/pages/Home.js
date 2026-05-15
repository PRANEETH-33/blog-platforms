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
    api.get('/posts?limit=6').then(({ data }) => {
      setPosts(data.posts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const leadPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const popularTopics = Array.from(new Set(posts.flatMap((post) => post.tags || []))).slice(0, 6);

  return (
    <div className="home">
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Independent publishing</span>
            <h1>Read deeply. Write clearly. Publish like it matters.</h1>
            <p>
              Blog App is a modern blog platform for stories, essays, updates, and community discussion.
            </p>
            <div className="hero-actions">
              <Link to="/blog" className="btn btn-primary btn-lg">Explore stories</Link>
              <Link to={user ? '/create' : '/register'} className="btn btn-outline btn-lg">
                {user ? 'Write a post' : 'Start writing'}
              </Link>
            </div>
          </div>

          <div className="hero-publication" aria-label="Featured publication preview">
            <div className="publication-header">
              <span>Blog App Weekly</span>
              <span>Curated today</span>
            </div>
            {leadPost ? (
              <Link to={`/blog/${leadPost._id}`} className="hero-story">
                {leadPost.coverImage && <img src={leadPost.coverImage} alt={leadPost.title} />}
                <div>
                  <span className="story-kicker">{leadPost.tags?.[0] || 'Featured'}</span>
                  <h2>{leadPost.title}</h2>
                  <p>{leadPost.excerpt}</p>
                  <span className="story-byline">By {leadPost.author?.name || 'Blog App writer'}</span>
                </div>
              </Link>
            ) : (
              <div className="hero-story hero-story-empty">
                <span className="story-kicker">Open call</span>
                <h2>Your next idea belongs here.</h2>
                <p>Publish the first article and set the tone for the community.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="platform-strip">
        <div className="container strip-grid">
          <div>
            <span className="strip-label">For readers</span>
            <strong>Focused article pages with comments.</strong>
          </div>
          <div>
            <span className="strip-label">For writers</span>
            <strong>Draft, publish, edit, and track posts.</strong>
          </div>
          <div>
            <span className="strip-label">For communities</span>
            <strong>Topic browsing and clean discovery.</strong>
          </div>
        </div>
      </section>

      <section className="recent-posts container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Latest from the platform</span>
            <h2>New stories</h2>
          </div>
          <Link to="/blog" className="btn btn-ghost btn-sm">View all</Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No stories have been published yet.</h3>
            <p>Be the first writer to bring the feed to life.</p>
            <Link to={user ? '/create' : '/register'} className="btn btn-primary mt-16">
              {user ? 'Create post' : 'Create account'}
            </Link>
          </div>
        ) : (
          <div className="home-content-grid">
            <div className="story-stack">
              {recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
            <aside className="topic-sidebar">
              <h3>Browse topics</h3>
              <div className="home-topics">
                {popularTopics.length > 0 ? (
                  popularTopics.map((topic) => (
                    <Link key={topic} to={`/blog`} className="topic-chip">{topic}</Link>
                  ))
                ) : (
                  <p className="text-muted">Topics appear as writers tag their stories.</p>
                )}
              </div>
              <Link to={user ? '/dashboard' : '/register'} className="sidebar-link">
                {user ? 'Open writer dashboard' : 'Join as a writer'}
              </Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

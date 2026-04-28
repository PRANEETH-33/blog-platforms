import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => {
      setPosts(data.posts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setPosts(posts.filter((p) => p._id !== id));
  };

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted mt-8">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <Link to="/create" className="btn btn-accent">+ New Post</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{posts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{posts.filter((p) => p.published).length}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalViews}</div>
            <div className="stat-label">Total Views</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user?.role}</div>
            <div className="stat-label">Account Role</div>
          </div>
        </div>

        {/* Posts table */}
        <div className="dashboard-section">
          <h2>Your Posts</h2>
          {loading ? (
            <div className="spinner" />
          ) : posts.length === 0 ? (
            <div className="empty-state text-center" style={{ padding: '48px 0' }}>
              <p className="text-muted">No posts yet.</p>
              <Link to="/create" className="btn btn-primary mt-16">Write your first post</Link>
            </div>
          ) : (
            <div className="posts-table">
              <div className="table-header">
                <span>Title</span>
                <span>Status</span>
                <span>Views</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {posts.map((post) => (
                <div key={post._id} className="table-row">
                  <span className="post-row-title">
                    <Link to={`/blog/${post._id}`}>{post.title}</Link>
                  </span>
                  <span>
                    <span className={`badge ${post.published ? 'badge-accent' : ''}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </span>
                  <span className="text-muted" style={{ fontSize: 14 }}>{post.views || 0}</span>
                  <span className="text-muted" style={{ fontSize: 13 }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="row-actions">
                    <Link to={`/edit/${post._id}`} className="btn btn-outline btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post._id)}>Del</button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

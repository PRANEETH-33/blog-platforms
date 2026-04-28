import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './PostForm.css';

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', tags: '', coverImage: '', published: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const { data } = await api.post('/posts', payload);
      navigate(`/blog/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="post-form-wrap">
          <div className="post-form-header">
            <h1>New Post</h1>
            <p className="text-muted">Share your thoughts with the world</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text" name="title" className="form-control"
                placeholder="Your post title..."
                value={form.title} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                name="content" className="form-control post-textarea"
                placeholder="Write your content here..."
                value={form.content} onChange={handleChange} required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text" name="tags" className="form-control"
                  placeholder="technology, design, web"
                  value={form.tags} onChange={handleChange}
                />
                <small className="form-hint">Comma-separated</small>
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input
                  type="url" name="coverImage" className="form-control"
                  placeholder="https://..."
                  value={form.coverImage} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-check">
              <input
                type="checkbox" id="published" name="published"
                checked={form.published} onChange={handleChange}
              />
              <label htmlFor="published">Publish immediately</label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

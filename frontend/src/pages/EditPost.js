import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './PostForm.css';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`).then(({ data }) => {
      setForm({
        title: data.title,
        content: data.content,
        tags: data.tags?.join(', ') || '',
        coverImage: data.coverImage || '',
        published: data.published,
      });
    }).catch(() => navigate('/blog'));
  }, [id, navigate]);

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
      await api.put(`/posts/${id}`, payload);
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="spinner" style={{ marginTop: 80 }} />;

  return (
    <div className="page">
      <div className="container">
        <div className="post-form-wrap">
          <div className="post-form-header">
            <h1>Edit story</h1>
            <p className="text-muted">Refine the article before readers see it.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label>Headline *</label>
              <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Story *</label>
              <textarea name="content" className="form-control post-textarea" value={form.content} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tags</label>
                <input type="text" name="tags" className="form-control" placeholder="technology, design" value={form.tags} onChange={handleChange} />
                <small className="form-hint">Comma-separated</small>
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input type="url" name="coverImage" className="form-control" placeholder="https://..." value={form.coverImage} onChange={handleChange} />
              </div>
            </div>

            <div className="form-check">
              <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} />
              <label htmlFor="published">Published</label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

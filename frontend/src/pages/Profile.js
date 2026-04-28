import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => {
      setPosts(data.posts);
      setForm({ name: data.user.name, bio: data.user.bio || '', avatar: data.user.avatar || '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(''); setError('');
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-lg">
              {form.avatar ? (
                <img src={form.avatar} alt={form.name} />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email text-muted">{user?.email}</p>
            <span className="badge mt-8" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            {form.bio && <p className="profile-bio">{form.bio}</p>}
            <div className="profile-stat">
              <strong>{posts.length}</strong> Posts Written
            </div>
          </aside>

          {/* Main */}
          <div className="profile-main">
            <div className="profile-card">
              <h3>Edit Profile</h3>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text" className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Avatar URL</label>
                  <input
                    type="url" className="form-control"
                    placeholder="https://..."
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    className="form-control"
                    placeholder="Tell us about yourself..."
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={user?.email} disabled style={{ opacity: 0.6 }} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {posts.length > 0 && (
              <div className="profile-card mt-24">
                <h3>My Posts</h3>
                <div className="profile-posts">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post._id} className="profile-post-row">
                      <Link to={`/blog/${post._id}`}>{post.title}</Link>
                      <span className="text-muted" style={{ fontSize: 13 }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
                {posts.length > 5 && (
                  <Link to="/dashboard" className="btn btn-ghost btn-sm mt-16">
                    View all posts →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

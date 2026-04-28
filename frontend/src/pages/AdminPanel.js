import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './AdminPanel.css';

export default function AdminPanel() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/posts'),
    ]).then(([s, u, p]) => {
      setStats(s.data);
      setUsers(u.data);
      setPosts(p.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
    setUsers(users.map((u) => (u._id === userId ? data : u)));
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete user and all their content?')) return;
    await api.delete(`/admin/users/${userId}`);
    setUsers(users.filter((u) => u._id !== userId));
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/admin/posts/${postId}`);
    setPosts(posts.filter((p) => p._id !== postId));
    setStats({ ...stats, posts: stats.posts - 1 });
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p className="text-muted mt-8">Platform management</p>
          </div>
          <span className="badge badge-accent">Administrator</span>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['overview', 'users', 'posts'].map((t) => (
            <button
              key={t}
              className={`admin-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && stats && (
          <div className="admin-content">
            <div className="admin-stats">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">👥</div>
                <div className="admin-stat-val">{stats.users}</div>
                <div className="admin-stat-lbl">Total Users</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">📝</div>
                <div className="admin-stat-val">{stats.posts}</div>
                <div className="admin-stat-lbl">Total Posts</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">💬</div>
                <div className="admin-stat-val">{stats.comments}</div>
                <div className="admin-stat-lbl">Total Comments</div>
              </div>
            </div>
            <div className="admin-card">
              <h3>Recent Users</h3>
              {users.slice(0, 5).map((u) => (
                <div key={u._id} className="admin-list-row">
                  <div className="author-dot">{u.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{u.email}</div>
                  </div>
                  <span className="badge" style={{ marginLeft: 'auto' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="admin-content">
            <div className="admin-card">
              <h3>{users.length} Users</h3>
              {users.map((u) => (
                <div key={u._id} className="admin-list-row">
                  <div className="author-dot">{u.name?.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                      {u.email} · {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="badge">{u.role}</span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => toggleRole(u._id, u.role)}
                  >
                    {u.role === 'admin' ? 'Demote' : 'Promote'}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(u._id)}
                  >Del</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {tab === 'posts' && (
          <div className="admin-content">
            <div className="admin-card">
              <h3>{posts.length} Posts</h3>
              {posts.map((p) => (
                <div key={p._id} className="admin-list-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                      By {p.author?.name} · {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge ${p.published ? 'badge-accent' : ''}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => deletePost(p._id)}>Del</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

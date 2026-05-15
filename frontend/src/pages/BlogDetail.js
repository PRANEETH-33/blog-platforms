import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './BlogDetail.css';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/posts/${id}`),
      api.get(`/posts/${id}/comments`),
    ]).then(([postRes, commentsRes]) => {
      setPost(postRes.data);
      setComments(commentsRes.data);
      setLoading(false);
    }).catch(() => { setLoading(false); navigate('/blog'); });
  }, [id, navigate]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/comments', { post: id, content: commentText });
      setComments([data, ...comments]);
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch {}
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/blog');
    } catch {}
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!post) return null;

  const isAuthor = user && post.author?._id === user._id;
  const isAdmin = user?.role === 'admin';
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const readMinutes = Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 220));

  return (
    <div className="page article-page">
      <div className="container">
        <article className="post-detail">
          <div className="breadcrumb">
            <Link to="/blog">Back to stories</Link>
          </div>

          <header className="post-header">
            {post.tags?.length > 0 && (
              <div className="post-tags">
                {post.tags.map((t) => <span key={t} className="badge">{t}</span>)}
              </div>
            )}
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <div className="post-author">
                <div className="author-dot lg">{post.author?.name?.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{post.author?.name || 'Blog App writer'}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-light)' }}>{date} · {readMinutes} min read</div>
                </div>
              </div>
              {(isAuthor || isAdmin) && (
                <div className="post-tools">
                  <Link to={`/edit/${post._id}`} className="btn btn-outline btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={handleDeletePost}>Delete</button>
                </div>
              )}
            </div>
          </header>

          {post.coverImage && (
            <div className="post-cover">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        </article>

        <section className="comments-section">
          <h2>Discussion <span className="text-muted" style={{ fontSize: 18 }}>({comments.length})</span></h2>

          {user ? (
            <form className="comment-form" onSubmit={handleComment}>
              {error && <div className="alert alert-error">{error}</div>}
              <textarea
                className="form-control"
                placeholder="Share your response..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post comment'}
              </button>
            </form>
          ) : (
            <div className="comment-login-prompt">
              <p className="text-muted">Sign in to join the discussion on this post.</p>
              <Link to="/login" className="btn btn-outline btn-sm">Sign in to comment</Link>
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="text-muted text-center" style={{ padding: '32px 0' }}>No comments yet. Be the first to respond.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-author">
                      <div className="author-dot">{c.author?.name?.charAt(0)}</div>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{c.author?.name}</span>
                        <span className="text-muted" style={{ fontSize: 12, marginLeft: 8 }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {(user?._id === c.author?._id || isAdmin) && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteComment(c._id)}>Delete</button>
                    )}
                  </div>
                  <p className="comment-body">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

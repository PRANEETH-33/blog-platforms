import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <Link to={`/blog/${post._id}`} className="post-card-link" aria-label={`Open ${post.title}`}>
      <article className="post-card card">
        {post.coverImage && (
          <div className="post-card-img">
            <img src={post.coverImage} alt={post.title} loading="lazy" />
          </div>
        )}
        <div className="post-card-body">
          {post.tags?.length > 0 && (
            <div className="post-card-tags">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="badge">{tag}</span>
              ))}
            </div>
          )}
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-excerpt">{post.excerpt}</p>
          <div className="post-card-action">Read and comment</div>
          <div className="post-card-meta">
            <div className="post-card-author">
              <div className="author-dot">{post.author?.name?.charAt(0)}</div>
              <span>{post.author?.name}</span>
            </div>
            <span className="text-muted" style={{ fontSize: 13 }}>{date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

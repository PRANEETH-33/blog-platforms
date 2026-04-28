import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import './BlogList.css';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (query) params.set('search', query);
    if (activeTag) params.set('tag', activeTag);
    api.get(`/posts?${params}`).then(({ data }) => {
      setPosts(data.posts);
      setTotalPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, query, activeTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveTag('');
    setQuery(search);
  };

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);
  const trendingTags = Object.entries(
    posts.reduce((acc, post) => {
      (post.tags || []).forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="page">
      <div className="container">
        <div className="blog-list-header">
          <div>
            <h1>All Posts</h1>
            {!loading && <p className="text-muted mt-8">{total} article{total !== 1 ? 's' : ''} {activeTag ? `tagged ${activeTag}` : 'published'}</p>}
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
            {query && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setQuery(''); setActiveTag(''); setPage(1); }}>
                Clear
              </button>
            )}
            {activeTag && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setActiveTag(''); setPage(1); }}>
                Clear topic
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-state text-center" style={{ padding: '80px 0' }}>
            <p style={{ fontSize: 48 }}>📄</p>
            <h3 style={{ marginTop: 16 }}>No posts found</h3>
            <p className="text-muted mt-8">Try a different search term</p>
          </div>
        ) : (
          <>
            {page === 1 && !query && !activeTag && featuredPost && (
              <section className="featured-layout">
                <Link to={`/blog/${featuredPost._id}`} className="featured-post">
                  {featuredPost.coverImage && (
                    <img src={featuredPost.coverImage} alt={featuredPost.title} />
                  )}
                  <div className="featured-copy">
                    <span className="featured-kicker">Featured story</span>
                    <h2>{featuredPost.title}</h2>
                    <p>{featuredPost.excerpt}</p>
                    <div className="featured-meta">
                      <span>{featuredPost.author?.name}</span>
                      <span>{formatDate(featuredPost.createdAt)}</span>
                    </div>
                  </div>
                </Link>

                <aside className="discover-panel">
                  <h3>Discover</h3>
                  <p>Find fresh posts by topic, then open a story to read and join the comments.</p>
                  <div className="topic-list">
                    {trendingTags.length > 0 ? (
                      trendingTags.map(([tag, count]) => (
                        <button
                          key={tag}
                          type="button"
                          className="topic-pill"
                          onClick={() => { setSearch(''); setQuery(''); setActiveTag(tag); setPage(1); }}
                        >
                          {tag} <span>{count}</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-muted">Topics appear as posts are tagged.</span>
                    )}
                  </div>
                </aside>
              </section>
            )}

            <div className="feed-header">
              <h2>{query ? 'Search results' : activeTag ? `${activeTag} stories` : 'Latest stories'}</h2>
              <span>{(page === 1 && !query && !activeTag ? regularPosts : posts).length} shown</span>
            </div>

            <div className="grid-3">
              {(page === 1 && !query && !activeTag ? regularPosts : posts).map((post) => <PostCard key={post._id} post={post} />)}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >← Prev</button>
                <span className="page-info">Page {page} of {totalPages}</span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

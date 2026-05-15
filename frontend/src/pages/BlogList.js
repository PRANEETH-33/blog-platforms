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
    setQuery(search.trim());
  };

  const clearFilters = () => {
    setSearch('');
    setQuery('');
    setActiveTag('');
    setPage(1);
  };

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);
  const feedPosts = page === 1 && !query && !activeTag ? regularPosts : posts;
  const trendingTags = Object.entries(
    posts.reduce((acc, post) => {
      (post.tags || []).forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="page browse-page">
      <div className="container">
        <header className="blog-list-header">
          <div>
            <span className="eyebrow">Explore Blog App</span>
            <h1>Stories, essays, and updates from the community.</h1>
            {!loading && (
              <p className="text-muted mt-8">
                {total} article{total !== 1 ? 's' : ''} {activeTag ? `tagged ${activeTag}` : query ? `matching "${query}"` : 'published'}
              </p>
            )}
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control"
              placeholder="Search stories"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
            {(query || activeTag) && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear
              </button>
            )}
          </form>
        </header>

        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-state text-center">
            <h3>No stories found</h3>
            <p className="text-muted mt-8">Try another search or clear the filters.</p>
          </div>
        ) : (
          <div className="browse-layout">
            <main>
              {page === 1 && !query && !activeTag && featuredPost && (
                <Link to={`/blog/${featuredPost._id}`} className="featured-post">
                  {featuredPost.coverImage && (
                    <img src={featuredPost.coverImage} alt={featuredPost.title} />
                  )}
                  <div className="featured-copy">
                    <span className="featured-kicker">Featured story</span>
                    <h2>{featuredPost.title}</h2>
                    <p>{featuredPost.excerpt}</p>
                    <div className="featured-meta">
                      <span>{featuredPost.author?.name || 'Blog App writer'}</span>
                      <span>{formatDate(featuredPost.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="feed-header">
                <h2>{query ? 'Search results' : activeTag ? `${activeTag} stories` : 'Latest stories'}</h2>
                <span>{feedPosts.length} shown</span>
              </div>

              <div className="feed-list">
                {feedPosts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                  >Previous</button>
                  <span className="page-info">Page {page} of {totalPages}</span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                  >Next</button>
                </div>
              )}
            </main>

            <aside className="discover-panel">
              <h3>Topics</h3>
              <p>Jump into a subject and keep the feed focused.</p>
              <div className="topic-list">
                {trendingTags.length > 0 ? (
                  trendingTags.map(([tag, count]) => (
                    <button
                      key={tag}
                      type="button"
                      className={`topic-pill ${activeTag === tag ? 'active' : ''}`}
                      onClick={() => { setSearch(''); setQuery(''); setActiveTag(tag); setPage(1); }}
                    >
                      {tag} <span>{count}</span>
                    </button>
                  ))
                ) : (
                  <span className="text-muted">Topics appear as posts are tagged.</span>
                )}
              </div>
              <div className="reader-note">
                <strong>Reader mode</strong>
                <p>Open any story to read without clutter and join the comments below the article.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

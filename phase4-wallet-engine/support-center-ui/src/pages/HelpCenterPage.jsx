import { useMemo, useState } from 'react';
import ChatbotPanel from '../components/ChatbotPanel.jsx';

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }
  return date.toLocaleString();
};

export default function HelpCenterPage({ payload, onSearch, onHelpfulVote, onAskChatbot, onOpenSubmitCase }) {
  const [query, setQuery] = useState(payload?.search || '');

  const categories = useMemo(() => payload?.categories || [], [payload]);
  const articles = useMemo(() => payload?.all_topics || [], [payload]);
  const topArticles = useMemo(() => payload?.top_articles || [], [payload]);
  const startNow = useMemo(() => payload?.start_now || [], [payload]);

  return (
    <section className="page-grid">
      <div className="page-main">
        <article className="card card-search">
          <h1>Need help? Ask me anything</h1>
          <div className="search-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search help articles"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onSearch(query);
                }
              }}
            />
            <button type="button" className="accent-btn" onClick={() => onSearch(query)}>
              Search
            </button>
          </div>
        </article>

        <article className="card">
          <h2>Start Now</h2>
          <div className="topic-grid">
            {startNow.map((item, index) => (
              <div key={`${item.title}-${index}`} className="topic-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Top Articles</h2>
          <div className="article-list">
            {topArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-top">
                  <h3>{article.title}</h3>
                  <span>Updated {formatDateTime(article.updated_at)}</span>
                </div>
                <p>{article.excerpt}</p>
                <div className="article-actions">
                  <button type="button" className="ghost-btn" onClick={() => onHelpfulVote(article.id, true)}>
                    Helpful
                  </button>
                  <button type="button" className="ghost-btn" onClick={() => onHelpfulVote(article.id, false)}>
                    Not helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>All Topics</h2>
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id || category.slug} className="category-card">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <small>{category.article_count || 0} article(s)</small>
              </div>
            ))}
          </div>

          <div className="article-list">
            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-top">
                  <h3>{article.title}</h3>
                  <span>{article.category_title || 'General'}</span>
                </div>
                <p>{article.excerpt || 'Detailed troubleshooting and support workflow.'}</p>
                <div className="article-meta-row">
                  <span>Last updated: {formatDateTime(article.updated_at)}</span>
                  <span>Helpful: {article.helpful_count || 0}</span>
                </div>
                <div className="article-actions">
                  <button type="button" className="ghost-btn" onClick={() => onHelpfulVote(article.id, true)}>
                    Helpful
                  </button>
                  <button type="button" className="ghost-btn" onClick={() => onHelpfulVote(article.id, false)}>
                    Not helpful
                  </button>
                  <button type="button" className="ghost-btn" onClick={onOpenSubmitCase}>
                    Submit Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <ChatbotPanel onAskChatbot={onAskChatbot} onCreateTicket={onOpenSubmitCase} />
    </section>
  );
}


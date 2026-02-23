import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNews } from '../hooks/useNews';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

const NewsSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-10 w-64 rounded" />
    <div className="flex gap-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-full" />
      ))}
    </div>
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  </div>
);

const IMPACT_CONFIG = {
  bullish: { label: 'Bullish', variant: 'green', icon: '📈' },
  bearish: { label: 'Bearish', variant: 'red', icon: '📉' },
  neutral: { label: 'Neutral', variant: 'secondary', icon: '➡️' },
};

const CATEGORY_ICONS = {
  Economic: '💹',
  Geopolitical: '🌍',
  Political: '🏛️',
  'Stock Market': '📊',
  Trends: '🚀',
  Commodities: '⛏️',
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const NewsCard = ({ article, index }) => {
  const impact = IMPACT_CONFIG[article.impact] || IMPACT_CONFIG.neutral;
  const categoryIcon = CATEGORY_ICONS[article.category] || '📰';

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover block cursor-pointer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-1 flex-shrink-0">{categoryIcon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary">{article.category}</Badge>
            <Badge variant={impact.variant}>
              {impact.icon} {impact.label}
            </Badge>
            <span className="text-text-muted text-xs ml-auto flex-shrink-0">
              {formatDate(article.published_at)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            {article.summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-text-muted bg-primary-hover px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-text-muted flex-shrink-0 ml-2">
              {article.source} ↗
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

const News = () => {
  const { news, loading, error, categories } = useNews();
  const [activeCategory, setActiveCategory] = useState('All');

  if (loading) return <NewsSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading news: {error}</div>
      </div>
    );
  }

  const filteredNews =
    activeCategory === 'All'
      ? news
      : news.filter((article) => article.category === activeCategory);

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? news.length : news.filter((a) => a.category === cat).length;
    return acc;
  }, {});

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Market News Digest</h1>
        <p className="text-text-secondary">
          Stay informed with the latest economic, geopolitical, and market-moving news impacting US
          stock markets.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30'
                : 'bg-primary-hover text-text-secondary hover:text-text-primary hover:bg-primary-border'
            }`}
          >
            {cat !== 'All' && (
              <span className="mr-1.5">{CATEGORY_ICONS[cat]}</span>
            )}
            {cat}
            <span className="ml-1.5 text-xs opacity-70">({categoryCounts[cat]})</span>
          </button>
        ))}
      </div>

      {/* News List */}
      {filteredNews.length > 0 ? (
        <div className="space-y-4">
          {filteredNews.map((article, idx) => (
            <NewsCard key={article.id} article={article} index={idx} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-secondary">No news articles in this category.</p>
        </div>
      )}

      {/* Disclaimer */}
      <section className="card bg-primary-hover border-accent-yellow/30">
        <div className="flex items-start space-x-3">
          <span className="text-accent-yellow text-xl">⚠️</span>
          <p className="text-text-secondary text-sm leading-relaxed">
            <strong className="text-text-primary">Disclaimer:</strong> News articles link to
            external sources. Alpha Oracle does not guarantee the accuracy of third-party content.
            Always verify information before making investment decisions.
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default News;

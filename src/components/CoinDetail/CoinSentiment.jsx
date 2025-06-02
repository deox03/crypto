import React from 'react';
import styles from './CoinSentiment.module.css';

const CoinSentiment = ({ data }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  const getSentimentClass = (score) => {
    if (score >= 70) return styles.veryPositive;
    if (score >= 55) return styles.positive;
    if (score >= 45) return styles.neutral;
    if (score >= 30) return styles.negative;
    return styles.veryNegative;
  };

  return (
    <div className={styles.sentimentContainer}>
      <h2 className={styles.title}>Bazar Əhval-Ruhiyyəsi</h2>
      
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>
            Sosial Media Aktivliyi
            <span className={styles.tooltip}>
              Son 24 saat ərzində sosial media platformalarında müzakirə sayı
            </span>
          </div>
          <div className={styles.metricValue}>
            <div className={styles.socialMetrics}>
              <div className={styles.socialMetric}>
                <span>Twitter</span>
                <span>{formatNumber(data.twitter_followers)}</span>
              </div>
              <div className={styles.socialMetric}>
                <span>Reddit</span>
                <span>{formatNumber(data.reddit_subscribers)}</span>
              </div>
              <div className={styles.socialMetric}>
                <span>Telegram</span>
                <span>{formatNumber(data.telegram_channel_user_count || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>
            Bazar Əhval-Ruhiyyə Göstəricisi
            <span className={styles.tooltip}>
              Texniki analiz və bazar göstəricilərinə əsaslanan sentiment skoru
            </span>
          </div>
          <div className={styles.metricValue}>
            <div className={`${styles.sentimentScore} ${getSentimentClass(data.sentiment_votes_up_percentage)}`}>
              {data.sentiment_votes_up_percentage?.toFixed(1)}%
            </div>
            <div className={styles.sentimentBar}>
              <div 
                className={styles.sentimentFill}
                style={{ width: `${data.sentiment_votes_up_percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>
            Developer Aktivliyi
            <span className={styles.tooltip}>
              GitHub repository aktivliyi və developer statistikaları
            </span>
          </div>
          <div className={styles.metricValue}>
            <div className={styles.devMetrics}>
              <div className={styles.devMetric}>
                <span>Stars</span>
                <span>{formatNumber(data.developer_data?.stars || 0)}</span>
              </div>
              <div className={styles.devMetric}>
                <span>Forks</span>
                <span>{formatNumber(data.developer_data?.forks || 0)}</span>
              </div>
              <div className={styles.devMetric}>
                <span>Contributors</span>
                <span>{formatNumber(data.developer_data?.pull_request_contributors || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinSentiment; 
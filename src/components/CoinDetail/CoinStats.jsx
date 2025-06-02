import React from 'react';
import styles from './CoinStats.module.css';

const CoinStats = ({ data }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatPercentage = (value) => {
    if (!value) return '0.00%';
    return value.toFixed(2) + '%';
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return value.toLocaleString();
  };

  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.title}>{data.name} Statistikaları</h2>
      
      <div className={styles.statsList}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Ən Yüksək (24s)</div>
          <div className={styles.statValue}>
            {formatPrice(data.market_data.high_24h.usd)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Ən Aşağı (24s)</div>
          <div className={styles.statValue}>
            {formatPrice(data.market_data.low_24h.usd)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Dəyişim (24s)</div>
          <div className={`${styles.statValue} ${data.market_data.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}`}>
            {formatPercentage(data.market_data.price_change_percentage_24h)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Dəyişim (7g)</div>
          <div className={`${styles.statValue} ${data.market_data.price_change_percentage_7d >= 0 ? styles.positive : styles.negative}`}>
            {formatPercentage(data.market_data.price_change_percentage_7d)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Dəyişim (30g)</div>
          <div className={`${styles.statValue} ${data.market_data.price_change_percentage_30d >= 0 ? styles.positive : styles.negative}`}>
            {formatPercentage(data.market_data.price_change_percentage_30d)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Dəyişim (1il)</div>
          <div className={`${styles.statValue} ${data.market_data.price_change_percentage_1y >= 0 ? styles.positive : styles.negative}`}>
            {formatPercentage(data.market_data.price_change_percentage_1y)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Ümumi Təklif</div>
          <div className={styles.statValue}>
            {formatNumber(data.market_data.total_supply)} {data.symbol.toUpperCase()}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Dolaşımda</div>
          <div className={styles.statValue}>
            {formatNumber(data.market_data.circulating_supply)} {data.symbol.toUpperCase()}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Tarixi Ən Yüksək</div>
          <div className={styles.statValue}>
            {formatPrice(data.market_data.ath.usd)}
            <span className={`${styles.athDate} ${data.market_data.ath_change_percentage.usd >= 0 ? styles.positive : styles.negative}`}>
              {formatPercentage(data.market_data.ath_change_percentage.usd)}
            </span>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Tarixi Ən Aşağı</div>
          <div className={styles.statValue}>
            {formatPrice(data.market_data.atl.usd)}
            <span className={`${styles.atlDate} ${data.market_data.atl_change_percentage.usd >= 0 ? styles.positive : styles.negative}`}>
              {formatPercentage(data.market_data.atl_change_percentage.usd)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinStats; 
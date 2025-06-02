import React from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './CoinHeader.module.css';

const CoinHeader = ({ data }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatMarketCap = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatChange = (change) => {
    if (!change) return '0.00%';
    return change.toFixed(2) + '%';
  };

  const priceChange24h = data.market_data?.price_change_percentage_24h || 0;

  return (
    <div className={styles.header}>
      <div className={styles.mainInfo}>
        <div className={styles.titleSection}>
          <img src={data.image.large} alt={data.name} className={styles.coinIcon} />
          <div className={styles.titleInfo}>
            <h1>{data.name} <span className={styles.symbol}>{data.symbol.toUpperCase()}</span></h1>
            <div className={styles.rank}>Rank #{data.market_cap_rank}</div>
          </div>
          <button className={styles.watchlistButton}>
            <FaStar /> İzlə
          </button>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.currentPrice}>
            {formatPrice(data.market_data.current_price.usd)}
          </div>
          <div className={`${styles.priceChange} ${priceChange24h >= 0 ? styles.positive : styles.negative}`}>
            {priceChange24h >= 0 ? '▲' : '▼'} {formatChange(priceChange24h)}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Market Cap</div>
          <div className={styles.statValue}>
            {formatMarketCap(data.market_data.market_cap.usd)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>24s Həcm</div>
          <div className={styles.statValue}>
            {formatMarketCap(data.market_data.total_volume.usd)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Dolaşımda</div>
          <div className={styles.statValue}>
            {data.market_data.circulating_supply.toLocaleString()} {data.symbol.toUpperCase()}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Maksimum Təklif</div>
          <div className={styles.statValue}>
            {data.market_data.max_supply 
              ? `${data.market_data.max_supply.toLocaleString()} ${data.symbol.toUpperCase()}`
              : '∞'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinHeader; 
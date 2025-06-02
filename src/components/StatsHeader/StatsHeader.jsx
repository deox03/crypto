import React from 'react';
import styles from './StatsHeader.module.css';

const StatsHeader = () => {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statItem}>
        <span className={styles.label}>Cryptos</span>
        <span className={styles.value}>17,195</span>
      </div>

      <div className={styles.statItem}>
        <span className={styles.label}>Exchanges</span>
        <span className={styles.value}>1,274</span>
      </div>

      <div className={styles.statItem}>
        <span className={styles.label}>Market Cap</span>
        <span className={styles.value}>$3.57T</span>
      </div>

      <div className={styles.statItem}>
        <span className={styles.label}>24h Vol</span>
        <span className={styles.value}>$130.55B</span>
      </div>

      <div className={styles.statItem}>
        <span className={styles.label}>Dominance</span>
        <div className={styles.dominanceValues}>
          <span>BTC: 61.1%</span>
          <span>ETH: 8.7%</span>
        </div>
      </div>

      <div className={styles.statItem}>
        <span className={styles.label}>Gas</span>
        <span className={styles.value}>30 Gwei</span>
      </div>

      <div className={styles.statItem}>
        <span className={styles.label}>Fear & Greed</span>
        <span className={styles.value}>50/100</span>
      </div>
    </div>
  );
};

export default StatsHeader; 
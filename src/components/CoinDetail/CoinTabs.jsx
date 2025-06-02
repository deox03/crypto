import React, { useState } from 'react';
import styles from './CoinTabs.module.css';

const CoinTabs = ({ coinId, data }) => {
  const [activeTab, setActiveTab] = useState('markets');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const renderMarkets = () => {
    return (
      <div className={styles.marketsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.exchange}>Birja</div>
          <div className={styles.pair}>Cüt</div>
          <div className={styles.price}>Qiymət</div>
          <div className={styles.spread}>Spread</div>
          <div className={styles.volume24h}>24s Həcm</div>
        </div>
        <div className={styles.tableBody}>
          {data.tickers?.slice(0, 10).map((ticker, index) => (
            <div key={index} className={styles.tableRow}>
              <div className={styles.exchange}>{ticker.market.name}</div>
              <div className={styles.pair}>{ticker.base}/{ticker.target}</div>
              <div className={styles.price}>{formatPrice(ticker.last)}</div>
              <div className={styles.spread}>
                {((ticker.ask - ticker.bid) / ticker.ask * 100).toFixed(2)}%
              </div>
              <div className={styles.volume24h}>
                {formatVolume(ticker.volume)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAbout = () => {
    return (
      <div className={styles.aboutSection}>
        <div className={styles.description} 
          dangerouslySetInnerHTML={{ __html: data.description?.az || data.description?.en }} 
        />
        
        <div className={styles.links}>
          <h3>Faydalı Linklər</h3>
          <div className={styles.linkGrid}>
            {data.links?.homepage?.[0] && (
              <a href={data.links.homepage[0]} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Rəsmi Vebsayt
              </a>
            )}
            {data.links?.blockchain_site?.filter(Boolean).map((site, index) => (
              <a key={index} href={site} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Explorer {index + 1}
              </a>
            ))}
            {data.links?.official_forum_url?.filter(Boolean).map((forum, index) => (
              <a key={index} href={forum} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Forum {index + 1}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabButtons}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'markets' ? styles.active : ''}`}
          onClick={() => setActiveTab('markets')}
        >
          Piyasalar
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'about' ? styles.active : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Haqqında
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'markets' && renderMarkets()}
        {activeTab === 'about' && renderAbout()}
      </div>
    </div>
  );
};

export default CoinTabs; 
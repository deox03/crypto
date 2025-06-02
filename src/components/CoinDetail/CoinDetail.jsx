import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './CoinDetail.module.css';
import CoinHeader from './CoinHeader';
import CoinChart from './CoinChart';
import CoinStats from './CoinStats';
import CoinTabs from './CoinTabs';
import CoinSentiment from './CoinSentiment';

const CoinDetail = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('24h');

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch basic coin data
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=false&sparkline=true`
        );

        setCoinData(response.data);
      } catch (err) {
        setError('Məlumatları yükləyərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
        console.error('Error fetching coin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
    // Hər 30 saniyədən bir yenilənir
    const interval = setInterval(fetchCoinData, 30000);
    return () => clearInterval(interval);
  }, [coinId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>Məlumatlar yüklənir...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <span>⚠️</span>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Yenidən cəhd et
          </button>
        </div>
      </div>
    );
  }

  if (!coinData) return null;

  return (
    <div className={styles.coinDetailContainer}>
      <CoinHeader data={coinData} />
      
      <div className={styles.mainContent}>
        <div className={styles.chartSection}>
          <CoinChart 
            coinId={coinId}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </div>

        <div className={styles.statsSection}>
          <CoinStats data={coinData} />
        </div>
      </div>

      <CoinTabs 
        coinId={coinId}
        data={coinData}
      />

      <div className={styles.sentimentSection}>
        <CoinSentiment data={coinData} />
      </div>
    </div>
  );
};

export default CoinDetail; 
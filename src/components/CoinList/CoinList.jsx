import React, { useState, useEffect } from 'react';
import { getCoinList } from '../../services/api';
import CoinItem from '../CoinItem/CoinItem';
import styles from './CoinList.module.css';

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  // Load and sync watchlist
  useEffect(() => {
    const loadWatchlist = () => {
      const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setWatchlist(savedWatchlist);
    };

    // Initial load
    loadWatchlist();

    // Listen for storage changes
    window.addEventListener('storage', loadWatchlist);
    document.addEventListener('watchlistUpdated', loadWatchlist);

    return () => {
      window.removeEventListener('storage', loadWatchlist);
      document.removeEventListener('watchlistUpdated', loadWatchlist);
    };
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCoinList();
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        setCoins(data);
      } catch (err) {
        console.error('Error fetching coins:', err);
        setError('Məlumatları yükləyərkən xəta baş verdi. Zəhmət olmasa səhifəni yeniləyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    // Hər 1 dəqiqədə yenilənir
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleWatchlistUpdate = (updatedCoin) => {
    const currentWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const isInWatchlist = currentWatchlist.some(coin => coin.id === updatedCoin.id);
    
    let newWatchlist;
    if (isInWatchlist) {
      newWatchlist = currentWatchlist.filter(coin => coin.id !== updatedCoin.id);
    } else {
      newWatchlist = [...currentWatchlist, updatedCoin];
    }
    
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);
    
    // Trigger events for other components
    window.dispatchEvent(new Event('storage'));
    document.dispatchEvent(new Event('watchlistUpdated'));
  };

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

  return (
    <div className={styles.coinList}>
      <div className={styles.header}>
        <div className={styles.star}></div>
        <div className={styles.rank}>#</div>
        <div className={styles.name}>Ad</div>
        <div className={styles.price}>Qiymət</div>
        <div className={styles.change24h}>24s %</div>
        <div className={styles.marketCap}>Bazar Dəyəri</div>
        <div className={styles.volume}>Həcm(24s)</div>
      </div>
      {coins && coins.length > 0 && coins.map(coin => (
        <CoinItem 
          key={coin.id} 
          coin={coin}
          onWatchlistUpdate={handleWatchlistUpdate}
          isWatchlisted={watchlist.some(item => item.id === coin.id)}
        />
      ))}
    </div>
  );
};

export default CoinList; 
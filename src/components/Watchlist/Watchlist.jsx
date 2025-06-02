import React, { useState, useEffect } from 'react';
import { FaStar, FaSearch, FaChevronRight } from 'react-icons/fa';
import styles from './Watchlist.module.css';
import { getCoinList } from '../../services/api';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCoins, setAllCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [activeTab, setActiveTab] = useState('Tümü');

  // Load watchlist from localStorage
  useEffect(() => {
    const loadWatchlist = () => {
      const savedWatchlist = localStorage.getItem('watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    };

    // Initial load
    loadWatchlist();

    // Listen for storage changes from other components
    window.addEventListener('storage', loadWatchlist);
    
    return () => {
      window.removeEventListener('storage', loadWatchlist);
    };
  }, []);

  // Fetch all coins
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const coins = await getCoinList();
        setAllCoins(coins);
        setFilteredCoins(coins.filter(coin => !watchlist.some(w => w.id === coin.id)));
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, [watchlist]); // Re-fetch when watchlist changes

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = allCoins.filter(coin =>
      (coin.name.toLowerCase().includes(query.toLowerCase()) ||
       coin.symbol.toLowerCase().includes(query.toLowerCase())) &&
      !watchlist.some(w => w.id === coin.id) // Filter out already watchlisted coins
    );
    setFilteredCoins(filtered);
  };

  const toggleWatchlist = (coin) => {
    const newWatchlist = [...watchlist, coin];
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    
    // Trigger storage event manually for other components
    window.dispatchEvent(new Event('storage'));
    
    // Reset search and close modal
    setSearchQuery('');
    setFilteredCoins(allCoins.filter(c => !newWatchlist.some(w => w.id === c.id)));
    setShowAddModal(false);
  };

  const removeFromWatchlist = (coinId) => {
    const newWatchlist = watchlist.filter(coin => coin.id !== coinId);
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    
    // Trigger storage event manually for other components
    window.dispatchEvent(new Event('storage'));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatMarketCap = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSearchQuery(''); // Reset search when modal closes
    setFilteredCoins(allCoins.filter(coin => !watchlist.some(w => w.id === coin.id))); // Reset filtered coins
  };

  return (
    <div className={styles.watchlistContainer}>
      <div className={styles.header}>
        <h1>Watchlist</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          + Add New Asset
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className={styles.emptyState}>
          <FaStar className={styles.emptyIcon} />
          <h2>Your Watchlist is Empty</h2>
          <p>Add cryptocurrencies to your watchlist to track their performance</p>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            + Add New Asset
          </button>
        </div>
      ) : (
        <div className={styles.watchlistTable}>
          <div className={styles.tableHeader}>
            <div className={styles.star}></div>
            <div className={styles.name}>Ad</div>
            <div className={styles.price}>Fiyat</div>
            <div className={styles.change24h}>24s %</div>
            <div className={styles.marketCap}>Piyasa Değeri</div>
            <div className={styles.volume}>Hacim(24s)</div>
          </div>
          {watchlist.map(coin => (
            <div key={coin.id} className={styles.coinRow}>
              <div className={styles.star}>
                <FaStar 
                  className={styles.starIcon} 
                  onClick={() => removeFromWatchlist(coin.id)}
                />
              </div>
              <div className={styles.name}>
                <img src={coin.image} alt={coin.name} />
                <span>{coin.name}</span>
                <span className={styles.symbol}>{coin.symbol.toUpperCase()}</span>
              </div>
              <div className={styles.price}>{formatPrice(coin.current_price)}</div>
              <div className={`${styles.change24h} ${coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
              </div>
              <div className={styles.marketCap}>{formatMarketCap(coin.market_cap)}</div>
              <div className={styles.volume}>{formatMarketCap(coin.total_volume)}</div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add New Asset</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
              />
              <FaSearch className={styles.searchIcon} />
            </div>

            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'Tümü' ? styles.active : ''}`}
                onClick={() => setActiveTab('Tümü')}
              >
                Tümü
              </button>
              <button 
                className={`${styles.tab} ${activeTab === "Coin'ler" ? styles.active : ''}`}
                onClick={() => setActiveTab("Coin'ler")}
              >
                Coin'ler
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'Çiftler' ? styles.active : ''}`}
                onClick={() => setActiveTab('Çiftler')}
              >
                Çiftler
              </button>
            </div>

            <div className={styles.coinList}>
              {filteredCoins.map(coin => (
                <div 
                  key={coin.id} 
                  className={styles.coinListItem}
                  onClick={() => toggleWatchlist(coin)}
                >
                  <div className={styles.coinInfo}>
                    <img src={coin.image} alt={coin.name} />
                    <span className={styles.coinName}>{coin.name}</span>
                    <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
                  </div>
                  <div className={styles.addIcon}>
                    <FaChevronRight />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist; 
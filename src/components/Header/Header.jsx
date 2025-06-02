import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGlobalStats, getCoinList } from '../../services/api';
import styles from './Header.module.css';
import DropdownMenu from './DropdownMenu';
import ProfileDrawer from '../ProfileDrawer/ProfileDrawer';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allCoins, setAllCoins] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownMenus = {
    cryptocurrencies: {
      title: "Cryptocurrencies",
      sections: {
        "CRYPTOCURRENCIES": ["Ranking", "Categories", "Historical Snapshots", "Token Unlocks", "Yield"],
        "LEADERBOARDS": ["Trending", "Recently Added", "Gainers & Losers", "Most Visited", "Community Sentiment"],
        "MARKET OVERVIEW": ["Market Overview", "CMC 100 Index", "Fear & Greed Index", "Bitcoin Dominance", "Crypto ETFs"],
        "NFT": ["Overall NFT Stats", "Upcoming Sales"]
      }
    },
    dexscan: {
      title: "DexScan",
      sections: {
        "DexScan": ["Signals", "New Pairs", "Trending Pairs", "Meme Explorer", "Gainers & Losers", "Community Votes", "Top Traders"]
      }
    },
    exchanges: {
      title: "Exchanges",
      sections: {
        "CENTRALIZED EXCHANGES": ["Spot", "Derivatives"],
        "DECENTRALIZED EXCHANGES": ["Spot", "Derivatives"]
      }
    },
    community: {
      title: "Community",
      sections: {
        "Community": ["Feeds", "Topics", "Lives", "Articles", "Sentiment"]
      }
    }
  };

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const data = await getGlobalStats();
        setGlobalStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching global stats:', error);
        setLoading(false);
      }
    };

    fetchGlobalStats();
    const interval = setInterval(fetchGlobalStats, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoinList();
        if (Array.isArray(data)) {
          setAllCoins(data);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 10));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, allCoins]);

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setSearchQuery(value);
    }
  };

  const handleClickOutside = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const handleCoinClick = (coinId) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/coins/${coinId}`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const formatNumber = (value, suffix = '') => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T${suffix}`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B${suffix}`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M${suffix}`;
    return value.toLocaleString();
  };

  return (
    <>
      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statsContainer}>
          {!loading && globalStats?.data ? (
            <>
              <span>
                Cryptos <strong>{formatNumber(globalStats.data.active_cryptocurrencies || 0)}</strong>
              </span>
              <span>
                Exchanges <strong>{formatNumber(globalStats.data.markets || 0)}</strong>
              </span>
              <span>
                Market Cap <strong>${formatNumber(globalStats.data.total_market_cap?.usd || 0)}</strong>
              </span>
              <span>
                24h Vol <strong>${formatNumber(globalStats.data.total_volume?.usd || 0)}</strong>
              </span>
              <span>
                Dominance <strong>BTC: {(globalStats.data.market_cap_percentage?.btc || 0).toFixed(1)}% ETH: {(globalStats.data.market_cap_percentage?.eth || 0).toFixed(1)}%</strong>
              </span>
              {globalStats.gas?.SafeGasPrice && (
                <span>
                  Gas <strong>{globalStats.gas.SafeGasPrice} Gwei</strong>
                </span>
              )}
              {globalStats.fear_greed?.value && (
                <span>
                  Fear & Greed <strong>{globalStats.fear_greed.value}/100</strong>
                </span>
              )}
            </>
          ) : (
            <span className={styles.loading}>Loading market data...</span>
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className={styles.header}>
        <div className={styles.navBar}>
          <div className={styles.left}>
            <Link to="/" className={styles.logo}>
              CryptoVerse <span className={styles.dot}></span>
            </Link>
            <nav className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
              {Object.entries(dropdownMenus).map(([key, menu]) => (
                <DropdownMenu 
                  key={key}
                  title={menu.title}
                  sections={menu.sections}
                />
              ))}
              <Link to="/portfolio" className={styles.portfolioLink} onClick={handleMobileNavClick}>Portfolio</Link>
              <Link to="/converter" className={styles.portfolioLink} onClick={handleMobileNavClick}>Converter</Link>
            </nav>
          </div>

          <div className={styles.right}>
            <Link to="/watchlist" className={styles.icon} onClick={handleMobileNavClick}>
              <span>⭐</span> Watchlist
            </Link>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.search}
                placeholder="Search assets..."
                value={searchQuery}
                onChange={handleSearch}
                onBlur={handleClickOutside}
                maxLength={15}
              />
              <FaSearch className={styles.searchIcon} />
              {showResults && searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {searchResults.map(coin => (
                    <div
                      key={coin.id}
                      className={styles.searchResultItem}
                      onClick={() => handleCoinClick(coin.id)}
                    >
                      <img src={coin.image} alt={coin.name} />
                      <div className={styles.coinInfo}>
                        <span className={styles.coinName}>{coin.name}</span>
                        <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <ProfileDrawer />
            <button className={styles.menu} onClick={toggleMobileMenu}>☰</button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && <div className={styles.mobileMenuOverlay} onClick={toggleMobileMenu} />}
    </>
  );
};

export default Header;
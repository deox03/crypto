import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './CoinItem.module.css';

const CoinItem = ({ coin, onWatchlistUpdate, isWatchlisted }) => {
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/coins/${coin.id}`);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    onWatchlistUpdate(coin);
  };

  return (
    <div className={styles.coinItem} onClick={handleClick}>
      <div className={styles.star}>
        <FaStar 
          className={`${styles.starIcon} ${isWatchlisted ? styles.active : ''}`}
          onClick={handleWatchlistClick}
        />
      </div>
      <div className={styles.rank}>{coin.market_cap_rank}</div>
      <div className={styles.name}>
        <img src={coin.image} alt={coin.name} />
        <span>{coin.name}</span>
        <span className={styles.symbol}>{coin.symbol.toUpperCase()}</span>
      </div>
      <div className={styles.price}>{formatPrice(coin.current_price)}</div>
      <div className={`${styles.change24h} ${coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}`}>
        {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
      </div>
      <div className={styles.marketCap}>{formatMarketCap(coin.market_cap)}</div>
      <div className={styles.volume}>{formatMarketCap(coin.total_volume)}</div>
    </div>
  );
};

export default CoinItem;
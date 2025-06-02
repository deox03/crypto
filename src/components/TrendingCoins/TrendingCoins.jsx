import React from 'react';
import styles from './TrendingCoins.module.css';
import { Line } from 'react-chartjs-2';

const TrendingCoins = ({ coins }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  const getMockChartData = () => ({
    labels: Array.from({ length: 20 }, (_, i) => i.toString()),
    datasets: [
      {
        data: Array.from({ length: 20 }, () => Math.random() * 100),
        borderColor: '#02c076',
        tension: 0.4,
        fill: false,
      },
    ],
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Trending Coins</h2>
      </div>
      
      <div className={styles.coinList}>
        {coins.map((coin, index) => (
          <div key={coin.id} className={styles.coinItem}>
            <span className={styles.rank}>{index + 1}</span>
            
            <div className={styles.coinInfo}>
              <img 
                src={coin.iconUrl} 
                alt={coin.name} 
                className={styles.coinIcon}
              />
              <span className={styles.coinName}>
                {coin.name}
                <span className={styles.coinSymbol}>{coin.symbol}</span>
              </span>
            </div>
            
            <div className={styles.priceInfo}>
              <span className={styles.price}>
                ${typeof coin.price === 'number' 
                  ? coin.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8
                    })
                  : coin.price}
              </span>
              
              <span className={`${styles.change} ${coin.priceChange < 0 ? styles.negative : ''}`}>
                {coin.priceChange > 0 ? '+' : ''}{coin.priceChange}%
              </span>
              
              <div className={styles.miniChart}>
                <Line data={getMockChartData()} options={chartOptions} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCoins; 
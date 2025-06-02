import React, { useEffect, useRef } from 'react';
import styles from './CoinChart.module.css';

const timeframes = [
  { label: '24s', value: '1D' },
  { label: '7G', value: '7D' },
  { label: '1A', value: '1M' },
  { label: '3A', value: '3M' },
  { label: '1İl', value: '1Y' },
  { label: 'Hamısı', value: 'ALL' }
];

// Trading simvollarını çevirmək üçün funksiya
const getTradeSymbol = (coinId) => {
  const symbolMap = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'ripple': 'XRP',
    'cardano': 'ADA',
    'dogecoin': 'DOGE',
    'polkadot': 'DOT',
    'binancecoin': 'BNB',
    'solana': 'SOL',
    'tron': 'TRX',
    'litecoin': 'LTC',
    'chainlink': 'LINK',
    'stellar': 'XLM',
    'avalanche-2': 'AVAX',
    'uniswap': 'UNI',
    'wrapped-bitcoin': 'WBTC',
    'matic-network': 'MATIC',
    'cosmos': 'ATOM',
    'monero': 'XMR',
    'tezos': 'XTZ',
    'bitcoin-cash': 'BCH'
  };
  
  return symbolMap[coinId] || coinId.toUpperCase();
};

const CoinChart = ({ coinId, timeframe, onTimeframeChange }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // TradingView Widget script-ini əlavə edirik
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        // Əvvəlki widget-i təmizləyirik
        containerRef.current.innerHTML = '';

        // Coin simvolunu qısa formata çeviririk
        const symbol = getTradeSymbol(coinId);
        
        // Yeni TradingView widget-ini yaradırıq
        new window.TradingView.widget({
          container_id: 'tradingview-widget',
          width: '100%',
          height: 400,
          symbol: `BINANCE:${symbol}USDT`,
          interval: timeframe === 'max' ? 'W' : 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          studies: ['RSI@tv-basicstudies'],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          hide_volume: false,
        });
      }
    };

    return () => {
      // Component unmount olduqda script-i təmizləyirik
      document.body.removeChild(script);
    };
  }, [coinId, timeframe]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.timeframeButtons}>
        {timeframes.map(tf => (
          <button
            key={tf.value}
            className={`${styles.timeframeButton} ${timeframe === tf.value ? styles.active : ''}`}
            onClick={() => onTimeframeChange(tf.value)}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div id="tradingview-widget" ref={containerRef} className={styles.chart} />
    </div>
  );
};

export default CoinChart; 
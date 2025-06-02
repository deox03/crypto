import React, { useState, useEffect, useRef } from 'react';
import styles from './Converter.module.css';
import { FaExchangeAlt, FaChevronDown } from 'react-icons/fa';
import { getCoinList } from '../../services/api';

const Converter = () => {
  const [coins, setCoins] = useState([
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 44000, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2300, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { id: 'ripple', symbol: 'XRP', name: 'Ripple', price: 0.55, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.65, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.08, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.5, image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 110, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1, image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', price: 380, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 15, image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
    { id: 'polygon', symbol: 'MATIC', name: 'Polygon', price: 0.85, image: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
    { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price: 35, image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar', price: 0.12, image: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png' },
    { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', price: 9, image: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png' },
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', price: 7, image: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png' },
    { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', price: 70, image: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png' },
    { id: 'algorand', symbol: 'ALGO', name: 'Algorand', price: 0.25, image: 'https://assets.coingecko.com/coins/images/4380/small/download.png' },
    { id: 'tron', symbol: 'TRX', name: 'TRON', price: 0.11, image: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png' },
    { id: 'monero', symbol: 'XMR', name: 'Monero', price: 165, image: 'https://assets.coingecko.com/coins/images/69/small/monero_logo.png' },
    { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', price: 1.5, image: 'https://assets.coingecko.com/coins/images/10365/small/near.jpg' }
  ]);

  const [fromCoin, setFromCoin] = useState(coins[0]); // BTC
  const [toCoin, setToCoin] = useState(coins[7]); // USDT
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [loading, setLoading] = useState(true);

  // Refs for dropdown containers
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  // Fetch real coin prices
  useEffect(() => {
    const fetchCoinPrices = async () => {
      try {
        const data = await getCoinList();
        if (Array.isArray(data)) {
          const updatedCoins = coins.map(coin => {
            const apiCoin = data.find(c => c.id === coin.id);
            return {
              ...coin,
              price: apiCoin ? apiCoin.current_price : coin.price
            };
          });
          setCoins(updatedCoins);
          // Update fromCoin and toCoin with new prices
          const newFromCoin = updatedCoins.find(c => c.id === fromCoin.id);
          const newToCoin = updatedCoins.find(c => c.id === toCoin.id);
          if (newFromCoin) setFromCoin(newFromCoin);
          if (newToCoin) setToCoin(newToCoin);
        }
      } catch (error) {
        console.error('Error fetching coin prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinPrices();
    // Hər 30 saniyədə bir qiymətləri yenilə
    const interval = setInterval(fetchCoinPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateToAmount(fromAmount);
  }, [fromCoin, toCoin, fromAmount]);

  useEffect(() => {
    // Click xaricində baş verən hadisələri izləmək üçün
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setShowFromDropdown(false);
        setSearchFrom('');
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setShowToDropdown(false);
        setSearchTo('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatNumber = (value) => {
    if (!value) return '0';
    // Əvvəlcə rəqəmi 8 onluq kəsrə qədər yuvarlaqlaşdır
    const rounded = Number(value).toFixed(8);
    // Sondakı sıfırları sil
    const trimmed = rounded.replace(/\.?0+$/, '');
    // Əgər onluq kəsr 2-dən çoxdursa, 2-yə endir
    const parts = trimmed.split('.');
    if (parts[1] && parts[1].length > 2) {
      return Number(value).toFixed(2);
    }
    return trimmed;
  };

  const calculateToAmount = (value) => {
    if (!value) {
      setToAmount('');
      return;
    }
    const fromValue = parseFloat(value) * fromCoin.price;
    const toValue = fromValue / toCoin.price;
    setToAmount(formatNumber(toValue));
  };

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setToAmount(value);
      const toValue = parseFloat(value) * toCoin.price;
      const fromValue = toValue / fromCoin.price;
      setFromAmount(formatNumber(fromValue));
    }
  };

  const handleFromDropdownClick = () => {
    setShowToDropdown(false); // Digər dropdown-ı bağla
    setShowFromDropdown(!showFromDropdown);
  };

  const handleToDropdownClick = () => {
    setShowFromDropdown(false); // Digər dropdown-ı bağla
    setShowToDropdown(!showToDropdown);
  };

  const filteredFromCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchFrom.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchFrom.toLowerCase())
  );

  const filteredToCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTo.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTo.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.converterCard}>
          <div className={styles.loading}>Qiymətlər yüklənir...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.converterCard}>
        <h2 className={styles.title}>Kripto Konvertor</h2>
        
        <div className={styles.converterBody}>
          {/* From Section */}
          <div className={styles.inputGroup}>
            <label>Göndər</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder="0"
              />
              <div ref={fromDropdownRef} className={styles.coinSelector} onClick={handleFromDropdownClick}>
                <img src={fromCoin.image} alt={fromCoin.symbol} />
                <span>{fromCoin.symbol}</span>
                <FaChevronDown />
                
                {showFromDropdown && (
                  <div className={styles.dropdown}>
                    <input
                      type="text"
                      placeholder="Axtar..."
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className={styles.coinList}>
                      {filteredFromCoins.map(coin => (
                        <div
                          key={coin.id}
                          className={styles.coinOption}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFromCoin(coin);
                            setShowFromDropdown(false);
                            setSearchFrom('');
                          }}
                        >
                          <img src={coin.image} alt={coin.symbol} />
                          <span>{coin.name}</span>
                          <span className={styles.symbol}>{coin.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className={styles.switchButton} onClick={() => {
            const temp = fromCoin;
            setFromCoin(toCoin);
            setToCoin(temp);
          }}>
            <FaExchangeAlt />
          </button>

          {/* To Section */}
          <div className={styles.inputGroup}>
            <label>Al</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={toAmount}
                onChange={handleToAmountChange}
                placeholder="0"
              />
              <div ref={toDropdownRef} className={styles.coinSelector} onClick={handleToDropdownClick}>
                <img src={toCoin.image} alt={toCoin.symbol} />
                <span>{toCoin.symbol}</span>
                <FaChevronDown />
                
                {showToDropdown && (
                  <div className={styles.dropdown}>
                    <input
                      type="text"
                      placeholder="Axtar..."
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className={styles.coinList}>
                      {filteredToCoins.map(coin => (
                        <div
                          key={coin.id}
                          className={styles.coinOption}
                          onClick={(e) => {
                            e.stopPropagation();
                            setToCoin(coin);
                            setShowToDropdown(false);
                            setSearchTo('');
                          }}
                        >
                          <img src={coin.image} alt={coin.symbol} />
                          <span>{coin.name}</span>
                          <span className={styles.symbol}>{coin.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rateInfo}>
          1 {fromCoin.symbol} = {formatNumber(fromCoin.price / toCoin.price)} {toCoin.symbol}
        </div>
      </div>
    </div>
  );
};

export default Converter; 
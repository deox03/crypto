import React, { useState, useEffect } from 'react';
import styles from './Portfolio.module.css';
import { FaPlus, FaMinus, FaChevronRight, FaSearch, FaTimes, FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Portfolio = () => {
  const [showCoinSelector, setShowCoinSelector] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const [prices, setPrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const coins = [
    { 
      id: 'bitcoin', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
    },
    { 
      id: 'tether', 
      name: 'Tether USDt', 
      symbol: 'USDT', 
      icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
    },
    { 
      id: 'ripple', 
      name: 'XRP', 
      symbol: 'XRP', 
      icon: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png'
    },
    { 
      id: 'binancecoin', 
      name: 'BNB', 
      symbol: 'BNB', 
      icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png'
    },
    { 
      id: 'solana', 
      name: 'Solana', 
      symbol: 'SOL', 
      icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
    },
    { 
      id: 'usd-coin', 
      name: 'USDC', 
      symbol: 'USDC', 
      icon: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
    },
    { 
      id: 'dogecoin', 
      name: 'Dogecoin', 
      symbol: 'DOGE', 
      icon: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png'
    }
  ];

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); 
    return () => clearInterval(interval);
  }, [portfolio]);

  const fetchPrices = async () => {
    if (portfolio.length === 0) return;

    const ids = [...new Set(portfolio.map(t => t.coin.id))].join(',');
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );
      
      const newPrices = {};
      const newChanges = {};
      
      Object.entries(response.data).forEach(([id, data]) => {
        newPrices[id] = data.usd;
        newChanges[id] = data.usd_24h_change;
      });

      setPrices(newPrices);
      setPriceChanges(newChanges);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const handleAddTransaction = () => {
    if (selectedCoin && amount) {
      const existingTransaction = portfolio.find(t => t.coin.id === selectedCoin.id);
      
      if (existingTransaction) {
        const updatedPortfolio = portfolio.map(t => 
          t.coin.id === selectedCoin.id 
            ? { ...t, amount: t.amount + parseFloat(amount) }
            : t
        );
        setPortfolio(updatedPortfolio);
      } else {
        const newTransaction = {
          coin: selectedCoin,
          amount: parseFloat(amount),
          date: new Date(),
          id: Date.now()
        };
        setPortfolio([...portfolio, newTransaction]);
      }
      
      setSelectedCoin(null);
      setAmount('');
      setShowCoinSelector(false);
    }
  };

  const handleUpdateAmount = (transactionId, change) => {
    setPortfolio(portfolio.map(transaction => {
      if (transaction.id === transactionId) {
        const newAmount = transaction.amount + change;
        if (newAmount <= 0) {
          return null;
        }
        return { ...transaction, amount: newAmount };
      }
      return transaction;
    }).filter(Boolean));
  };

  const handleDeleteTransaction = (transactionId) => {
    setPortfolio(portfolio.filter(t => t.id !== transactionId));
  };

  const calculateTotalBalance = () => {
    return portfolio.reduce((total, transaction) => {
      const price = prices[transaction.coin.id] || 0;
      return total + (price * transaction.amount);
    }, 0);
  };

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change) => {
    if (!change) return '0.00%';
    return change.toFixed(2) + '%';
  };

  return (
    <div className={styles.portfolioContainer}>
      <div className={styles.portfolioHeader}>
        <h1>Your Portfolio</h1>
        <div className={styles.portfolioBalance}>
          <h2>Balance</h2>
          <div className={styles.balanceAmount}>
            {formatPrice(calculateTotalBalance())}
          </div>
        </div>
      </div>

      <div className={styles.addTransactionSection}>
        <h3>Add Transaction</h3>
        <div className={styles.addTransactionForm}>
          <div className={styles.coinSelector} onClick={() => setShowCoinSelector(true)}>
            {selectedCoin ? (
              <div className={styles.selectedCoin}>
                <img 
                  src={selectedCoin.icon} 
                  alt={selectedCoin.name} 
                  className={styles.coinIcon}
                />
                <span>{selectedCoin.name}</span>
                <span className={styles.coinSymbol}>{selectedCoin.symbol}</span>
              </div>
            ) : (
              <div className={styles.placeholderText}>Select Coin</div>
            )}
            <FaChevronRight className={styles.chevronIcon} />
          </div>
          
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className={styles.amountInput}
          />
          
          <button 
            className={styles.addButton}
            onClick={handleAddTransaction}
            disabled={!selectedCoin || !amount}
          >
            Add Transaction
          </button>
        </div>
      </div>

      {showCoinSelector && (
        <div className={styles.coinSelectorModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Select Coin</h3>
              <FaTimes 
                className={styles.closeIcon} 
                onClick={() => setShowCoinSelector(false)}
              />
            </div>
            
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className={styles.searchInput}
              />
            </div>

            <div className={styles.coinList}>
              {filteredCoins.map(coin => (
                <div
                  key={coin.id}
                  className={styles.coinItem}
                  onClick={() => {
                    setSelectedCoin(coin);
                    setShowCoinSelector(false);
                  }}
                >
                  <div className={styles.coinInfo}>
                    <img 
                      src={coin.icon} 
                      alt={coin.name} 
                      className={styles.coinIcon}
                    />
                    <span className={styles.coinName}>{coin.name}</span>
                    <span className={styles.coinSymbol}>{coin.symbol}</span>
                  </div>
                  <FaChevronRight className={styles.chevronIcon} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {portfolio.length > 0 && (
        <div className={styles.transactionsList}>
          <h3>Assets</h3>
          <div className={styles.tableHeader}>
            <div>Name</div>
            <div>Price</div>
            <div>24h %</div>
            <div>Holdings</div>
            <div>Value</div>
            <div>Actions</div>
          </div>
          {portfolio.map(transaction => {
            const price = prices[transaction.coin.id] || 0;
            const change = priceChanges[transaction.coin.id] || 0;
            const value = price * transaction.amount;
            
            return (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.coinInfo}>
                  <img 
                    src={transaction.coin.icon} 
                    alt={transaction.coin.name} 
                    className={styles.coinIcon}
                  />
                  <span>{transaction.coin.name}</span>
                  <span className={styles.coinSymbol}>{transaction.coin.symbol}</span>
                </div>
                <div className={styles.price}>
                  {formatPrice(price)}
                </div>
                <div className={`${styles.priceChange} ${change >= 0 ? styles.positive : styles.negative}`}>
                  {change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {formatChange(change)}
                </div>
                <div className={styles.holdings}>
                  {transaction.amount} {transaction.coin.symbol}
                </div>
                <div className={styles.value}>
                  {formatPrice(value)}
                </div>
                <div className={styles.actions}>
                  <FaPlus 
                    className={styles.actionIcon} 
                    onClick={() => handleUpdateAmount(transaction.id, 1)}
                  />
                  <FaMinus 
                    className={styles.actionIcon} 
                    onClick={() => handleUpdateAmount(transaction.id, -1)}
                  />
                  <FaTrash 
                    className={styles.actionIcon} 
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Portfolio;

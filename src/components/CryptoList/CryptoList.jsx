import React from 'react';
import styles from './CryptoList.module.css';

const CryptoList = () => {
  const cryptoData = [
    {
      id: 1,
      icon: "🔶",
      name: "Bitcoin",
      symbol: "BTC",
      price: "109,882.30",
      change24h: "+2.23%",
      marketCap: "$2.18T",
      volume24h: "$28.60B"
    },
    {
      id: 2,
      icon: "💠",
      name: "Ethereum",
      symbol: "ETH",
      price: "2,570.10",
      change24h: "+2.13%",
      marketCap: "$310.16B",
      volume24h: "$12.98B"
    },
    {
      id: 3,
      icon: "💎",
      name: "Tether",
      symbol: "USDT",
      price: "1.00",
      change24h: "+0.01%",
      marketCap: "$152.78B",
      volume24h: "$46.79B"
    },
    {
      id: 4,
      icon: "✖️",
      name: "XRP",
      symbol: "XRP",
      price: "2.34",
      change24h: "+1.69%",
      marketCap: "$137.37B",
      volume24h: "$1.83B"
    }
  ];

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Ad</th>
            <th>Qiymət</th>
            <th>24S %</th>
            <th>BAZAR DƏYƏRİ</th>
            <th>HƏCM(24S)</th>
          </tr>
        </thead>
        <tbody>
          {cryptoData.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.id}</td>
              <td className={styles.nameCell}>
                <span className={styles.icon}>{crypto.icon}</span>
                <span className={styles.name}>{crypto.name}</span>
                <span className={styles.symbol}>{crypto.symbol}</span>
              </td>
              <td>${crypto.price}</td>
              <td className={crypto.change24h.startsWith('+') ? styles.positive : styles.negative}>
                {crypto.change24h}
              </td>
              <td>{crypto.marketCap}</td>
              <td>{crypto.volume24h}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoList; 
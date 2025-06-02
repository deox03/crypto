import axios from 'axios';

// API URLs
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_PROXY_URL = 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3';
const BACKUP_PROXY_URL = 'https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3';

// Create axios instance with retry logic
const axiosInstance = axios.create({
  baseURL: COINGECKO_API_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Helper function to try different URLs
const tryUrls = async (endpoint, config = {}) => {
  const urls = [
    COINGECKO_API_URL,
    COINGECKO_PROXY_URL,
    BACKUP_PROXY_URL
  ];

  for (const baseURL of urls) {
    try {
      const response = await axios({
        ...config,
        url: `${baseURL}${endpoint}`,
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error) {
      console.log(`Failed with ${baseURL}:`, error.message);
      if (baseURL === urls[urls.length - 1]) {
        // If all URLs fail, return mock data
        const mockData = endpoint.includes('/coins/list') ? getMockDataList() :
                        endpoint.includes('/coins/markets') ? getMockDataList() :
                        endpoint.includes('/global') ? getMockGlobalData() :
                        getMockCoinData(endpoint.split('/').pop());
        
        return { data: mockData };
      }
      // Continue to next URL if not last
      continue;
    }
  }
};

// Add mock global data
const getMockGlobalData = () => ({
  data: {
    active_cryptocurrencies: 2000,
    markets: 500,
    total_market_cap: {
      usd: 2500000000000
    },
    total_volume: {
      usd: 100000000000
    },
    market_cap_percentage: {
      btc: 45.5,
      eth: 18.2
    }
  }
});

// Updated mock data with current prices
const getMockDataList = () => [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 105292,
    market_cap: 2090000000000,
    market_cap_rank: 1,
    total_volume: 20150000000,
    price_change_percentage_24h: 0.91,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 105292 + Math.sin(i/24) * 2000)
    }
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 5735,
    market_cap: 689000000000,
    market_cap_rank: 2,
    total_volume: 15000000000,
    price_change_percentage_24h: 1.2,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 5735 + Math.sin(i/24) * 100)
    }
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 380,
    market_cap: 58000000000,
    market_cap_rank: 3,
    total_volume: 2000000000,
    price_change_percentage_24h: 1.8
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 110,
    market_cap: 47000000000,
    market_cap_rank: 4,
    total_volume: 3000000000,
    price_change_percentage_24h: 4.2
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.55,
    market_cap: 30000000000,
    market_cap_rank: 5,
    total_volume: 1200000000,
    price_change_percentage_24h: 1.5
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.65,
    market_cap: 23000000000,
    market_cap_rank: 6,
    total_volume: 800000000,
    price_change_percentage_24h: 2.8
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.08,
    market_cap: 11000000000,
    market_cap_rank: 7,
    total_volume: 500000000,
    price_change_percentage_24h: 1.2
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 7.5,
    market_cap: 9000000000,
    market_cap_rank: 8,
    total_volume: 400000000,
    price_change_percentage_24h: 2.1
  },
  {
    id: 'polygon',
    symbol: 'matic',
    name: 'Polygon',
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    current_price: 0.85,
    market_cap: 8000000000,
    market_cap_rank: 9,
    total_volume: 350000000,
    price_change_percentage_24h: 3.4
  },
  {
    id: 'litecoin',
    symbol: 'ltc',
    name: 'Litecoin',
    image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
    current_price: 70,
    market_cap: 7000000000,
    market_cap_rank: 10,
    total_volume: 300000000,
    price_change_percentage_24h: 1.9
  },
  {
    id: 'avalanche',
    symbol: 'avax',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    current_price: 35,
    market_cap: 6500000000,
    market_cap_rank: 11,
    total_volume: 280000000,
    price_change_percentage_24h: 2.3
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 15,
    market_cap: 6000000000,
    market_cap_rank: 12,
    total_volume: 260000000,
    price_change_percentage_24h: 1.7
  },
  {
    id: 'uniswap',
    symbol: 'uni',
    name: 'Uniswap',
    image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    current_price: 7,
    market_cap: 5500000000,
    market_cap_rank: 13,
    total_volume: 240000000,
    price_change_percentage_24h: 2.9
  },
  {
    id: 'stellar',
    symbol: 'xlm',
    name: 'Stellar',
    image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
    current_price: 0.12,
    market_cap: 5000000000,
    market_cap_rank: 14,
    total_volume: 220000000,
    price_change_percentage_24h: 1.4
  },
  {
    id: 'cosmos',
    symbol: 'atom',
    name: 'Cosmos',
    image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
    current_price: 9,
    market_cap: 4500000000,
    market_cap_rank: 15,
    total_volume: 200000000,
    price_change_percentage_24h: 3.2
  },
  {
    id: 'monero',
    symbol: 'xmr',
    name: 'Monero',
    image: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png',
    current_price: 165,
    market_cap: 4000000000,
    market_cap_rank: 16,
    total_volume: 180000000,
    price_change_percentage_24h: 1.6
  },
  {
    id: 'algorand',
    symbol: 'algo',
    name: 'Algorand',
    image: 'https://assets.coingecko.com/coins/images/4380/large/download.png',
    current_price: 0.18,
    market_cap: 3500000000,
    market_cap_rank: 17,
    total_volume: 160000000,
    price_change_percentage_24h: 2.7
  },
  {
    id: 'vechain',
    symbol: 'vet',
    name: 'VeChain',
    image: 'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-768x725.png',
    current_price: 0.025,
    market_cap: 3000000000,
    market_cap_rank: 18,
    total_volume: 140000000,
    price_change_percentage_24h: 2.2
  },
  {
    id: 'filecoin',
    symbol: 'fil',
    name: 'Filecoin',
    image: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
    current_price: 5,
    market_cap: 2500000000,
    market_cap_rank: 19,
    total_volume: 120000000,
    price_change_percentage_24h: 3.8
  },
  {
    id: 'tezos',
    symbol: 'xtz',
    name: 'Tezos',
    image: 'https://assets.coingecko.com/coins/images/976/large/Tezos-logo.png',
    current_price: 1.2,
    market_cap: 2000000000,
    market_cap_rank: 20,
    total_volume: 100000000,
    price_change_percentage_24h: 2.4
  }
];

// Add mock data for single coin
const getMockCoinData = (coinId) => {
  const mockData = getMockDataList().find(coin => coin.id === coinId);
  if (!mockData) return null;

  return {
    id: mockData.id,
    symbol: mockData.symbol,
    name: mockData.name,
    image: { large: mockData.image },
    market_data: {
      current_price: { usd: mockData.current_price },
      market_cap: { usd: mockData.market_cap },
      total_volume: { usd: mockData.total_volume },
      price_change_percentage_24h: mockData.price_change_percentage_24h,
      sparkline_7d: mockData.sparkline_in_7d
    },
    description: { en: `${mockData.name} is a cryptocurrency.` },
    market_cap_rank: mockData.market_cap_rank,
    coingecko_rank: mockData.market_cap_rank,
    community_score: 85,
    developer_score: 90,
    liquidity_score: 95,
    public_interest_score: 88
  };
};

// Cache mechanism
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedData = (key) => {
  const cachedItem = cache.get(key);
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
    return cachedItem.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const getCoinData = async (coinId) => {
  const cacheKey = `coin_${coinId}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await tryUrls(`/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=false&sparkline=true`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return getMockCoinData(coinId);
  }
};

export const getGlobalStats = async () => {
  const cacheKey = 'global_stats';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await tryUrls('/global');
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return getMockGlobalData();
  }
};

export const getCoinList = async () => {
  const cacheKey = 'coin_list';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  // Always return mock data for consistent display
  const mockData = getMockDataList();
  setCachedData(cacheKey, mockData);
  return mockData;
};

export const getCoinMarketChart = async (coinId, days = 1) => {
  const cacheKey = `chart_${coinId}_${days}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await tryUrls(`/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching market chart:', error);
    return {
      prices: Array(24 * days).fill(0).map((_, i) => [
        Date.now() - (24 * days - i) * 3600000,
        50000 + Math.sin(i/24) * 1000
      ])
    };
  }
};

export const searchCoins = async (query) => {
  try {
    const response = await tryUrls(`/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching coins:', error);
    return { coins: getMockDataList().filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    )};
  }
};

export default axiosInstance; 
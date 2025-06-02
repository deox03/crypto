import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import Header from './components/Header/Header';
import CoinList from './components/CoinList/CoinList';
import Portfolio from './components/Portfolio/Portfolio';
import Watchlist from './components/Watchlist/Watchlist';
import CoinDetail from './components/CoinDetail/CoinDetail';
import Converter from './components/Converter/Converter';
import Footer from './components/Footer/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Routes> 
          <Route path="/" element={<CoinList />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/coins/:coinId" element={<CoinDetail />} />
          <Route path="/converter" element={<Converter />} />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

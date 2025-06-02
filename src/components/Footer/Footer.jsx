import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaTwitter, FaGithub } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  const location = useLocation();
  
  // Portfolio və Watchlist səhifələrində footer-i göstərmə
  if (location.pathname === '/portfolio' || location.pathname === '/watchlist') {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Haqqımızda</h3>
          <p>
            Crypto Trading Chart, kripto para piyasalarını real-time izlemek və analiz etmək üçün 
            professional bir platformadır. Biz istifadəçilərimizə ən yaxşı ticarət təcrübəsini 
            təqdim etməyə çalışırıq.
          </p>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Əlaqə</h3>
          <p>Email: info@cryptotrading.com</p>
          <p>Ünvan: Bakı şəhəri, Azərbaycan</p>
          <div className={styles.socialLinks}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </div>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Layihə Haqqında</h3>
          <p>
            Bu layihə 2024-ci ildə yaradılmışdır. Məqsədimiz istifadəçilərə 
            kripto valyuta bazarını daha yaxşı başa düşməyə və analiz etməyə 
            kömək etməkdir.
          </p>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Crypto Trading Chart. Bütün hüquqlar qorunur.</p>
      </div>
    </footer>
  );
};

export default Footer; 
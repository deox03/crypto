import React, { useState, useRef, useEffect } from "react";
import styles from "./ProfileDrawer.module.css";
import { FaUserCircle, FaMoon, FaSun, FaGlobe, FaCoins, FaChevronRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useTheme } from "../../context/ThemeContext";

const ProfileDrawer = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");
  const { darkMode, toggleTheme } = useTheme();
  const drawerRef = useRef(null);
  const profileIconRef = useRef(null);

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && 
          drawerRef.current && 
          !drawerRef.current.contains(event.target) &&
          profileIconRef.current &&
          !profileIconRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={styles.container}>
      <div ref={profileIconRef}>
        <FaUserCircle className={styles.profileIcon} onClick={toggleDrawer} />
      </div>

      {open && (
        <div ref={drawerRef} className={styles.drawer}>
          <div className={styles.header}>
            <span>Profile</span>
            <IoMdClose className={styles.closeIcon} onClick={toggleDrawer} />
          </div>

          <div className={styles.section}>
            <div className={styles.userInfo}>
              <FaUserCircle size={48} color="#6c5ce7" />
              <div>
                <p><strong>CryptoUser</strong></p>
                <p className={styles.email}>user@example.com</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <label><strong>Theme</strong></label>
            <button onClick={toggleTheme} className={styles.themeBtn}>
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>

          <div className={styles.section}>
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>
                <FaGlobe />
                <strong>Language</strong>
              </div>
              <div className={styles.optionControl}>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option>English</option>
                  <option>Azerbaijani</option>
                  <option>Turkish</option>
                </select>
                <FaChevronRight className={styles.chevron} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>
                <FaCoins />
                <strong>Currency</strong>
              </div>
              <div className={styles.optionControl}>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>AZN</option>
                  <option>BTC</option>
                </select>
                <FaChevronRight className={styles.chevron} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDrawer;

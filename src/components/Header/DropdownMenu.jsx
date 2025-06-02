import React, { useState, useRef } from 'react';
import styles from './DropdownMenu.module.css';

const DropdownMenu = ({ title, sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div 
      className={styles.dropdown}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={styles.dropdownButton}>
        {title}
      </button>

      {isOpen && (
        <div className={styles.dropdownContent}>
          {Object.entries(sections).map(([sectionTitle, items]) => (
            <div key={sectionTitle} className={styles.column}>
              {sectionTitle && <h4>{sectionTitle}</h4>}
              {items.map((item, index) => (
                <a key={index} href="#">{item}</a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

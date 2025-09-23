import React, { useState, useEffect } from 'react';
import styles from '../styles/VirtualKeyboard.module.css';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onClear: () => void;
  activeInput: 'name' | 'city' | null;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  onClear,
  activeInput
}) => {
  const [isShift, setIsShift] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyClick = (key: string) => {
    if (isShift || isCapsLock) {
      onKeyPress(key.toUpperCase());
    } else {
      onKeyPress(key.toLowerCase());
    }
    
    // Auto-disable shift after key press
    if (isShift) {
      setIsShift(false);
    }
  };

  const handleShiftClick = () => {
    setIsShift(!isShift);
  };

  const handleCapsLockClick = () => {
    setIsCapsLock(!isCapsLock);
  };

  const handleSpaceClick = () => {
    onKeyPress(' ');
  };

  const handleBackspaceClick = () => {
    onBackspace();
  };

  const handleEnterClick = () => {
    onEnter();
  };

  const handleClearClick = () => {
    onClear();
  };

  return (
    <div className={styles.keyboard}>
      <div className={styles.keyboardContainer}>
        {/* First row */}
        <div className={styles.keyRow}>
          {rows[0].map((key) => (
            <button
              key={key}
              className={`${styles.key} ${styles.letterKey}`}
              onClick={() => handleKeyClick(key)}
            >
              {isShift || isCapsLock ? key : key.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Second row */}
        <div className={styles.keyRow}>
          {rows[1].map((key) => (
            <button
              key={key}
              className={`${styles.key} ${styles.letterKey}`}
              onClick={() => handleKeyClick(key)}
            >
              {isShift || isCapsLock ? key : key.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Third row */}
        <div className={styles.keyRow}>
          {rows[2].map((key) => (
            <button
              key={key}
              className={`${styles.key} ${styles.letterKey}`}
              onClick={() => handleKeyClick(key)}
            >
              {isShift || isCapsLock ? key : key.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Bottom row with special keys */}
        <div className={styles.keyRow}>
          <button
            className={`${styles.key} ${styles.specialKey} ${isShift ? styles.active : ''}`}
            onClick={handleShiftClick}
          >
            Shift
          </button>
          <button
            className={`${styles.key} ${styles.letterKey}`}
            onClick={handleSpaceClick}
          >
            Space
          </button>
          <button
            className={`${styles.key} ${styles.specialKey} ${isCapsLock ? styles.active : ''}`}
            onClick={handleCapsLockClick}
          >
            Caps
          </button>
          <button
            className={`${styles.key} ${styles.specialKey}`}
            onClick={handleBackspaceClick}
          >
            ⌫
          </button>
          <button
            className={`${styles.key} ${styles.specialKey}`}
            onClick={handleClearClick}
          >
            Clear
          </button>
          <button
            className={`${styles.key} ${styles.specialKey} ${styles.enterKey}`}
            onClick={handleEnterClick}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;

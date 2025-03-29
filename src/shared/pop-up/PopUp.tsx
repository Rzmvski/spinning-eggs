import React, { useEffect, useState } from 'react';
import './styles.less';
import { loadAnalytics } from 'src/app/api';

interface PopUpProps {
  isSpinning: boolean;
}

export const PopUp = ({ isSpinning }: PopUpProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [wasSpinning, setWasSpinning] = useState(false);
  const showPopUpTime = 20000

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, showPopUpTime)

    return () => clearTimeout(timeout)
  }, [wasSpinning])

  useEffect(() => {
    if (!isSpinning) return
    setWasSpinning(true)
  }, [isSpinning])

  useEffect(() => {
    if (!isSpinning && wasSpinning) {
      loadAnalytics().then(data => {
        setCurrentText(data)
        setIsVisible(true)
        setWasSpinning(false)
      })
    }
  }, [isSpinning])

  return (
    <div className={`pop-up ${isVisible ? 'visible' : ''}`}>
      <span>{currentText}</span>
    </div>
  );
};
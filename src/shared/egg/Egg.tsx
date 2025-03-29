import React, { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import './styles.less';
import { Position } from 'src/shared/types';

interface EggProps {
  defaultSpeed: number;
  onSpinningChange: (isSpinning: boolean) => void;
}

export const Egg = ({ defaultSpeed, onSpinningChange }: EggProps) => {
  const eggRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(getRandomAngleFromInterval(0, 360));
  const [velocity, setVelocity] = useState(defaultSpeed);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState<Position | null>(null);
  const animationRef = useRef(null);
  const sensitivity = 0.02;
  const friction = 0.975;

  useEffect(() => {
    requestAnimationFrame(inertialSpin);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    const isSpinning = Math.abs(velocity) > 0.1;
    onSpinningChange(isSpinning);
  }, [velocity]);

  function getRandomAngleFromInterval(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1) + start)
  }

  const handleStart = ({ x, y }: Position) => {
    setIsDragging(true);
    const angle = calculateAngle(x, y);
    setLastPosition({ x, y, angle, timestamp: performance.now() });
    setVelocity(0);
    cancelAnimationFrame(animationRef.current);
  };

  const handleMove = ({ x, y }: Position) => {
    if (!isDragging || !lastPosition) return;
    const currentAngle = calculateAngle(x, y);
    const currentTime = performance.now()
    const angleDiff = currentAngle - lastPosition.angle;
    const timeDiff = (currentTime - lastPosition.timestamp) / 1000
    const angularVelocity = (angleDiff / timeDiff) * sensitivity

    setAngle(prevAngle => prevAngle + angleDiff);
    setVelocity(angularVelocity);
    setLastPosition({ x, y, angle: currentAngle, timestamp: currentTime });
  };

  const handleEnd = () => {
    setIsDragging(false);
    setLastPosition(null);
    animationRef.current = requestAnimationFrame(inertialSpin);
  };

  const calculateAngle = (x: number, y: number) => {
    if (!eggRef.current) return 0;
    const rect = eggRef.current.getBoundingClientRect();
    const { left, width, height, top } = rect;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  };

  const inertialSpin = (timestamp: number) => {
    if (Math.abs(velocity) < 0.1) return;
    setAngle(prevState => (prevState + velocity) * friction);
    setVelocity(prevState => prevState * friction);
    animationRef.current = requestAnimationFrame(inertialSpin);
  };

  const handleMouseDown = ({ clientX, clientY }: MouseEvent<HTMLDivElement>) => {
    handleStart({ x: clientX, y: clientY });
  };

  const handleMouseMove = ({ clientX, clientY }: MouseEvent<HTMLDivElement>) => {
    handleMove({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const shadowWidth = 10;

  const shadowOffset = {
    x: Math.sin(angle * Math.PI / 180) * shadowWidth,
    y: Math.cos(angle * Math.PI / 180) * shadowWidth,
  };

  const getTouchPosition = (e: TouchEvent<HTMLDivElement>): Position => {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    return { x: clientX, y: clientY };
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const position = getTouchPosition(e)
    handleStart(position);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const position = getTouchPosition(e)
    handleMove(position);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    handleEnd();
  };

  return (
    <div
      className={'egg-container'}
      ref={eggRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={'egg'}
        style={{
          transform: `rotate(${angle}deg)`,
          filter: `drop-shadow(${shadowOffset.x}px ${shadowOffset.y}px 10px rgba(0,0,0,0.3))`,
        }}
      />
      <div className={'egg-highlight'} />
    </div>
  );
};
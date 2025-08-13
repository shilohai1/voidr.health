
import { useEffect, useState, useRef } from 'react';

export const useAdaptiveTextColor = (elementRef: React.RefObject<HTMLElement>) => {
  const [textColor, setTextColor] = useState('white');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvasRef.current = canvas;

    if (!ctx) return;

    const checkBrightness = () => {
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Set canvas size to match a small area around the text
      canvas.width = 50;
      canvas.height = 50;

      // Try to capture the background color from the rendered page
      try {
        // Get the computed style background color
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        
        // If background is transparent, check parent elements
        let parentElement = element.parentElement;
        let effectiveBgColor = bgColor;
        
        while (parentElement && (effectiveBgColor === 'rgba(0, 0, 0, 0)' || effectiveBgColor === 'transparent')) {
          effectiveBgColor = window.getComputedStyle(parentElement).backgroundColor;
          parentElement = parentElement.parentElement;
        }

        // Parse RGB values and calculate brightness
        const rgbMatch = effectiveBgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          
          // Calculate perceived brightness using luminance formula
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          
          // Switch text color based on brightness threshold
          setTextColor(brightness > 128 ? 'black' : 'white');
        } else {
          // Fallback: assume we're over a colorful background, use white text
          setTextColor('white');
        }
      } catch (error) {
        // Fallback to white text if detection fails
        setTextColor('white');
      }
    };

    // Check brightness initially and on intervals to handle animation
    checkBrightness();
    const interval = setInterval(checkBrightness, 100);

    // Also check on scroll and resize
    const handleCheck = () => checkBrightness();
    window.addEventListener('scroll', handleCheck);
    window.addEventListener('resize', handleCheck);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleCheck);
      window.removeEventListener('resize', handleCheck);
    };
  }, [elementRef]);

  return textColor;
};

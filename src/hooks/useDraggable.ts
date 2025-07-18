import { useState, useRef, useCallback, useEffect } from 'react';

export const useDraggable = (elRef: React.RefObject<HTMLElement>) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialElPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (elRef.current) {
      isDragging.current = true;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      initialElPos.current = { x: position.x, y: position.y };
      elRef.current.style.cursor = 'grabbing';
      elRef.current.style.transition = 'none';
    }
  }, [position.x, position.y, elRef]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (elRef.current) {
        elRef.current.style.cursor = 'grab';
        elRef.current.style.transition = 'box-shadow 0.2s ease-in-out';
    }
  }, [elRef]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      
      const newX = initialElPos.current.x + dx;
      const newY = initialElPos.current.y + dy;

      setPosition({ x: newX, y: newY });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { position, onMouseDown };
};

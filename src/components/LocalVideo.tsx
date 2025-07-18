import React, { useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { useDraggable } from '../hooks/useDraggable';

const LocalVideo = () => {
  const localStream = useStore((s) => s.localStream);
  const isCameraOff = useStore((s) => s.isCameraOff);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { position, onMouseDown } = useDraggable(containerRef);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  if (!localStream) return null;

  return (
    <div
      ref={containerRef}
      className="absolute z-30 w-48 h-36 md:w-64 md:h-48 rounded-2xl overflow-hidden shadow-2xl cursor-grab focus:outline-none"
      style={{ top: position.y, left: position.x }}
      onMouseDown={onMouseDown}
      aria-label="Your video preview, draggable"
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl transition-all duration-300">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isCameraOff ? 'opacity-0' : 'opacity-100'}`}
        />
        {isCameraOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white text-sm">Camera Off</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LocalVideo;

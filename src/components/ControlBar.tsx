import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

const ControlButton = ({ onClick, children, className = '', ariaLabel }: { onClick: () => void; children: React.ReactNode; className?: string; ariaLabel: string }) => (
    <button
        onClick={onClick}
        className={`p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-lg ${className}`}
        aria-label={ariaLabel}
    >
        {children}
    </button>
);

const ControlBar = () => {
    const { isMuted, isCameraOff, toggleMute, toggleCamera, hangUp } = useStore();
    const [isVisible, setIsVisible] = useState(true);
    const timeoutRef = React.useRef<number | null>(null);

    useEffect(() => {
        const handleMouseMove = () => {
            setIsVisible(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                setIsVisible(false);
            }, 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        handleMouseMove();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 mb-4 z-40 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-4 p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 shadow-lg">
                <ControlButton onClick={toggleMute} ariaLabel={isMuted ? "Unmute microphone" : "Mute microphone"}>
                    {isMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
                </ControlButton>
                <ControlButton onClick={toggleCamera} ariaLabel={isCameraOff ? "Turn camera on" : "Turn camera off"}>
                    {isCameraOff ? <VideoOff size={24} className="text-white" /> : <Video size={24} className="text-white" />}
                </ControlButton>
                <ControlButton onClick={hangUp} className="!bg-red-500 hover:!bg-red-600" ariaLabel="End call">
                    <PhoneOff size={24} className="text-white" />
                </ControlButton>
            </div>
        </div>
    );
};

export default ControlBar;

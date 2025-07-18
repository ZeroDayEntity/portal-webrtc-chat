import React from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import useStore from '../store/useStore';
import LocalVideo from './LocalVideo';
import ControlBar from './ControlBar';
import { Loader2, Copy } from 'lucide-react';

const RemoteVideo = () => {
  const remoteStream = useStore((s) => s.remoteStream);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
    />
  );
};

const StatusDisplay = () => {
    const callState = useStore(s => s.callState);
    const roomId = useStore(s => s.roomId);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    }

    if (callState === 'CONNECTED') return null;

    let statusText = 'Connecting...';
    if(callState === 'WAITING') {
        statusText = 'Waiting for another user to join...'
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="text-center text-white p-6 rounded-lg bg-black/30 backdrop-blur-xl">
                <div className="flex items-center justify-center mb-4">
                    <Loader2 className="animate-spin mr-3" size={24} />
                    <h2 className="text-2xl font-semibold">{statusText}</h2>
                </div>
                {callState === 'WAITING' && roomId && (
                    <div className="mt-4">
                        <p className="text-gray-300 mb-2">Share this link to invite someone:</p>
                        <div className="flex items-center gap-2 p-2 rounded-md bg-gray-800">
                           <input type="text" readOnly value={window.location.href} className="bg-transparent text-gray-200 w-full outline-none"/>
                            <button onClick={copyLink} className="p-2 rounded-md hover:bg-gray-700 transition" aria-label="Copy link">
                                <Copy size={18}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const Call = () => {
  useWebRTC();
  const remoteStream = useStore(s => s.remoteStream);

  return (
    <div className="relative w-full h-full bg-black">
      {remoteStream && <RemoteVideo />}
      <LocalVideo />
      <ControlBar />
      <StatusDisplay />
    </div>
  );
};

export default Call;
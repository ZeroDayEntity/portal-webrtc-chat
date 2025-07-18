import { useEffect, useRef, useCallback } from 'react';
import useStore from '../store/useStore';

const STUN_SERVER = 'stun:stun.l.google.com:19302';

export const useWebRTC = () => {
  const {
    roomId,
    setLocalStream,
    setRemoteStream,
    setCallState,
    setPeerConnection,
    hangUp,
    localStream,
    peerConnection,
  } = useStore();
  const signalingChannel = useRef<BroadcastChannel | null>(null);

  const init = useCallback(async () => {
    if (!roomId) return;
    setCallState('CONNECTING');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setCallState('WAITING');

      const pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_SERVER }] });
      setPeerConnection(pc);

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        setCallState('CONNECTED');
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          signalingChannel.current?.postMessage({ type: 'candidate', candidate: event.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed' || pc.connectionState === 'failed') {
          hangUp();
        }
      };

    } catch (error) {
      console.error("Failed to get user media", error);
      setCallState('IDLE');
    }
  }, [roomId, setCallState, setLocalStream, setPeerConnection, setRemoteStream, hangUp]);

  useEffect(() => {
    if (!roomId) return;

    signalingChannel.current = new BroadcastChannel(roomId);
    
    const handleSignalingMessage = async (event: MessageEvent) => {
      if (!peerConnection) return;
      const { type, sdp, candidate } = event.data;

      try {
        if (type === 'offer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          signalingChannel.current?.postMessage({ type: 'answer', sdp: peerConnection.localDescription });
        } else if (type === 'answer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
        } else if (type === 'candidate') {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } else if (type === 'peer-joined') {
            if (peerConnection.signalingState === 'stable') {
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                signalingChannel.current?.postMessage({ type: 'offer', sdp: peerConnection.localDescription });
            }
        }
      } catch (error) {
        console.error("Signaling error:", error);
      }
    };

    signalingChannel.current.onmessage = handleSignalingMessage;
    
    init().then(() => {
        // Announce presence after initialization
        signalingChannel.current?.postMessage({ type: 'peer-joined' });
    });

    return () => {
      signalingChannel.current?.close();
    };
  }, [roomId, init, peerConnection]);

  return { localStream, remoteStream: useStore(s => s.remoteStream), callState: useStore(s => s.callState), hangUp };
};

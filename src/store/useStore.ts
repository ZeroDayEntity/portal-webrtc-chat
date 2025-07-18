import { create } from 'zustand';

export type CallState = 'IDLE' | 'CREATING' | 'JOINING' | 'WAITING' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

interface PortalState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callState: CallState;
  isMuted: boolean;
  isCameraOff: boolean;
  roomId: string | null;
  peerConnection: RTCPeerConnection | null;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setCallState: (state: CallState) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  setRoomId: (id: string | null) => void;
  setPeerConnection: (pc: RTCPeerConnection | null) => void;
  hangUp: () => void;
}

const useStore = create<PortalState>((set, get) => ({
  localStream: null,
  remoteStream: null,
  callState: 'IDLE',
  isMuted: false,
  isCameraOff: false,
  roomId: null,
  peerConnection: null,

  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setCallState: (state) => set({ callState: state }),
  
  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // isMuted is the old state
      });
    }
    set({ isMuted: !isMuted });
  },

  toggleCamera: () => {
    const { localStream, isCameraOff } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOff; // isCameraOff is the old state
      });
    }
    set({ isCameraOff: !isCameraOff });
  },

  setRoomId: (id) => set({ roomId: id }),
  setPeerConnection: (pc) => set({ peerConnection: pc }),
  
  hangUp: () => {
    const { peerConnection, localStream } = get();
    if (peerConnection) {
      peerConnection.close();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    window.location.hash = '';
    set({
      localStream: null,
      remoteStream: null,
      callState: 'IDLE',
      isMuted: false,
      isCameraOff: false,
      roomId: null,
      peerConnection: null,
    });
  },
}));

export default useStore;

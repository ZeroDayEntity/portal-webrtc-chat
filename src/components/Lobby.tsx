import useStore from "../store/useStore";
import { Video } from 'lucide-react';

const Lobby = () => {
  const { setRoomId, setCallState } = useStore();

  const createRoom = () => {
    const newRoomId = `portal-${crypto.randomUUID()}`;
    setRoomId(newRoomId);
    window.location.hash = newRoomId;
    setCallState('CREATING');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tighter mb-4">Portal</h1>
        <p className="text-lg text-gray-400 mb-8">Peer-to-peer video chat with minimalist elegance.</p>
        <button
          onClick={createRoom}
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-electric-purple-500 hover:bg-electric-purple-600 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-electric-purple-500/30"
          aria-label="Create a new call room"
        >
          <Video size={24} className="transition-transform duration-300 group-hover:rotate-12" />
          Create New Call
        </button>
      </div>
    </div>
  );
};

export default Lobby;

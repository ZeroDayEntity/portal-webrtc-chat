import { useEffect } from 'react';
import useStore from './store/useStore';
import Lobby from './components/Lobby';
import Call from './components/Call';

function App() {
  const { callState, setRoomId, setCallState } = useStore();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && !useStore.getState().roomId) {
        setRoomId(hash);
        setCallState('JOINING');
      } else if (!hash && useStore.getState().callState !== 'IDLE') {
        // Handle case where user navigates back or removes hash
        // This is a simplified reset, a real app might need more state handling
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    handleHashChange(); // Check hash on initial load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [setRoomId, setCallState]);

  const showLobby = callState === 'IDLE';

  return (
    <div className="w-screen h-screen">
      {showLobby ? <Lobby /> : <Call />}
    </div>
  );
}

export default App;

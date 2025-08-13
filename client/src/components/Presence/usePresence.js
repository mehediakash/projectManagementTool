import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

export default function usePresence() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id) return;
    const socket = io(import.meta.env.VITE_API_URL, {
      query: { userId: user._id }
    });

    socket.on('presence:update', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return onlineUsers;
}

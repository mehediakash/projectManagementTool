import React from 'react';
import usePresence from './usePresence';
import { useSelector } from 'react-redux';

export default function PresenceAvatars() {
  const onlineUsers = usePresence();
  const { users } = useSelector((state) => state.user);

  return (
    <div className="flex items-center space-x-2">
      {users
        .filter(u => onlineUsers.includes(u._id))
        .map((u) => (
          <div key={u._id} title={u.name} className="w-8 h-8 rounded-full border-2 border-green-500">
            <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full" />
          </div>
        ))}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

const App = () => {
  // Initialize socket only once
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showChat, setShowChat] = useState(false);
   
   console.log(userName);
   console.log(roomId);


  // Setup socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:3001");
    setSocket(socketInstance);

    // Cleanup the socket connection when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (userName!== "" && roomId!== "") {
      // Emit join room event with roomId
      socket.emit("clientConnection", roomId);
      setShowChat(true);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      {!showChat ? (
        <div className='joinChatContainer'>
          <h3>Join Chat</h3>
          <input
            type="text"
            placeholder='John...'
            className='px-2 py-2 border border-black'
            onChange={(event) => setUserName(event.target.value)}
          />
          <input
            type="text"
            placeholder='Room ID...'
            className='px-2 py-2 border border-black'
            onChange={(event) => setRoomId(event.target.value)}
          />
          <button
            className='px-2 py-2 border border-black'
            onClick={()=>joinRoom()}
          >
            Join a Room
          </button>
        </div>
      ) : (
        socket && (
          <Chat socket={socket} username={userName} roomid={roomId} />
        )
      )}
    </div>
  );
};

export default App;

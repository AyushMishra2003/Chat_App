import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'


const Chat = ({ socket, username, roomid }) => {
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);
     console.log(socket);
    useEffect(() => {
        // Log socket connection status
        if (socket) {
            console.log('Socket connected:', socket.id);
        } else {
            console.log('Socket is not initialized');
        }
    }, [socket]);

    const sendMessage = async () => {
        if (message.trim() !== '') {
            const messageData = {
                room: roomid,
                author: username,
                message: message,
                time: new Date().toLocaleTimeString() // More readable time format
            };

            await socket.emit('send_message', messageData);
            setAllMessages((list) => [...list,messageData]);
            setMessage(''); // Clear the input field after sending
        }
    };

    useEffect(() => {
        // Debugging: Log when the effect is set up
        console.log('Setting up socket listeners');

        const handleReceiveMessage = (data) => {
            console.log('Message received:', data);
            setAllMessages((list) => [...list, data]);
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            console.log('Cleaning up socket listeners');
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket]);

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>
            <ScrollToBottom className='chat-body flex-1 p-4 overflow-y-auto bg-white'>
            <div className='chat-body'>
                {allMessages.length === 0 ? (
                    <p>No messages yet</p>
                ) : (
                    allMessages.map((messageContent, index) => (
                        <div key={index} className='message' id={username===messageContent.author?"you":"other"}>
                             <div>
                                <div className='message-content'>
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className='message-meta  gap-4'>
                                     <p id="time">{messageContent.time}</p>
                                     <p className='text-black font-bold'>{messageContent.author}</p>
                                     <p></p>
                                </div>
                             </div>
                            {/* <p><strong>{messageContent.author}</strong>: {messageContent.message} <span>{messageContent.time}</span></p> */}
                        </div>
                    ))
                )}
            </div>
            </ScrollToBottom>

            <div className='chat-footer'>
                <input
                    type="text"
                    placeholder='Type a message...'
                    className='border border-black'
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}

                    onKeyPress={(event)=>{event.key==="Enter" && sendMessage()}}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
};

export default Chat;

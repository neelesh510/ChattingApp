import React, { useState, useEffect } from 'react';
import MessageCard from '../components/messageCard';
import { useSocket } from '../socketContext'; 
import ContactCard from '../components/contactCard';
import { useSelector } from 'react-redux';
import { showContacts, getMessages, sendMessageToDb } from '../services/operations/Message'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Chat = () => {
  const socket = useSocket(); 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const [selectedContact, setSelectedContact] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket && user) {
      socket.emit('register', user.id);
    }

    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [socket, user, selectedContact]);

  const getAllContacts = async () => {
    try {
      const response = showContacts(token);
      if (response instanceof Promise) {
        const data = await response;
        setContacts(data);
      } else {
        throw new Error("Response is not a Promise");
      }
    } catch (error) {
      console.log("Unable to fetch the contacts ", error);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const response = getMessages(token, contactId);
      if (response instanceof Promise) {
        const data = await response;
        setMessages(data);
      } else {
        throw new Error("Response is not a Promise");
      }
    } catch (error) {
      console.log("Unable to fetch messages ", error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    getAllContacts();

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() !== '' && selectedContact) {
      const timestamp = new Date();
      const newMessage = { receiverId: selectedContact.id, message, timestamp, senderId: user.id };

      try {
        await sendMessageToDb(token, message, selectedContact.id);
        socket.emit('user-message', newMessage);
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, isOwnMessage: true }]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message to the backend:', error);
      }
    }
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.id);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 border-r">
        <ContactCard contacts={contacts} onContactClick={handleContactClick} />
      </div>
      <div className="flex-3 p-4">
        <MessageCard messages={messages} />
        <div className="flex mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border p-2 mr-2"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

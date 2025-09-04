import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FlashMessageContext = createContext();

export const useFlashMessage = () => {
  return useContext(FlashMessageContext);
};

export const FlashMessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((text, type = 'info', duration = 5000) => {
    const id = uuidv4();
    const newMessage = { id, text, type };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, duration);
    }
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  }, []);

  const value = {
    messages,
    addMessage,
    removeMessage,
  };

  return (
    <FlashMessageContext.Provider value={value}>
      {children}
    </FlashMessageContext.Provider>
  );
};

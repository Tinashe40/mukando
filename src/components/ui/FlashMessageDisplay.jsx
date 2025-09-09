import React from 'react';
import { useFlashMessage } from '../../contexts/FlashMessageContext';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const FlashMessageDisplay = () => {
  const { messages, removeMessage } = useFlashMessage();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
            message.type === 'success' ? 'bg-green-500 text-white' :
            message.type === 'error' ? 'bg-red-500 text-white' :
            message.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          <Icon
            name={
              message.type === 'success' ? 'CheckCircle' :
              message.type === 'error' ? 'XCircle' :
              message.type === 'warning' ? 'AlertTriangle' :
              'Info'
            }
            size={20}
          />
          <p className="flex-1 text-sm font-medium">{message.text}</p>
          <button onClick={() => removeMessage(message.id)} className="text-white hover:text-gray-200">
            <Icon name="X" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FlashMessageDisplay;

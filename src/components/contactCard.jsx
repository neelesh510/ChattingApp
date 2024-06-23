// contactCard.jsx
import React from 'react';

const ContactCard = ({ contacts, onContactClick }) => {
  return (
    <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
      {contacts.map(contact => (
        <div
          key={contact.id}
          className="flex items-center p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => onContactClick(contact)}
        >
          <img
            src={contact.profilePicture}
            alt={contact.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-900">{contact.name}</div>
            <div className="text-sm text-gray-500">{contact.lastMessage}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactCard;

"use client";

import { useState } from 'react';
import axios from 'axios';
import { Send, Loader } from 'react-feather';


interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setMessages(prevMessages => [...prevMessages, { text: inputText, sender: 'user' }]);
    setInputText('');

    try {
      const response = await axios.post('http://localhost:8000/query', new URLSearchParams({ user_input: inputText }));
      const botResponse = response.data.response;
      setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleAboutClick = () => {
    setShowAboutModal(true);
  };

  const closeAboutModal = () => {
    setShowAboutModal(false);
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`sidebar h-full bg-gray-800 text-white p-8 w-64 ${showSidebar ? '' : 'hidden'} md:block`}>
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        <ul>
          <li className="cursor-pointer hover:text-gray-300 mb-2" onClick={handleAboutClick}>About Us</li>
          <li className="cursor-pointer hover:text-gray-300 mb-2" onClick={handleContactClick}>Contact Us</li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100 relative">
        {/* Messages */}
        <div className="message-container overflow-y-auto p-4">
          <div className="info-panel rounded-lg bg-purple-200 p-4 mb-4">
            <h1 className="text-xl font-semibold text-purple-800 mb-2">SD-Chatbot.ai</h1>
            {!loading && (
              <>
                <p className="text-gray-600 mb-2">About SD-Chatbot.ai:</p>
                <ul className="list-disc list-inside">
                  <li className="text-gray-600 mb-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                  <li className="text-gray-600 mb-1">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                  <li className="text-gray-600 mb-1">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                  <li className="text-gray-600 mb-1">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
                </ul>
              </>
            )}
          </div>
          {messages.map((message, index) => (
            <div key={index} className={`message p-4 rounded-lg mb-4 ${message.sender === 'user' ? 'self-end bg-purple-600 text-white' : 'self-start bg-violet-500 text-white'}`}>
              {message.text}
            </div>
          ))}
          {loading && <div className="flex justify-center mt-4"><div className="spinner"></div></div>}
        </div>
        {/* Input Box and Button */}
        <div className="input-section absolute bottom-0 left-0 w-full p-4 flex items-center bg-white">
          <input
            type="text"
            placeholder="Message Sd-Chatbot.ai"
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="input-box flex-1 py-2 px-4 border border-gray-300 rounded-full mr-4 focus:outline-none"
          />
          <button
  onClick={sendMessage}
  disabled={loading}
  className={`send-button py-2 px-6 rounded-full bg-indigo-500 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {loading ? <Loader className="animate-spin mr-2" /> : <Send className="mr-2" />} 
  {loading ? 'Sending...' : ''}
</button>
        </div>
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="sidebar-toggle absolute top-4 right-4 text-white md:hidden focus:outline-none bg-purple-600 hover:bg-purple-700 rounded-full px-4 py-2 shadow-lg border-2 border-purple-600"
        >
          {showSidebar ? 'Close' : 'Menu'}
        </button>
        {/* About Us Modal */}
        {showAboutModal && (
          <div className="modal bg-white p-8 rounded-lg flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Author 1 Information</h2>
                <p>Author 1 details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Author 2 Information</h2>
                <p>Author 2 details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Author 3 Information</h2>
                <p>Author 3 details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            </div>
            <button onClick={closeAboutModal} className="close-button bg-red-600 text-white px-4 py-2 rounded-lg self-center">Close</button>
          </div>
        )}

        {/* Contact Us Modal */}
        {showContactModal && (
          <div className="modal bg-white p-8 rounded-lg flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact 1 Information</h2>
                <p>Contact 1 details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact 2 Information</h2>
                <p>Contact 2 details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact 3 Information</h2>
                <p>Contact 3 details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            </div>
            <button onClick={closeContactModal} className="close-button bg-red-600 text-white px-4 py-2 rounded-lg self-center">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

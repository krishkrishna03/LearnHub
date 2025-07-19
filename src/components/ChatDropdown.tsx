import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface ChatMessage {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  recipient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const ChatDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchUsers();
      fetchUnreadCount();
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/chat/messages');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      const allUsers = response.data.users || [];
      // Filter out current user and show admins for regular users, students for admins
      const filteredUsers = allUsers.filter((u: User) => {
        if (u._id === user?.id) return false;
        if (user?.role === 'admin') return u.role !== 'admin';
        return u.role === 'admin';
      });
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/chat/unread-count');
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    try {
      await axios.post('/chat/send', {
        recipient: selectedUser._id,
        message: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getConversationMessages = (userId: string) => {
    return messages.filter(msg => 
      (msg.sender._id === userId && msg.recipient._id === user?.id) ||
      (msg.sender._id === user?.id && msg.recipient._id === userId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 relative"
      >
        <MessageCircle className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Messages</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex h-96">
            {/* Users List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {users.map((chatUser) => (
                <button
                  key={chatUser._id}
                  onClick={() => setSelectedUser(chatUser)}
                  className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 ${
                    selectedUser?._id === chatUser._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">
                    {chatUser.firstName} {chatUser.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{chatUser.role}</div>
                </button>
              ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="font-medium text-sm">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-2">
                    {getConversationMessages(selectedUser._id).map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            msg.sender._id === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type a message..."
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                  Select a user to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDropdown;

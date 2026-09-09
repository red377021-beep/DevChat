import {
  Search,
  Plus,
  MoreVertical,
} from "lucide-react";

import chats from "../../data/chats";
import { useChat } from "../../context/ChatContext";
import Avatar from "../common/Avatar/Avatar";

import "./ChatList.css";

function ChatList() {
  const { selectedChat, setSelectedChat } = useChat();

  return (
    <section className="chat-list">
      {/* Header */}
      <div className="chat-list-header">
        <div className="header-text">
          <span>Welcome Back 👋</span>
          <h2>Chats</h2>
        </div>

        <div className="header-actions">
          <button className="header-btn">
            <Plus size={20} />
          </button>

          <button className="header-btn">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="chat-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search chats..."
        />
      </div>

      {/* Chat List */}
      <div className="chat-list-body">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-card ${
              selectedChat.id === chat.id ? "active-chat" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <Avatar
              name={chat.name}
              image={chat.avatar}
              online={chat.online}
              size="md"
            />

            <div className="chat-info">
              <div className="chat-top">
                <h4>{chat.name}</h4>

                <span>{chat.time}</span>
              </div>

              <div className="chat-bottom">
                <p>{chat.lastMessage}</p>

                {chat.unread > 0 && (
                  <div className="unread-badge">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ChatList;
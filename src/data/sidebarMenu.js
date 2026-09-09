import {
    MessageCircle,
    UserPlus,
    CirclePlay,
    Users,
    BookOpen,
    Phone,
    Bot,
    Bell,
    Settings,
} from "lucide-react";

const sidebarMenu = [

    // ==========================================
    // CHATS
    // ==========================================

    {
        id: "chats",
        label: "Chats",
        icon: MessageCircle,
        path: "/",
    },

    // ==========================================
    // FRIENDS
    // ==========================================

    {
        id: "friends",
        label: "Friends",
        icon: UserPlus,
        path: "/friends",
    },

    // ==========================================
    // REELS
    // ==========================================

    {
        id: "reels",
        label: "Reels",
        icon: CirclePlay,
        path: "/reels",
    },

    // ==========================================
    // GROUPS
    // ==========================================

    {
        id: "groups",
        label: "Groups",
        icon: Users,
        path: "/groups",
    },

    // ==========================================
    // STORIES
    // ==========================================

    {
        id: "stories",
        label: "Stories",
        icon: BookOpen,
        path: "/stories",
    },

    // ==========================================
    // CALLS
    // ==========================================

    {
        id: "calls",
        label: "Calls",
        icon: Phone,
        path: "/calls",
    },

    // ==========================================
    // AI
    // ==========================================

    {
        id: "ai",
        label: "AI",
        icon: Bot,
        path: "/ai",
    },

    // ==========================================
    // NOTIFICATIONS
    // ==========================================

    {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        path: "/notifications",
    },

    // ==========================================
    // SETTINGS
    // ==========================================

    {
        id: "settings",
        label: "Settings",
        icon: Settings,
        path: "/settings",
    },

];

export default sidebarMenu;
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare, Send, Search, User, ShieldCheck,
  CheckCheck, Clock, Sparkles, ChevronLeft
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"

export default function Messages() {
  const [conversations, setConversations] = useState([])
  const [activeConvo, setActiveConvo] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef(null)

  const { user } = useAuthStore()

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (activeConvo) {
      fetchMessages(activeConvo.id)
    }
  }, [activeConvo])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const convos = await api.messages.getConversations()
      setConversations(convos)
      if (convos.length > 0 && !activeConvo) {
        setActiveConvo(convos[0])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (convoId) => {
    try {
      const msgs = await api.messages.getMessages(convoId)
      setMessages(msgs)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConvo) return

    const text = newMessage
    setNewMessage("")

    try {
      const otherUserId = activeConvo.participant_ids.find(id => id !== user?.id)
      const sent = await api.messages.sendMessage({
        conversationId: activeConvo.id,
        recipientId: otherUserId,
        text
      })
      setMessages(prev => [...prev, sent])
      // Update snippet in conversation list
      setConversations(prev =>
        prev.map(c => c.id === activeConvo.id ? { ...c, last_message: text, last_message_time: new Date().toISOString() } : c)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const filteredConversations = conversations.filter(c => {
    if (!searchQuery) return true
    return (
      c.otherUser?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative h-[calc(100vh-6rem)] flex flex-col">
      {/* Ambient Auroras */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-cyan-500/10 top-0 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[500px] h-[300px] bg-pink-500/10 bottom-0 right-10 pointer-events-none" />

      {/* Main Glass Shell */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 rounded-3xl bg-[#0B0F1C]/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Left Sidebar: Conversations (4 cols) */}
        <div className={`md:col-span-4 border-r border-white/10 flex flex-col h-full bg-[#070A14]/70 ${activeConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-cyan-400" /> Matrix Chat
              </h2>
              <Badge variant="verified" size="xs">Encrypted P2P</Badge>
            </div>
            <Input
              placeholder="Search conversations..."
              leftIcon={<Search size={15} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F1C] border-white/10 text-xs h-9"
            />
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-hide">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(convo => {
                const isSelected = activeConvo?.id === convo.id
                return (
                  <button
                    key={convo.id}
                    onClick={() => setActiveConvo(convo)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500/10 border-l-2 border-cyan-400"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                      {convo.otherUser?.avatar_url ? (
                        <img src={convo.otherUser.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        convo.otherUser?.full_name?.charAt(0) || "U"
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-sm text-white truncate">
                          {convo.otherUser?.full_name || "Campus Peer"}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {new Date(convo.last_message_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate leading-snug">
                        {convo.last_message}
                      </p>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No active conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat (8 cols) */}
        <div className={`md:col-span-8 flex flex-col h-full bg-[#0E1322]/80 ${activeConvo ? 'flex' : 'hidden md:flex'}`}>
          {activeConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#070A14]/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvo(null)}
                    className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-xs">
                    {activeConvo.otherUser?.avatar_url ? (
                      <img src={activeConvo.otherUser.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      activeConvo.otherUser?.full_name?.charAt(0) || "U"
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {activeConvo.otherUser?.full_name}
                      <VerifiedBadge size="xs" />
                    </h3>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active on Campus Matrix
                    </span>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {activeConvo.otherUser?.university}
                </span>
              </div>

              {/* Message History Timeline */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
                {messages.map(msg => {
                  const isMine = msg.sender_id === user?.id
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-md ${
                        isMine
                          ? 'bg-gradient-to-r from-cyan-600 to-primary text-white rounded-br-xs'
                          : 'bg-[#0B0F1C] border border-white/10 text-white rounded-bl-xs'
                      }`}>
                        <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                        <span className="text-[9px] opacity-70 block text-right mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#070A14]/70">
                <Input
                  required
                  placeholder="Type an instant message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-[#0B0F1C] border-white/10 text-xs sm:text-sm h-11"
                />
                <Button type="submit" variant="glow" size="icon" className="shrink-0 h-11 w-11 rounded-xl">
                  <Send size={16} />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <MessageSquare size={48} className="text-cyan-400/40 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Select a Conversation</h3>
              <p className="text-xs max-w-xs">
                Pick a classmate from the list on the left to start trading notes, gear, or discussing roommate openings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

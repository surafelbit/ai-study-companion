import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/AuthProvider";
import { toast } from "react-toastify";

export default function DocumentQA() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Optionally fetch initial AI response history here if the backend supports it, 
    // but for now we'll start with an empty chat or a welcome message.
    useEffect(() => {
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                content: "Hello! I have analyzed this document. What would you like to know about it?",
            }
        ]);
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;

            const response = await axios.post(
                `http://localhost:5000/api/ai/ask/${id}`,
                { question: userMessage.content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.data.answer || "Sorry, I couldn't generate an answer.",
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error asking question:", error);
            toast.error("Failed to get an answer from AI.");
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Sorry, there was an error processing your request. Please try again.",
                    isError: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard/my-files")}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                        aria-label="Back to files"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Document Q&A</h2>
                        <p className="text-sm text-gray-500">Ask questions about your uploaded file</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-600">AI Tutor Online</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm ${message.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                    : message.isError
                                        ? "bg-red-50 text-red-800 border border-red-100 rounded-tl-sm"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {message.role === "assistant" && (
                                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                )}
                                <span className={`text-xs font-semibold tracking-wide uppercase ${message.role === "user" ? "text-blue-100" : "text-gray-400"
                                    }`}>
                                    {message.role === "user" ? "You" : "AI Tutor"}
                                </span>
                            </div>
                            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap pl-1">
                                {message.content}
                            </p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about this document..."
                            disabled={loading}
                            className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm md:text-base disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md flex-shrink-0 flex items-center justify-center group"
                    >
                        <svg
                            className="w-5 h-5 transform rotate-90 group-hover:translate-x-0.5 transition-transform"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-xs text-gray-400">AI can make mistakes. Consider verifying important information.</p>
                </div>
            </div>
        </div>
    );
}

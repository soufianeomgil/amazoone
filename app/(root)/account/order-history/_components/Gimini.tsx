"use client"

import { Spinner } from "@/components/ui/spinner";
import { X } from "lucide-react";
import { useState } from "react";

const Gimini = () => {
      const [isChatOpen, setIsChatOpen] = useState(false);
  
      const [chatInput, setChatInput] = useState("");
      const [chatHistory, setChatHistory] = useState<{ role: "user" | "model"; text: string }[]>([]);
      const [isLoading, setIsLoading] = useState(false);
    
const mockOrders = [
  {
    orderNumber: "113-8937428-8473051",
    orderPlacedDate: "October 27, 2024",
    total: 194.38,
    shipTo: "John Doe",
    deliveryDate: "October 29, 2024",
    status: "Delivered",
    items: [
      {
        id: 1,
        name: "Echo Dot (5th Gen) | Smart speaker with Alexa | Charcoal",
        image: "https://m.media-amazon.com/images/I/61eudOzC8zL._AC_AA180_.jpg",
      },
      {
        id: 2,
        name: 'Kindle Paperwhite (16 GB) – Now with a 6.8" display and adjustable warm light',
        image: "https://m.media-amazon.com/images/I/61eudOzC8zL._AC_AA180_.jpg",
      },
    ],
  },
  {
    orderNumber: "113-2948204-4485853",
    orderPlacedDate: "September 15, 2024",
    total: 45.99,
    shipTo: "John Doe",
    deliveryDate: "September 17, 2024",
    status: "Delivered",
    items: [
      {
        id: 3,
        name:
          "Amazon Basics 48-Pack AA High-Performance Alkaline Batteries, 10-Year Shelf Life",
        image: "https://m.media-amazon.com/images/I/61eudOzC8zL._AC_AA180_.jpg",
      },
    ],
  },
];
      // Submit the chat question to a server endpoint that calls Gemini (server must implement /api/genai).
      const handleChatSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || isLoading) return;
    
        const userMessage = { role: "user" as const, text: chatInput.trim() };
        setChatHistory((prev) => [...prev, userMessage]);
        const question = chatInput.trim();
        setChatInput("");
        setIsLoading(true);
    
        try {
          // call your server-side wrapper that has the API key and calls Gemini
          const resp = await fetch("/api/genai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, orders: mockOrders }),
          });
    
          if (!resp.ok) {
            throw new Error("Server error");
          }
    
          const json = await resp.json();
          // expecting { text: "..." } from server
          const modelText = json?.text ?? "Sorry — I couldn't get a response right now.";
          const modelMessage = { role: "model" as const, text: modelText };
    
          setChatHistory((prev) => [...prev, modelMessage]);
        } catch (err) {
          console.error("GenAI error:", err);
          setChatHistory((prev) => [
            ...prev,
            { role: "model", text: "Sorry, I'm having trouble connecting to the assistant right now." },
          ]);
        } finally {
          setIsLoading(false);
        }
      };
  return (
    <div>
           <div className="fixed bottom-6 right-6 z-40">
                   <button
                     onClick={() => setIsChatOpen(true)}
                     className="flex items-center gap-3 bg-linear-to-br from-yellow-400 to-orange-400 text-black px-4 py-3 rounded-full shadow-xl hover:scale-[1.02] transition transform"
                     aria-label="Ask about your orders"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                     </svg>
                     <span className="font-semibold">Ask assistant</span>
                   </button>
                 </div>
         
                 {/* Chat Drawer */}
                 {isChatOpen && (
                   <div
                     id="orders-chat"
                     role="dialog"
                     aria-modal="true"
                     className="fixed bottom-20 right-6 z-50 w-[22rem] sm:w-[28rem] max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
                   >
                     <header className="flex items-center justify-between bg-gray-900 text-white px-4 py-3">
                       <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-semibold">AI</div>
                         <div>
                           <div className="font-medium">Order Assistant</div>
                           <div className="text-xs text-gray-200">Ask about your recent orders</div>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <button
                           aria-label="Close chat"
                           onClick={() => setIsChatOpen(false)}
                           className="p-1 rounded hover:bg-white/10"
                         >
                           <X className="w-5 h-5 text-white" />
                         </button>
                       </div>
                     </header>
         
                     <div className="flex-1 p-4 overflow-auto space-y-3">
                       {chatHistory.length === 0 && !isLoading && (
                         <div className="text-sm text-gray-500">Ask about delivery dates, order totals, or which items shipped together.</div>
                       )}
         
                       {chatHistory.map((m, i) => (
                         <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                           <div className={`px-3 py-2 rounded-md max-w-[80%] ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                             {m.text}
                           </div>
                         </div>
                       ))}
         
                       {isLoading && (
                         <div className="flex justify-start">
                           <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-700">
                             <Spinner className="animate-spin" />
                           </div>
                         </div>
                       )}
                     </div>
         
                     <form onSubmit={handleChatSubmit} className="px-4 py-3 border-t bg-white">
                       <div className="flex gap-2">
                         <input
                           aria-label="Type your question"
                           className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                           placeholder="When was my Echo Dot delivered?"
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           disabled={isLoading}
                         />
                         <button
                           type="submit"
                           disabled={isLoading}
                           className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-orange-400 hover:bg-orange-500 text-white disabled:opacity-60"
                         >
                           {isLoading ? <Spinner className="w-4 h-4 animate-spin" /> : "Send"}
                         </button>
                       </div>
                     </form>
                   </div>
                 )}
    </div>
  )
}

export default Gimini
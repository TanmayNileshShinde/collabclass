import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoorOpen, Speech } from "lucide-react";


const FEATURES = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
        ),
        title: "Live GitHub Explorer",
        desc: "Browse, review any public GitHub repository directly inside your meeting. No tab-switching, no context loss.",
        color: "from-cyan-500/20 to-blue-600/10",
        accent: "#22d3ee",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
        ),
        title: "Infinite Whiteboard",
        desc: "Sketch flows, wireframes, and diagrams on a infinite canvas. sticky notes, shapes, and laser pointer.",
        color: "from-blue-500/20 to-indigo-600/10",
        accent: "#60a5fa",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        ),
        title: "AI Meeting Chatbot",
        desc: "Ask questions, summarize discussions, generate code snippets, and get instant explanations—without leaving the call.",
        color: "from-teal-500/20 to-cyan-600/10",
        accent: "#2dd4bf",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
        ),
        title: "Team Chat",
        desc: "Persistent chat with threaded replies, emoji reactions and code blocks. Your meeting conversations, organized.",
        color: "from-sky-500/20 to-blue-600/10",
        accent: "#38bdf8",
    },
    {
        icon: (
            <DoorOpen />
        ),
        title: "Personal Meeting Room",
        desc: "A permanent Url for each user for their personal Meeting Room.",
        color: "from-blue-600/20 to-sky-500/10",
        accent: "#818cf8",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
        ),
        title: "Screen Share & Record",
        desc: "Crystal-clear screen sharing . Record sessions in real time.",
        color: "from-cyan-600/20 to-teal-500/10",
        accent: "#06b6d4",
    },
];

const STATS = [
    { value: "5+", label: "Built in Tools" },
    { value: "AI", label: "Assistance Bot" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "110ms", label: "Avg. Latency" },
];


function MockMeetingUI() {
    const [activeTab, setActiveTab] = useState("code");
    const tabs = ["code", "board", "ai", "chat"];
    const tabLabels: any = { code: "GitHub", board: "Whiteboard", ai: "AI Chatbot", chat: "Chat" };
useEffect(() => {
  const tabs = ["code", "board", "ai", "chat"];
  let i = 0;

  const interval = setInterval(() => {
    i = (i + 1) % tabs.length;
    setActiveTab(tabs[i]);
  }, 2000);

  return () => clearInterval(interval);
}, []);
    return (
        <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.15)] border border-cyan-500/20">
            {/* Window chrome */}
            <div className="bg-gray-950 border-b border-white/5 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="bg-white/5 rounded-md px-4 py-1 text-xs text-white/30 font-mono">
                        Meeting for xyz 
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-white/30">4 live</span>
                </div>
            </div>

            <div className="flex h-[380px] bg-gray-950">
                {/* Sidebar tabs */}
                <div className="w-14 bg-black/40 border-r border-white/5 flex flex-col items-center py-4 gap-3">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs transition-all ${activeTab === t
                                ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
                                : "text-white/20 hover:text-white/50"
                                }`}
                            title={tabLabels[t]}
                        >
                            {t === "code" && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                </svg>
                            )}
                            {t === "board" && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                </svg>
                            )}
                            {t === "ai" && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                            )}
                            {t === "chat" && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>
                            )}
                        </button>
                    ))}
                    <div className="flex-1" />
                    {/* Avatar stack */}
                    <div className="flex flex-col gap-1">
                        {["🧑‍💻", "👩‍🎨", "🧑‍🔬", "👨‍💼"].map((e, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-sm">
                                {e}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === "code" && (
                        <div className="h-full flex flex-col">
                            <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2 text-xs text-white/40">
                                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-white/30"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                                <span className="text-white/50">Bezos</span>
                                <span>/</span>
                                <span className="text-cyan-400">amazon-dashboard</span>
                                <span className="ml-auto text-white/20">src/components/Chart.tsx</span>
                            </div>
                            <div className="flex-1 font-mono text-xs p-3 overflow-auto">
                                {[
                                    { ln: "1", code: <span><span className="text-purple-400">import</span> <span className="text-cyan-300">React</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</span> },
                                    { ln: "2", code: <span><span className="text-purple-400">import</span> {"{ "}<span className="text-cyan-300">LineChart, Line, XAxis</span>{" }"} <span className="text-purple-400">from</span> <span className="text-green-400">'recharts'</span>;</span> },
                                    { ln: "3", code: "" },
                                    { ln: "4", code: <span className="text-white/20">{"// Component starts"}</span> },
                                    { ln: "5", code: <span><span className="text-blue-400">const</span> <span className="text-yellow-300">Chart</span> = {"({ data }: Props) => {"}</span> },
                                    { ln: "6", code: <span className="pl-4"><span className="text-purple-400">return</span> {"("}</span> },
                                    { ln: "7", code: <span className="pl-8">{"<"}<span className="text-cyan-400">LineChart</span> <span className="text-yellow-200">width</span>=<span className="text-orange-300">{"{500}"}</span> <span className="text-yellow-200">height</span>=<span className="text-orange-300">{"{300}"}</span>{">"}</span> },
                                    { ln: "8", code: <span className="pl-12">{"<"}<span className="text-cyan-400">Line</span> <span className="text-yellow-200">type</span>=<span className="text-green-400">"monotone"</span> <span className="text-yellow-200">dataKey</span>=<span className="text-green-400">"value"</span> {"/>"}</span> },
                                    { ln: "9", code: <span className="pl-8">{"</"}<span className="text-cyan-400">LineChart</span>{">"}</span> },
                                    { ln: "10", code: <span className="pl-4">{");"}</span> },
                                    { ln: "11", code: <span>{"}"}</span> },
                                ].map((row, i) => (
                                    <div key={i} className={`flex gap-4 py-0.5 hover:bg-cyan-500/5 rounded ${i === 3 ? "bg-yellow-500/5" : ""}`}>
                                        <span className="text-white/20 w-4 text-right flex-shrink-0">{row.ln}</span>
                                        <span className="text-white/70">{row.code}</span>
                                    </div>
                                ))}
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="w-2 h-4 bg-cyan-400 animate-pulse rounded-sm" />
                                    <span className="text-xs text-white/20">Alex is here · line 8</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "board" && (
                        <div className="h-full relative bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.03)_0%,transparent_70%)]">
                            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(34,211,238,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                            {/* Sticky notes */}
                            <div className="absolute top-8 left-12 w-28 bg-yellow-400/90 rounded p-2 text-xs text-gray-900 font-medium shadow-lg rotate-[-2deg]">
                                Auth flow needs redesign 🔥
                            </div>
                            <div className="absolute top-6 left-44 w-28 bg-cyan-300/90 rounded p-2 text-xs text-gray-900 font-medium shadow-lg rotate-[1.5deg]">
                                API latency &lt; 200ms goal
                            </div>
                            <div className="absolute top-24 left-28 w-28 bg-pink-300/90 rounded p-2 text-xs text-gray-900 shadow-lg rotate-[-1deg]">
                                Mobile-first layout ✅
                            </div>
                            {/* Shapes */}
                            <svg className="absolute bottom-12 right-12 w-40 h-32 opacity-60" viewBox="0 0 160 120">
                                <rect x="10" y="10" width="60" height="40" rx="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                                <rect x="90" y="10" width="60" height="40" rx="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                                <line x1="70" y1="30" x2="90" y2="30" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 2" />
                                <rect x="50" y="70" width="60" height="40" rx="4" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                                <line x1="40" y1="50" x2="70" y2="70" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 2" />
                                <line x1="120" y1="50" x2="90" y2="70" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 2" />
                                <text x="25" y="33" fill="#22d3ee" fontSize="8">Login</text>
                                <text x="108" y="33" fill="#22d3ee" fontSize="8">Dashboard</text>
                                <text x="63" y="93" fill="#60a5fa" fontSize="8">Settings</text>
                            </svg>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                {["✏️", "⬜", "⭕", "🖐️", "🔍"].map((t) => (
                                    <button key={t} className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded text-sm border border-white/10">{t}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "ai" && (
                        <div className="h-full flex flex-col">
                            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs">✦</div>
                                <span className="text-sm text-white/60 font-medium">AI Chatbot</span>
                                <div className="ml-auto flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs text-white/30">Ready</span>
                                </div>
                            </div>
                            <div className="flex-1 p-3 space-y-3 overflow-auto">
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-pink-950 border border-pink-700/40 flex items-center justify-center text-xs flex-shrink-0">👩</div>
                                    <div className="bg-white/5 rounded-lg rounded-tl-none px-3 py-2 text-xs text-white/70 max-w-[75%]">
                                        Explain Constructor in C++
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 rounded-lg rounded-tr-none px-3 py-2 text-xs text-cyan-100/80 max-w-[80%]">
                                        A
                                        <code className="bg-black/30 px-1 rounded text-cyan-300">constructor</code>in C++ is a special member function of a class that is automatically called when an object is created.
                                        It is used to initialize the object's data members and has the same name as the class with no return type.
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs flex-shrink-0">✦</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-pink-950 border border-pink-700/40 flex items-center justify-center text-xs flex-shrink-0">👩</div>
                                    <div className="bg-white/5 rounded-lg rounded-tl-none px-3 py-2 text-xs text-white/70 max-w-[75%]">
                                        Explain object oriented programming
                                    </div>
                                </div>
                            </div>
                            <div className="px-3 py-2 border-t border-white/5">
                                <div className="bg-white/5 rounded-lg flex items-center px-3 py-2 gap-2">
                                    <input className="flex-1 bg-transparent text-xs text-white/50 outline-none placeholder:text-white/20" placeholder="Ask AI anything about this meeting..." />
                                    <button className="w-6 h-6  rounded-md bg-cyan-500/30 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-cyan-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "chat" && (
                        <div className="h-full flex flex-col">
                            <div className="flex-1 p-3 space-y-3 overflow-auto">
                                {[
                                    { avatar: "🧑‍💻", name: "Alex", msg: "Just pushed the latest auth changes, can everyone review?", time: "2:14 PM" },
                                    { avatar: "👩‍🎨", name: "Priya", msg: "On it! The whiteboard sketch looks great btw 🔥", time: "2:15 PM" },
                                    { avatar: "🧑‍🔬", name: "Sam", msg: "AI just flagged a potential race condition in the login handler", time: "2:16 PM" },
                                    { avatar: "👨‍💼", name: "Jordan", msg: "Let's block 30 min tomorrow to fix it. Logging to Jira.", time: "2:16 PM" },
                                ].map((m, i) => (
                                    <div key={i} className="flex gap-2">
                                        <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800/30 flex items-center justify-center text-sm flex-shrink-0">{m.avatar}</div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-0.5">
                                                <span className="text-xs font-semibold text-cyan-300">{m.name}</span>
                                                <span className="text-[10px] text-white/20">{m.time}</span>
                                            </div>
                                            <div className="text-xs text-white/60 bg-white/5 rounded-lg rounded-tl-none px-3 py-1.5">{m.msg}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-3 py-2 border-t border-white/5">
                                <div className="bg-white/5 rounded-lg flex items-center px-3 py-2 gap-2">
                                    <span className="text-lg">&gt;</span>
                                    <input className="flex-1 bg-transparent text-xs text-white/50 outline-none placeholder:text-white/20" placeholder="Message the team..." />
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white/20 cursor-pointer hover:text-cyan-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CollabClassLanding() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSignIn = () => {
        navigate('/sign-in');
    };

    const handleGetStarted = () => {
        navigate('/sign-in');
    };

    const handleLaunchMeeting = () => {
        navigate('/sign-in');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .font-display { font-family: 'Space Grotesk', sans-serif; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glow-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes slide-up { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(.22,1,.36,1) forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #22d3ee, #60a5fa, #22d3ee);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .feature-card:hover .feature-icon { transform: scale(1.1) rotate(-3deg); }
        .feature-icon { transition: transform 0.3s cubic-bezier(.34,1.56,.64,1); }

        .ocean-bg {
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(8,80,120,0.4) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 40% at 20% 80%, rgba(34,211,238,0.06) 0%, transparent 50%),
                      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(96,165,250,0.06) 0%, transparent 50%);
        }
      `}</style>

            {/* ── NAVBAR ── */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-gray-950/90 backdrop-blur-lg shadow-lg shadow-black/20" : ""}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                            <Speech />
                        </div>
                        <span className="font-display font-700 text-lg tracking-tight">
                            Collab<span className="text-cyan-400">Class</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleSignIn} className="hidden md:block text-sm text-white/50 hover:text-white transition-colors">Sign in</button>
                        <button onClick={handleGetStarted} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-cyan-500/40 hover:scale-[1.02]">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 ocean-bg overflow-hidden">
                {/* Glow orbs */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/8 blur-[120px] pointer-events-none animate-glow" />
                <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/8 blur-[80px] pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs text-cyan-300 mb-8 animate-slide-up">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Get Started for Free · Perfect for small teams
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl font-700 leading-[1.05] tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        Where teams<br />
                        <span className="shimmer-text">meet and build</span><br />
                        together.
                    </h1>

                    <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        CollabClass brings your code, whiteboard, AI Chatbot, and team chat into one frictionless meeting space. No tab chaos. No context switching. Just flow.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                        <button onClick={handleLaunchMeeting} className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-[1.02] flex items-center gap-2">
                            Launch a Meeting
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </button>
                        <button className="text-white/50 hover:text-white px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2 text-sm font-medium">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-cyan-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>
                            WebRTC powered
                        </button>
                    </div>

                    {/* Social proof */}
                    <div className="mt-10 flex items-center justify-center gap-4 text-xs text-white/25 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                        <span>A Platform which is </span>
                        {["Simple", "Lightweight", "Efficient"].map((c) => (
                            <span key={c} className="text-white/40 font-semibold">{c}</span>
                        ))}
                    </div>
                </div>

                {/* Mock UI */}
                <div className="relative z-10 mt-16 w-full max-w-3xl mx-auto animate-float" style={{ animationDelay: "1s" }}>
                    <MockMeetingUI />
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="py-16 border-y border-white/5 bg-black/20">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="font-display text-3xl md:text-4xl font-700 text-cyan-400 mb-1">{s.value}</div>
                            <div className="text-sm text-white/30">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs uppercase tracking-widest text-cyan-500 font-semibold mb-4">Everything you need</p>
                        <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight mb-4">
                            A meeting room that<br />actually works.
                        </h2>
                        <p className="text-white/40 text-lg max-w-xl mx-auto">Every tool your team reaches for, built natively into the call.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="feature-card group relative rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 p-6 transition-all duration-300 overflow-hidden cursor-default"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="relative z-10">
                                    <div
                                        className="feature-icon inline-flex p-3 rounded-xl mb-4"
                                        style={{ background: `${f.accent}15`, color: f.accent, border: `1px solid ${f.accent}25` }}
                                    >
                                        {f.icon}
                                    </div>
                                    <h3 className="font-display font-600 text-lg mb-2 text-white">{f.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs uppercase tracking-widest text-cyan-500 font-semibold mb-4">Simple by design</p>
                        <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight">Up in seconds.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Create a room", desc: "Click 'Launch' and instantly get a shareable link. No account needed to join." },
                            { step: "02", title: "Invite your team", desc: "Share the link or invite by email. Everyone joins with full access to all tools." },
                            { step: "03", title: "Build together", desc: "Browse GitHub repos, sketch on the whiteboard, chat with AI — all in one place." },
                        ].map((s) => (
                            <div key={s.step} className="relative">
                                <div className="font-display text-6xl font-700 text-white/5 mb-3 select-none">{s.step}</div>
                                <div className="w-8 h-px bg-gradient-to-r from-cyan-500 to-transparent mb-4" />
                                <h3 className="font-display font-600 text-xl mb-2">{s.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIAL ── */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-blue-950/20 p-10 md:p-14 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative text-center">
                            <h3 className="font-display text-3xl md:text-4xl font-semibold mb-6 text-white">
                                Why CollabClass?
                            </h3>

                            <p className="text-white/60 text-lg leading-relaxed mb-8">
                                Remote collaboration often means jumping between GitHub, whiteboards,
                                chat apps, and video calls. Context gets lost and productivity drops.
                                CollabClass brings code, discussions, AI assistance, and collaborative
                                tools into a single workspace so teams can build together without
                                switching tabs.
                            </p>

                            <div className="text-sm text-cyan-400 font-medium">
                                Built as a collaborative engineering workspace prototype
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/6 blur-[100px] pointer-events-none animate-glow" />
                <div className="relative max-w-3xl mx-auto text-center">
                    <h2 className="font-display text-5xl md:text-6xl font-700 tracking-tight mb-6">
                        Ready to <span className="shimmer-text">collab better?</span>
                    </h2>
                    <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                        Start free.
                    </p>
                    <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-[1.03] flex items-center gap-3 mx-auto" onClick={handleSignIn}  >
                        Get started for free
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                    <p className="mt-4 text-xs text-white/20">Free for All · Unlimited rooms · </p>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <span className="font-display font-700 text-sm">Collab<span className="text-cyan-400">Class</span></span>
                    </div>
                    <p className="text-xs text-white/20">© 2026 CollabClass, Inc.</p>
                </div>
            </footer>
        </div>
    );
}
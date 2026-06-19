import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, MessageSquare, Sparkles, BookOpen, BrainCircuit, ExternalLink, Send, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');

  // Chat States
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // AI Actions States
  const [conceptText, setConceptText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  // File size format helper
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await documentService.getDocumentById(id);
        setDocument(data);

        // Initial welcoming system message for AI Chat tab
        setMessages([
          {
            sender: 'ai',
            text: `Hello! I have fully processed "${data?.name || data?.title || 'this document'}". Switch between the tabs above to read the document content, generate flashcards, or take comprehensive quizzes! How can I assist you right now?`
          }
        ]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch document details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    // Mock AI delay setup
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `I am reviewing the text parameters inside "${document?.name || 'this document'}" to accurately answer your question.` 
      }]);
      setChatLoading(false);
    }, 1000);
  };

  // Actions handlers placeholders
  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      // TODO: Connect your Gemini API route here
      console.log("Summarizing document:", document?._id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!conceptText.trim()) return;
    setIsExplaining(true);
    try {
      // TODO: Connect your Gemini API concept explanation route here
      console.log("Explaining concept:", conceptText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
  };

  // ================= TABS RENDER LOGIC =================
  const renderContentTab = () => {
    let finalPdfUrl = "";

    if (document?.fileUrl && document.fileUrl.startsWith('http')) {
      finalPdfUrl = document.fileUrl;
    } else {
      const rawPath = document?.filePath || document?.path || document?.fileUrl || "";
      if (rawPath) {
        const fileName = rawPath.split(/[/\\]/).pop(); 
        finalPdfUrl = `http://localhost:8000/uploads/documents/${fileName}`;
      }
    }

    console.log("Anu, dynamic configuration ke baad final PDF URL yeh bana hai:", finalPdfUrl);

    return (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <span className="text-sm font-semibold text-slate-700">Document Viewer</span>
          {finalPdfUrl && (
            <a 
              href={finalPdfUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Open in new tab</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        
        <div className="w-full bg-slate-50 rounded-xl border border-slate-200/60 overflow-hidden h-[600px] flex items-center justify-center">
          {finalPdfUrl ? (
            <iframe 
              src={`${finalPdfUrl}#toolbar=0`} 
              title="Document PDF Content" 
              className="w-full h-full animate-in fade-in duration-300"
            />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <FileText size={40} className="mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">Document preview url not found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 2. CHAT TAB
  const renderChatTab = () => (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 text-sm shadow-sm rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none'
                : 'bg-slate-100 text-slate-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-400 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce [animation-delay:0.2s]">•</span>
              <span className="animate-bounce [animation-delay:0.4s]">•</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex gap-2">
        <input 
          type="text" 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask a question about this material..."
          className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
        />
        <button type="submit" className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/10 active:scale-95 transition-all">
          <Send size={16} />
        </button>
      </form>
    </div>
  );

  // 3. AI ACTIONS TAB
  const renderAIActions = () => {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles size={24} className="fill-white/10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI Assistant</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Powered by advanced AI</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
          {/* ACTION CARD A: Generate Summary */}
          <div className="border border-slate-100 rounded-xl p-5 hover:border-slate-200/80 transition-all bg-slate-50/40 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100/50">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Generate Summary</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Get a concise summary of the entire document. Perfect for quick revisions.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleGenerateSummary}
                disabled={isSummarizing}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-emerald-400 rounded-xl shadow-sm shadow-emerald-500/10 transition-all duration-200 min-w-[90px]"
              >
                {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : 'Summarize'}
              </button>
            </div>
          </div>

          {/* ACTION CARD B: Explain a Concept */}
          <div className="border border-slate-100 rounded-xl p-5 hover:border-slate-200/80 transition-all bg-slate-50/40 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0 border border-amber-100/50">
                <Lightbulb size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800">Explain a Concept</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter a topic or concept from the document to get a detailed explanation from the AI tutor.
                </p>
              </div>
            </div>

            <form onSubmit={handleExplainConcept} className="flex gap-2 mt-2">
              <input
                type="text"
                value={conceptText}
                onChange={(e) => setConceptText(e.target.value)}
                placeholder="e.g., 'React Hooks' or 'State Management'"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
              <button
                type="submit"
                disabled={isExplaining || !conceptText.trim()}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl transition-all duration-200 gap-1 shrink-0"
              >
                {isExplaining ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <span>Explain</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // ================= 4. FLASHCARDS TAB (Upgraded Grid View) =================
  const renderFlashcardsTab = () => {
    // Mock state setup - jab aap backend endpoints add kareingi, toh ise api data se fill kar sakti hain
    // Real data me aap card elements loop use kareingi jaisa screenshot me h: {set.cards.length} cards
    const mockFlashcardSets = [
      {
        id: "fc_1",
        title: "Flashcard Set",
        createdAt: "2025-11-22T10:00:00.000Z",
        cardCount: 10
      }
    ];

    const handleGenerateNewSet = () => {
      toast.success("AI Generation triggered for flashcard set!");
      // TODO: Add your flashcard generation endpoint logic here
      console.log("Generating cards for doc:", id);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Top Management Header Action Box */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Your Flashcard Sets</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              {mockFlashcardSets.length} {mockFlashcardSets.length === 1 ? 'set' : 'sets'} available for revision
            </p>
          </div>
          
          <button
            onClick={handleGenerateNewSet}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-98 rounded-xl shadow-sm shadow-emerald-500/10 transition-all shrink-0"
          >
            <span>+</span>
            <span>Generate New Set</span>
          </button>
        </div>

        {/* Flashcard Sets Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFlashcardSets.map((set) => (
            <div 
              key={set.id}
              onClick={() => navigate(`/flashcards/${set.id}`)} // Pure click navigation interface rule
              className="group bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md/5 p-5 transition-all cursor-pointer relative flex flex-col justify-between min-h-[160px]"
            >
              <div className="space-y-3">
                {/* Emerald Brain/Icon Box wrapper wrapper frame */}
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/40 group-hover:scale-105 transition-transform duration-200">
                  <BrainCircuit size={20} className="stroke-[2]" />
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                    {set.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>
              </div>

              {/* Metrics Badge Counter Frame */}
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg">
                  {set.cardCount} {set.cardCount === 1 ? 'card' : 'cards'}
                </span>
                <span className="text-[11px] text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex items-center gap-0.5">
                  Study now →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  };

  // 5. QUIZZES TAB
  const renderQuizzesTab = () => (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center space-y-4">
      <BrainCircuit size={36} className="mx-auto text-teal-500" />
      <h3 className="text-base font-bold text-slate-800">Interactive Assessment Mock</h3>
      <p className="text-xs text-slate-500">Evaluate your learning retention metrics through custom AI multiple choice quizzes.</p>
      <button onClick={() => navigate(`/quizzes?docId=${id}`)} className="h-10 px-5 border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold text-xs rounded-xl transition-all active:scale-95">
        Start Assessment Engine
      </button>
    </div>
  );

  // Naming matching accurate logic arrays mapping
  const tabItems = [
    { name: 'Content', icon: <FileText size={16} />, render: renderContentTab },
    { name: 'Chat', icon: <MessageSquare size={16} />, render: renderChatTab },
    { name: 'AI Actions', icon: <Sparkles size={16} />, render: renderAIActions }, // Fixed variable target
    { name: 'Flashcards', icon: <BookOpen size={16} />, render: renderFlashcardsTab },
    { name: 'Quizzes', icon: <BrainCircuit size={16} />, render: renderQuizzesTab },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner />
        <p className="text-sm text-slate-400 mt-2">Loading document interface...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-5xl mx-auto relative">
      <Toaster position="top-center" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

      <div className="relative space-y-6">
        <button 
          onClick={() => navigate('/documents')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 group transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Documents</span>
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {document?.name || document?.title || 'Untitled Document'}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1"><Clock size={12} /> {moment(document?.createdAt).fromNow()}</span>
            <span>•</span>
            <span>{formatFileSize(document?.size)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-none">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 -mb-[2px] ${
                  isActive 
                    ? 'border-emerald-500 text-emerald-600 font-semibold bg-emerald-50/30' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        <div className="animate-in fade-in-50 duration-200">
          {tabItems.find(t => t.name === activeTab)?.render()}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
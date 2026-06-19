import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Calendar, ArrowRight, BookOpen, Search } from "lucide-react";
import moment from "moment";

const FlashcardsListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Global global state sets array - Jab endpoints update honge tab backend context se filter dynamic array parse karengi
  const [allFlashcardSets, setAllFlashcardSets] = useState([
    {
      id: "fc_1",
      title: "React JS Core Fundamentals",
      documentTitle: "React JS Study Guide.pdf",
      createdAt: "2026-05-18T14:32:00.000Z",
      cardCount: 15
    },
    {
      id: "fc_2",
      title: "MERN Stack Auth Logic Flow",
      documentTitle: "Backend Architecture Guide",
      createdAt: "2026-06-10T09:15:00.000Z",
      cardCount: 12
    }
  ]);

  const filteredSets = allFlashcardSets.filter(set =>
    set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.documentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/30 p-6 sm:p-8">
      {/* Background Graphic Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-6">
        
        {/* Page Section Main Header layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Flashcard Decks</h1>
            <p className="text-slate-500 text-sm">Review your generated flashcards across all uploaded documents</p>
          </div>

          {/* Search dynamic contextual header card box layout controller */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search flashcard sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-10 text-sm bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl transition-all outline-none font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Global Dashboard View Conditional Render Framework Grid pattern */}
        {filteredSets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSets.map((set) => (
              <div
                key={set.id}
                onClick={() => navigate(`/flashcards/${set.id}`)}
                className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[175px]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between">
                    {/* Floating Emerald Decorative Branding Box Wrapper */}
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/40 group-hover:scale-105 transition-transform">
                      <Layers size={18} strokeWidth={2.5} />
                    </div>
                    {/* Badge Indicator tag tracker */}
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md max-w-[180px] truncate">
                      {set.documentTitle}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {set.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                      <Calendar size={12} />
                      Created {moment(set.createdAt).format("MMM D, YYYY")}
                    </p>
                  </div>
                </div>

                {/* Bottom Stats Footer Info row framework container */}
                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100/50">
                    {set.cardCount} cards
                  </span>
                  <span className="text-[11px] text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex items-center gap-0.5">
                    Start Revision <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search Dashboard State Frame fallback */
          <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400 border border-slate-100">
              <BookOpen size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No flashcard sets found</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              Go to your individual Documents detail view tab panels to trigger AI card deck active configurations!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FlashcardsListPage;
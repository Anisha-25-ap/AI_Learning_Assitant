import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import moment from 'moment';

// Helper function to format file size (Yeh bilkul sahi tha aapka)
const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Card click event ko rokne ke liye
        onDelete(document._id); // Id pass karenge delete ke liye
    };

    return (
        <div 
            onClick={handleNavigate}
            className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-100/80 hover:border-emerald-500/20 transition-all duration-300 cursor-pointer"
        >
            {/* Top Row: Icon & Delete Button */}
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <FileText className="h-6 w-6" />
                </div>
                <button
                    onClick={handleDelete}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200"
                    title="Delete Document"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>

            {/* Document Title */}
            <h3 className="font-semibold text-slate-800 text-base line-clamp-1 mb-2 group-hover:text-emerald-600 transition-colors duration-200">
                {document?.name || 'Untitled Document'}
            </h3>

            {/* Document Meta Info */}
            <div className="flex flex-wrap gap-y-2 items-center text-xs text-slate-500 gap-x-4 border-b border-slate-50 pb-4 mb-4">
                <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{moment(document?.createdAt).fromNow()}</span>
                </div>
                <div className="text-slate-300">•</div>
                <div>{formatFileSize(document?.size)}</div>
            </div>

            {/* Interactive Quick Actions */}
            <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-1">
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg group-hover:bg-emerald-50/50 transition-colors">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Flashcards</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg group-hover:bg-teal-50/50 transition-colors">
                    <BrainCircuit className="h-3.5 w-3.5 text-teal-500" />
                    <span>Quizzes</span>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
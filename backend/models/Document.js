import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    // FIXED: doument -> document
    required: [true, 'Please provide a document title'],
    trim: true
  },
  fileName: {
    type: String,
    required: true
  }, 
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  }, 
  extractedText: {
    type: String,
  },
  chunks: [{
    content: {
      type: String,
      required: true
    },
    pageNumber: {
      type: Number, 
      default: 0
    },
    chunkIndex: {
      type: Number,
      required: true
    }
  }],
  // Note: uploadDate is redundant if you use timestamps: true (createdAt),
  // but keeping it for manual control is fine.
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Compound Index for faster user-specific document listing
documentSchema.index({ userId: 1, uploadDate: -1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;
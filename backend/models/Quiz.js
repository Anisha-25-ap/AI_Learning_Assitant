import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    // Optional: Agar aap set ka title dena chahen (e.g., "Chapter 1 Flashcards")
    title: {
      type: String,
      trim: true
    },
    cards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        lastReviewed: {
          type: Date,
          default: null,
        },
        reviewCount: {
          type: Number,
          default: 0,
        },
        // FIXED: isstarred -> isStarred (camelCase standard)
        isStarred: {
          type: Boolean,
          default: false,
        },
      },
    ],
  }, 
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Index for faster queries when searching cards by user and document
flashcardSchema.index({ userId: 1, documentId: 1 });

const Flashcard = mongoose.model("Quiz", flashcardSchema);

export default Flashcard;
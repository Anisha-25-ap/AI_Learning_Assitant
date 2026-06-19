# AI Learning Assistant 🧠🚀

An intelligent, full-stack learning platform designed to act as a personalized study companion. The application processes academic documents, emails, or notes and utilizes advanced AI capabilities to generate interactive summaries, answer contextual queries via chat, and automatically construct customized flashcard decks and quiz frameworks.

---

## 🚀 Key Features & Interface Tour

### 📚 Interactive Document Workspace
Manage all your imported study materials in a centralized dashboard. The engine includes a secure document viewer to display and navigate files seamlessly.
* **Seamless Previews:** Built-in validation system to handle file preview URLs and safely render content inside sandboxed frames.

![Document Viewer Preview](frontend/public/screenshots/document-viewer.png)

---

### 💬 Contextual AI Chat Engine
Interact directly with your study materials through a real-time responsive chat wrapper.
* **Instant Clarifications:** Ask targeted questions about complex paragraphs, trace code structures, or ask for deep breakdowns without leaving the reading pane.

![AI Chat Interface Preview](frontend/public/screenshots/chat-interface.png)

---

### ⚡ Advanced AI Actions Hub
Accelerate your learning curve with automated processing tools engineered to eliminate cognitive load:
* **Generate Summary:** Condense heavy multi-page documents or long updates into clear, high-yield markdown bullet points.
* **Explain a Concept:** Input any technical term or abstract architecture pattern (e.g., *React Hooks*, *MERN Auth Flow*) to receive an immediate, guided technical breakdown.

![AI Actions Hub Preview](frontend/public/screenshots/ai-actions.png)

---

### 🗂️ Automated Flashcard Decks
Accelerate retention with flashcard workflows split into two dynamic layers:
* **Document-Level Decks:** Automatically trigger specialized card generation mapped to a unique file context.
* **Global Flashcards Dashboard:** A unified deck-listing interface tracking total card metrics, document origins, and precise creation timestamps for scheduled revision tracking.

| Document Instance Action View | Global Decks Dashboard |
| :---: | :---: |
| ![Document Flashcard View](frontend/public/screenshots/document-flashcards.png) | ![Global Decks Hub](frontend/public/screenshots/global-flashcards.png) |

---

## 📂 Repository Folder Structure

The project follows a clean, decoupled client-server architecture. Below is the layout of the primary directory structures:

```text
AI_Learning_Assistant/
├── backend/                   # Node.js + Express Core Server
│   ├── config/                # Database connection & configurations
│   ├── controllers/           # API request controllers (Auth, Document handlers)
│   ├── models/                # MongoDB Mongoose Schemas (User, Document, Flashcard)
│   ├── routes/                # Express Endpoint Routing
│   ├── middleware/            # JWT Authentication & File Upload limits
│   ├── uploads/               # Local static directory for staging documents
│   └── server.js              # Entry point for backend server instance
│
├── frontend/                  # React.js Client Application
│   ├── public/                # Static public assets
│   │   └── screenshots/       # Application workflow showcase images
│   ├── src/
│   │   ├── components/        # Reusable global UI elements
│   │   │   ├── common/        # Spinners, Modals, Buttons
│   │   │   └── layout/        # AppLayout, Sidebar navigation wrappers
│   │   ├── pages/             # View Screen Components
│   │   │   ├── Dashboard/     # Recent Activity & Stats overview
│   │   │   ├── Documents/     # Document View & Active Tab workflows
│   │   │   ├── Flashcards/    # Decks listing dashboards
│   │   │   └── Profile/       # Profile management and forms
│   │   ├── services/          # Axios API communication layers (progressService, etc.)
│   │   ├── App.jsx            # Application routing setup (React Router DOM)
│   │   └── main.jsx           # Client engine initialization
│   ├── package.json           # Frontend dependency tree configurations
│   └── vite.config.js         # Vite bundler configurations
└── README.md                  # Comprehensive workspace profile documentation

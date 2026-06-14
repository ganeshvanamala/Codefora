# Codefora

**Codefora** is an advanced, real-time collaborative coding platform designed for competitive programming, pair programming, and technical interviews. It provides a seamless, Google Docs-like experience for writing code together, running code remotely, and building web projects instantly.

![Codefora Preview](https://via.placeholder.com/1200x600.png?text=Codefora+Real-Time+Collaboration)

## 🎯 Aim

The primary aim of Codefora is to bridge the gap between simple text-sharing bins and heavy, localized IDEs. It provides a lightweight, instant, and incredibly powerful cloud-based IDE where multiple users can collaboratively write, execute, and debug code in real-time. Whether you are practicing algorithmic problems with a friend, conducting a remote technical interview, or pair-programming a web application, Codefora provides the exact tools you need in a synchronized environment.

## 🚀 Key Features

*   **Real-Time Collaborative Editing:** Sub-millisecond synchronization of keystrokes across multiple users using CRDTs (Conflict-free Replicated Data Types).
*   **Multi-File Architecture:** Support for entire project structures. Create, edit, and manage multiple files (HTML, CSS, JS, Python, Java, C++, Rust, etc.) in a single room.
*   **Instant Web Previews:** A live rendering engine that instantly previews HTML/CSS/JS projects as you type, without page reloads.
*   **Remote Code Execution:** Execute backend languages safely in the cloud via the Piston API with support for custom `stdin` inputs and real-time `stdout` logs.
*   **Live Presence & Cursors:** See exactly where your peers are typing with real-time cursor tracking and name tags.
*   **Integrated Voice Chat:** Built-in WebRTC voice communication directly inside the coding rooms.
*   **Shared Scratchpad:** A synchronized HTML5 Canvas drawing tool and text notes area for diagramming system architectures or solving algorithmic problems together.
*   **Competitive Problem Solving:** Built-in problem statements, test-case validations, and code submissions.
*   **AI Problem Assistant:** Integrated Google Gemini AI to ask for hints, edge cases, and code explanations directly within the problem editor.
*   **Host Permissions:** Robust room management allowing hosts to lock rooms, kick users, manage read/write permissions, toggle AI access, and prevent copy/pasting.

---

## 🛠️ Technology Stack

Codefora is built using a modern, scalable JavaScript ecosystem.

### Frontend
*   **React 18 & Vite:** Core UI framework and lightning-fast build tool.
*   **Monaco Editor:** The code editor that powers VS Code, providing syntax highlighting and autocomplete.
*   **Yjs & y-monaco:** The CRDT engine that handles real-time text synchronization and conflict resolution.
*   **Socket.io-client:** Real-time event communication for cursors, presence, and room configuration updates.
*   **Firebase SDK:** Used for user authentication and direct integration with the cloud backend.

### Backend
*   **Node.js & Express.js:** The core server runtime and REST API framework.
*   **Socket.io:** WebSocket server for broadcasting ephemeral events (presence, typing, cursor locations).
*   **y-websocket:** The Yjs connection provider that manages the CRDT document state across the network.
*   **Firebase & Firestore:** Cloud infrastructure and NoSQL database for persistent storage of user profiles, room configurations, file contents, and history.
*   **Google Gemini AI:** Backend service providing intelligent programming hints and problem breakdowns.
*   **Piston API:** An open-source remote code execution engine used to safely compile and run user-submitted code in isolated Docker containers.

---

## 🧠 Implementation Approach & Process

### 1. State Synchronization (The CRDT Approach)
Instead of relying on central-server Operational Transformation (OT), Codefora utilizes **Yjs (CRDTs)**. Every user maintains a local Yjs document. Keystrokes are appended to a mathematical graph and broadcasted. This ensures that even on high-latency connections, line endings (`\n`), and concurrent edits mathematically resolve to the exact same document state across all clients. Codefora actively overrides Monaco's native Windows CRLF line-endings to strictly use LF, preventing cross-platform index drifting.

### 2. The Multi-File Challenge
Codefora supports full multi-file editing. To achieve this, the Yjs document (`Y.Doc`) is dynamically bound and unbound to the Monaco Editor instance as the user switches tabs. A `y-websocket` provider specifically connects to a dynamic WebSocket room `yjs/room-ID-file-NAME`, ensuring that users only download the CRDT state for the exact file they are currently viewing, saving massive amounts of bandwidth.

### 3. Safe Remote Execution
Running untrusted code is dangerous. Codefora mitigates this by proxying code execution requests through the backend to a **Piston API** instance. Piston executes the code inside ephemeral, tightly locked-down Docker containers with strict memory and CPU limits, returning the `stdout` and execution time safely to the user.

### 4. Interactive Scratchpad
Instead of integrating a heavy 3rd-party iframe tool for whiteboarding, Codefora uses a highly-optimized, synchronized `<canvas>` element allowing users to draw architectural diagrams directly within the application state alongside their code.

---

## 💻 Local Development Setup

### Prerequisites
*   Node.js (v18+)
*   Firebase Project (for Authentication and Firestore)
*   Google Gemini API Key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ganeshvanamala/Codefora.git
   cd Codefora
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   GEMINI_API_KEY=your_gemini_api_key
   PISTON_EXECUTE_URL=https://emkc.org/api/v2/piston/execute
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see Codefora in action!

## 📜 License

This project is licensed under the MIT License.

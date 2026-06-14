# Codefora

<p align="center">
  <em>A unified, real-time collaborative coding environment for pair programming, technical interviews, and competitive coding.</em>
</p>

<p align="center">
  <a href="https://codefora.online/"><strong>View Live Demo</strong></a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

<!-- SUGGESTION: Replace this placeholder with a high-quality GIF showing two users typing simultaneously while on a voice call, or showing the live HTML preview updating in real-time. -->
![Codefora Interface Preview](https://via.placeholder.com/1000x500.png?text=Codefora+Real-Time+Collaboration+Interface)

## The Problem

Traditionally, collaborative coding is a highly fragmented experience. When developers want to pair program, conduct a technical interview, or solve algorithms together, they are forced to juggle multiple disjointed tools:
- **VS Code Live Share** for code synchronization (requiring heavy local IDEs and extensions).
- **Discord, Zoom, or Google Meet** for voice communication.
- **Excalidraw or Miro** for architectural whiteboarding.
- **LeetCode or HackerRank** for problem statements and test validations.

Setting up this environment introduces immense friction. It is slow to boot, requires all participants to install the same local software, and often suffers from host-dependency lag.

## The Codefora Solution

Codefora was built to unify the collaborative coding workflow. It provides an instant-access, cloud-based environment where everything happens in a single browser tab. 

We combine sub-millisecond CRDT-based code synchronization, multi-file project support, isolated remote code execution, and WebRTC voice chat into one cohesive platform. There is no setup, no installation, and zero friction.

### Codefora vs. Traditional Workflows

| Capability | Traditional Workflow | Codefora |
| :--- | :--- | :--- |
| **Workspace** | Heavy local IDE + Live Share | Instant, lightweight browser-based Monaco editor |
| **Communication** | External App (Discord, Zoom) | Built-in WebRTC Voice Chat |
| **Whiteboarding** | External App (Excalidraw, Miro) | Integrated, synchronized Canvas Scratchpad |
| **Execution** | Local runtime & dependencies required | Secure, isolated cloud execution via Judge0 |
| **State Sync** | Centralized Operational Transformation (OT) | Decentralized CRDTs (Yjs) for zero-lag sync |

## Core Features

*   **Sub-Millisecond Synchronization:** Powered by Yjs (Conflict-free Replicated Data Types), keystrokes are mathematically resolved across clients instantly, ensuring flawless sync even on high-latency networks.
*   **Multi-File Architecture:** Create, edit, and manage full directory structures (HTML, CSS, JS, Python, Java, C++, Rust). WebSocket connections are dynamically bound to the active file to drastically reduce bandwidth consumption.
*   **Instant Web Previews:** A live rendering engine instantly previews frontend projects as you type, without requiring manual page reloads or external bundlers.
*   **Isolated Remote Execution:** Backend languages are executed safely in the cloud via the Judge0 API. It supports custom `stdin` inputs and streams `stdout` back to the room in real-time.
*   **Integrated WebRTC Voice:** Seamless, built-in peer-to-peer audio communication eliminates the need for third-party calling apps.
*   **Canvas Scratchpad:** A synchronized HTML5 drawing tool allows teams to sketch system architectures and algorithm data structures directly alongside their code.
*   **Competitive Problem Library:** Built-in algorithm problems with automated test-case validations and submissions.
*   **Groq Llama-3 AI Assistant:** An integrated, ultra-low latency AI assistant that has full context of the room, code, and problem statement to provide hints and debugging help.
*   **Granular Room Controls:** Robust host permissions to manage room visibility, moderate participants, toggle AI access, and prevent copy/pasting during interviews.

---

## Technical Architecture

<!-- SUGGESTION: Add a mermaid.js or image diagram here showing the flow between the React Frontend, Node/Express Backend, Firebase Auth, Socket.io, and the Judge0/Groq APIs. -->

Codefora is built using a modern, scalable JavaScript ecosystem designed for real-time performance.

*   **Frontend:** React 18, Vite, and Monaco Editor.
*   **State & Sync:** Yjs (`y-monaco`, `y-websocket`) handles document state, while `Socket.io-client` broadcasts ephemeral events (presence, typing indicators, cursors). We explicitly override Windows CRLF line-endings to standard LF to prevent cross-platform CRDT index drifting.
*   **Backend:** Node.js & Express.js.
*   **Database & Auth:** Firebase Admin SDK & Firestore handle persistent storage of user profiles, room configurations, and historical data.
*   **External APIs:** 
    *   `Judge0 API` for secure, sandboxed code compilation.
    *   `Groq API` (Llama 3) for the contextual AI assistant.

---

## Roadmap

Codefora is actively evolving. We are not trying to build a broad social network; our immediate focus is engineering the absolute best real-time collaborative coding room experience.

### 📍 Current Focus
- Stabilizing the core CRDT synchronization for massive files.
- Expanding the built-in competitive problem library.
- Enhancing the WebRTC audio infrastructure for larger room capacities.

### 🚀 Next Phase
- **Room vs. Room Competitions:** Enabling competitive formats where teams can race to solve problem sets.
- **Team-Based Coding Challenges:** Shared test-case passing metrics across multiple room participants.
- **Enhanced Whiteboarding:** Adding shapes, text boxes, and export functionality to the Canvas Scratchpad.

### 🔭 Long-Term Vision
- **Competitive Collaboration:** Establishing Codefora as the premier platform for team-based hackathons and community-driven algorithm events.
- **Interview Replays:** Full DVR-style playback of coding sessions for technical interview reviews.

---

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   Firebase Project (for Authentication and Firestore)
*   Groq API Key (optional, for AI features)

### Local Development

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
   AI_PROVIDER=groq
   GROQ_API_KEY=your_groq_api_key
   ```
   *Note: Add your Firebase Admin SDK service account file as `firebase-key.json` in the root backend directory.*

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

4. **Run the Application**
   Navigate to `http://localhost:5173` in your browser.

---

## Contributing

We welcome contributions from the community! Whether it's fixing bugs, improving documentation, or proposing new features, your help is appreciated. 

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please ensure your code adheres to the existing style and that any new features are thoroughly tested.

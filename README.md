# HR Workflow Designer

A production-quality **HR Workflow Designer** prototype built with React, TypeScript, React Flow, and Zustand. Allows HR admins to visually create, configure, test, and export internal workflows such as employee onboarding, leave approval, and document verification.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![React Flow](https://img.shields.io/badge/React_Flow-11-green) ![Zustand](https://img.shields.io/badge/Zustand-5-purple)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features

### Core Workflow Canvas
- **5 Node Types**: Start, Task, Approval, Automated Step, End
- **Drag & Drop**: Drag nodes from the sidebar onto the canvas
- **Custom Edge Styles**: Solid, dashed, dotted, thick lines
- **Custom Arrow Types**: Open arrow, filled arrow, double arrow, no arrow
- **Edge Management**: Click edges to select, delete with inline button
- **Node Selection**: Click any node to open its configuration panel
- **Auto-Validation**: Detects disconnected nodes, cycles, missing start nodes

### Node Configuration Forms
Each node type has a dedicated schema-driven form:
| Node | Fields |
|------|--------|
| **Start** | Title, Metadata (JSON) |
| **Task** | Title, Description, Assignee, Due Date, Custom Fields (JSON) |
| **Approval** | Title, Approver Role, Auto-Approve Threshold |
| **Automated** | Title, Action (select from mock API), Parameters (JSON) |
| **End** | Title, End Message, Summary Toggle |

### Workflow Templates
Pre-built templates for common HR processes:
- 👤 **Employee Onboarding** — hire → collect docs → approve → welcome kit
- 📋 **Leave Approval** — request → balance check → manager review → calendar update
- 📄 **Document Verification** — receive → OCR scan → compliance → sign-off

### Simulation Engine
- **Graph Validation**: Checks for cycles, disconnected nodes, missing Start
- **BFS Traversal**: Step-by-step execution visualization
- **Mock API Integration**: `GET /automations` and `POST /simulate` endpoints
- **Live Execution Logs**: Real-time terminal-style output

### Toolbar Actions
- **Auto-Layout** (dagre) — Organizes nodes in a clean tree structure
- **Export JSON** — Download workflow as a portable JSON file
- **Import JSON** — Load a previously exported workflow
- **Clear All** — Reset the entire canvas
- **Undo/Redo** — Full history via zundo temporal middleware

---

## 🏗️ Architecture

```
src/
├── api/
│   └── mockApi.ts              # Mock GET/POST API layer
├── components/
│   ├── edges/
│   │   ├── CustomEdge.tsx      # Custom edge with style/arrow support
│   │   └── EdgeToolbar.tsx     # Edge style picker dropdown
│   ├── form/
│   │   └── DynamicFormRenderer.tsx  # Schema-driven form engine
│   └── ui/
│       ├── BlurText.tsx        # Animated text component
│       └── Threads.tsx         # WebGL background effect
├── features/
│   └── workflow/
│       ├── Canvas.tsx          # React Flow canvas wrapper
│       ├── ConfigPanel.tsx     # Right-side node editor
│       ├── Sidebar.tsx         # Left-side node palette
│       ├── SimulationPanel.tsx # Bottom execution panel
│       └── WorkflowDesigner.tsx # Main layout orchestrator
├── nodes/
│   ├── BaseNode.tsx            # Shared node shell component
│   ├── StartNode.tsx           # Start node + schema
│   ├── TaskNode.tsx            # Task node + schema
│   ├── ApprovalNode.tsx        # Approval node + schema
│   ├── AutomatedNode.tsx       # Automated node + schema
│   ├── EndNode.tsx             # End node + schema
│   └── registry.ts            # Node type registry (scalable)
├── store/
│   └── useWorkflowStore.ts    # Zustand store + zundo undo/redo
├── types/
│   └── workflow.types.ts      # Shared TypeScript interfaces
├── utils/
│   ├── cn.ts                   # clsx + tailwind-merge utility
│   ├── templates.ts            # Pre-built workflow templates
│   └── graph/
│       ├── autoLayout.ts       # Dagre-based auto-layout
│       ├── detectCycle.ts      # DFS cycle detection
│       ├── serialize.ts        # Graph → JSON serializer
│       ├── traverse.ts         # BFS simulation engine
│       └── validateGraph.ts    # Graph constraint validator
├── App.tsx
├── main.tsx
└── index.css                   # Design system tokens
```

### Key Design Decisions

1. **Node Type Registry** — All node types are registered in `registry.ts`. Adding a new node requires only: defining a component, a schema, and registering it. Zero changes to canvas/form code.

2. **Schema-Driven Forms** — `DynamicFormRenderer` reads a `NodeSchema` and generates form fields dynamically. Supports text, number, select, textarea, and toggle fields. Fully extensible.

3. **Graph Utilities Layer** — Validation, traversal, cycle detection, and serialization are pure functions in `utils/graph/`. Fully testable and decoupled from React.

4. **Temporal Middleware (Undo/Redo)** — Zustand + zundo provides undo/redo history for nodes and edges. Selection state is excluded from history to prevent infinite loops.

5. **Custom Edge System** — Edges support 4 line styles × 4 arrow types = 16 combinations. Uses SVG marker definitions for performant arrow rendering.

6. **Color System** — Space Black (#121313) + Neon Coral (#FF6044) palette with carefully tuned opacity layers for depth.

---

## 🔌 Mock API

### GET /automations
Returns available automated actions:
```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] },
  { "id": "notify_slack", "label": "Send Slack Notification", "params": ["channel", "message"] }
]
```

### POST /simulate
Accepts serialized workflow JSON, returns step-by-step execution log:
```json
["Initializing Server Resources...", "Verified Payload Structure: 5 nodes parsed.", "Simulation Success. Return Code 200."]
```

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript 6** | Type safety |
| **Vite 8** | Build tool |
| **React Flow 11** | Workflow canvas |
| **Zustand 5** | State management |
| **zundo** | Undo/redo middleware |
| **dagre** | Auto-layout algorithm |
| **Tailwind CSS 4** | Styling |
| **Lucide React** | Icons |
| **motion** | Animations |

---

## 📋 What's Completed vs. Future Work

### ✅ Completed
- All 5 node types with custom forms
- Drag-and-drop canvas with edge connections
- Custom edge styles (solid, dashed, dotted, thick)
- Custom arrow types (arrow, filled, double, none)
- Graph validation (cycles, disconnected nodes, constraints)
- BFS simulation with step-by-step logs
- Mock API integration (GET + POST)
- Export/Import workflow as JSON
- 3 pre-built workflow templates
- Auto-layout with dagre
- Undo/Redo history
- MiniMap and zoom controls
- Validation errors shown on nodes
- **Dark/Light Theme Toggle** (Ivory & Donkey Brown / Space Black & Neon Coral)
- **Interactive WebGL Backgrounds** (PlasmaWave & Iridescence)
- **Custom Branded Toast Notification** for destructive actions
- **Enhanced Glassmorphism UI** with high-fidelity Backdrop Blurs

### 🔮 Future Enhancements (With More Time)
- Node version history
- Conditional branching (if/else paths)
- Collaborative editing (WebSocket)
- Backend persistence (Server-side & PostgreSQL)
- Role-based access control
- Workflow scheduling/triggers
- Real-time notifications
- Advanced analytics dashboard
- Full Mobile-responsive canvas (Optimized Touch Support)

---

## 📝 Assumptions

1. No authentication or backend persistence required (per spec)
2. Mock API uses `setTimeout` to simulate network latency
3. Workflow templates use hardcoded node positions (auto-layout can reorganize)
4. All form data is string-based with JSON fields for extensibility
5. The app targets modern browsers with WebGL support
# TREDENCE_HR-FLOW  

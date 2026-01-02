# JS-Event-Loop-Sim

An interactive, step-by-step JavaScript Event Loop visualizer that helps developers understand how asynchronous code execution works in both browser and Node.js environments.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)

## ✨ Features

### 🎯 Interactive Visualization
- **Real-time Event Loop Simulation**: Watch the call stack, microtask queue, macrotask queue, and Web APIs interact step-by-step
- **Dual Runtime Support**: Switch between Browser and Node.js event loop models to see runtime-specific behaviors
- **Color-Coded Components**: Distinct colors for different task types (microtasks in violet, macrotasks in amber, etc.)
- **Smooth Animations**: Framer Motion-powered transitions for intuitive understanding of task flow

### 🎮 Playback Controls
- **Step-by-Step Execution**: Move forward/backward through code execution at your own pace
- **Variable Speed Playback**: Adjust speed from 0.5x to 4x for different learning preferences
- **Timeline Navigation**: Jump to specific execution steps instantly
- **Play/Pause/Reset**: Full VCR-style controls for exploration

### 📚 Educational Scenarios
10 carefully crafted scenarios covering:
- **Fundamentals**: Basic sync execution, setTimeout vs Promise, async/await patterns
- **Browser-Specific**: Render pipeline, requestAnimationFrame
- **Node.js-Specific**: process.nextTick, setImmediate, event loop phases
- **Tricky Cases**: Microtask starvation, promise executor behavior, nested timeouts

Each scenario includes:
- Syntax-highlighted code with real-time line highlighting
- Expected output for verification
- Detailed explanations of event loop behavior
- Step-by-step execution plan

### 🔬 Interactive Experimentation
- **Manual Task Enqueueing**: Add custom tasks (promises, timeouts, etc.) during execution
- **Runtime Switching**: Toggle between browser and Node.js to compare behaviors
- **Queue Inspection**: See tasks waiting in microtask, macrotask, and nextTick queues
- **Web API Progress**: Watch async operations complete with progress indicators

### 🎨 Modern UI/UX
- **Resizable Panels**: Customize your workspace layout on desktop
- **Responsive Design**: Fully functional on mobile and tablet devices
- **Dark/Light Mode**: Theme support for comfortable viewing
- **Console Output**: Simulated console with animated log entries

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) 1.2.22 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/js-event-loop-sim.git

# Navigate to the project directory
cd js-event-loop-sim

# Install dependencies
bun install
```

### Development

```bash
# Start the development server
bun run dev

# The application will be available at http://localhost:3001
```

### Build

```bash
# Build for production
bun run build

# Preview production build
bun run serve
```

### Type Checking

```bash
# Check TypeScript types across all apps
bun run check-types
```

## 📖 Available Scenarios

| Scenario | Category | Runtime | Description |
|----------|----------|---------|-------------|
| Hello Sync | Fundamentals | Both | Basic synchronous execution |
| setTimeout vs Promise | Fundamentals | Browser | The classic microtask vs macrotask question |
| async/await Basics | Fundamentals | Both | How async/await desugars to Promises |
| Nested setTimeout | Fundamentals | Browser | One macrotask per event loop iteration |
| Microtask Chain | Fundamentals | Both | Microtasks can queue more microtasks |
| nextTick vs Promise | Node.js | Node | process.nextTick runs before Promise.then |
| Promise inside setTimeout | Tricky | Browser | Microtasks drain after each macrotask |
| queueMicrotask API | Fundamentals | Both | Using queueMicrotask directly |
| Multiple Awaits | Tricky | Both | Each await creates a microtask checkpoint |
| Promise Executor is Sync | Tricky | Both | The Promise constructor callback runs synchronously |
| setImmediate vs setTimeout | Node.js | Node | Check phase vs timer phase ordering |
| Mixed Async Patterns | Tricky | Browser | Classic interview question combining all patterns |
| Microtask Starvation | Tricky | Both | Microtasks can starve the macrotask queue |

## 🏗️ Project Structure

```
js-event-loop-sim/
├── apps/
│   └── web/                      # React frontend application
│       ├── src/
│       │   ├── components/
│       │   │   ├── simulator/    # Simulator components
│       │   │   │   ├── CallStack.tsx
│       │   │   │   ├── CodePanel.tsx
│       │   │   │   ├── ConsolePanel.tsx
│       │   │   │   ├── Controls.tsx
│       │   │   │   ├── PhaseIndicator.tsx
│       │   │   │   ├── Queues.tsx
│       │   │   │   ├── QuickEnqueue.tsx
│       │   │   │   ├── ScenarioSelector.tsx
│       │   │   │   ├── SimulatorProvider.tsx
│       │   │   │   ├── TaskCard.tsx
│       │   │   │   └── WebApis.tsx
│       │   │   └── ui/           # shadcn/ui components
│       │   ├── hooks/            # Custom React hooks
│       │   ├── lib/
│       │   │   └── simulator/    # Core simulator logic
│       │   │       ├── engine.ts      # Reducer and state management
│       │   │       ├── scenarios.ts   # Predefined scenarios
│       │   │       └── types.ts       # TypeScript definitions
│       │   └── routes/           # TanStack Router routes
│       └── package.json
├── packages/
│   ├── config/                   # Shared TypeScript config
│   └── env/                      # Environment variable handling
└── package.json
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **TanStack Router** - File-based routing with type safety
- **TailwindCSS 4** - Utility-first styling
- **shadcn/ui** - Reusable component library
- **Framer Motion** - Animation library

### Development
- **Vite** - Build tool and dev server
- **Bun** - Package manager and runtime
- **PrismJS** - Syntax highlighting
- **React Resizable Panels** - Layout management

### State Management
- **useReducer** - Local state with custom simulator reducer
- **React Context** - Global simulator state sharing

## 🎓 How It Works

The simulator uses a **reducer-based state machine** that models the JavaScript event loop:

1. **Task Queues**: Maintains separate queues for microtasks, macrotasks, and Node.js nextTick callbacks
2. **Call Stack**: Tracks function execution frames with source line references
3. **Web APIs**: Simulates async operations (setTimeout, fetch, etc.) with progress tracking
4. **Phase Tracking**: Models event loop phases for both browser and Node.js runtimes
5. **Event Logging**: Records all state transitions for timeline navigation

Each scenario contains predefined execution steps that simulate the exact sequence of operations the JavaScript engine would perform.

## 🎯 Use Cases

- **Learning**: Understand JavaScript's asynchronous execution model visually
- **Teaching**: Demonstrate event loop concepts to students with interactive examples
- **Interview Prep**: Master common async JavaScript interview questions
- **Debugging**: Develop intuition for async code behavior and timing issues
- **Comparison**: See concrete differences between browser and Node.js event loops

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new scenarios
- Improve visualizations
- Fix bugs
- Enhance documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack)

## 📬 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Happy Learning! 🚀**

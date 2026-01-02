import type { Scenario, ScenarioStep } from './types';
import { COLORS } from './types';

export const scenarios: Scenario[] = [
  {
    id: 'hello-sync',
    title: 'Hello Sync',
    description: 'Basic synchronous execution - just console.log statements',
    category: 'fundamentals',
    runtime: 'both',
    code: `console.log("first");
console.log("second");
console.log("third");`,
    expectedOutput: ['first', 'second', 'third'],
    explanation: 'Synchronous code runs line by line on the call stack. Each console.log executes immediately before moving to the next.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 3, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("first")', sourceLineStart: 1, sourceLineEnd: 1, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'first' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("second")', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'second' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("third")', sourceLineStart: 3, sourceLineEnd: 3, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'third' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'settimeout-vs-promise',
    title: 'setTimeout vs Promise',
    description: 'The classic question: which runs first?',
    category: 'fundamentals',
    runtime: 'browser',
    code: `console.log("start");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");`,
    expectedOutput: ['start', 'end', 'promise', 'timeout'],
    explanation: 'Microtasks (Promise.then) always run before the next macrotask (setTimeout). Even with 0ms delay, setTimeout callback waits in the macrotask queue while Promise.then goes to the microtask queue, which drains completely before any macrotask runs.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 11, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("start")', sourceLineStart: 1, sourceLineEnd: 1, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(..., 0)', sourceLineStart: 3, sourceLineEnd: 5, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'startAsync',
          operation: {
            type: 'setTimeout',
            label: 'Timer (0ms)',
            sourceLineStart: 3,
            sourceLineEnd: 5,
            totalSteps: 1,
            remainingSteps: 1,
            callbackTask: {
              id: '',
              type: 'setTimeout',
              label: 'setTimeout callback',
              sourceLineStart: 4,
              sourceLineEnd: 4,
              color: COLORS.setTimeout,
            },
            color: COLORS.setTimeout,
          },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'Promise.resolve().then(...)', sourceLineStart: 7, sourceLineEnd: 9, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: {
            type: 'promise',
            label: 'Promise.then callback',
            sourceLineStart: 8,
            sourceLineEnd: 8,
            color: COLORS.promise,
          },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("end")', sourceLineStart: 11, sourceLineEnd: 11, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'tickAsync' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("promise")', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'promise' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'async-await-basics',
    title: 'async/await Basics',
    description: 'How async/await desugars to Promises',
    category: 'fundamentals',
    runtime: 'both',
    code: `async function foo() {
  console.log("foo start");
  await Promise.resolve();
  console.log("foo end");
}

console.log("script start");
foo();
console.log("script end");`,
    expectedOutput: ['script start', 'foo start', 'script end', 'foo end'],
    explanation: 'When foo() is called, it runs synchronously until the first await. The await pauses foo() and schedules the rest as a microtask. Meanwhile, "script end" logs. Then microtasks run, logging "foo end".',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 9, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("script start")', sourceLineStart: 7, sourceLineEnd: 7, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'script start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'foo()', sourceLineStart: 1, sourceLineEnd: 5, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("foo start")', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'foo start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'await Promise.resolve()', sourceLineStart: 3, sourceLineEnd: 3, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: {
            type: 'promise',
            label: 'foo() continuation',
            sourceLineStart: 4,
            sourceLineEnd: 4,
            color: COLORS.promise,
          },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("script end")', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'script end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("foo end")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'foo end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'nested-settimeout',
    title: 'Nested setTimeout',
    description: 'One macrotask per event loop iteration',
    category: 'fundamentals',
    runtime: 'browser',
    code: `setTimeout(() => {
  console.log("timeout 1");
  setTimeout(() => {
    console.log("timeout 2");
  }, 0);
}, 0);

setTimeout(() => {
  console.log("timeout 3");
}, 0);`,
    expectedOutput: ['timeout 1', 'timeout 3', 'timeout 2'],
    explanation: 'Each event loop iteration runs ONE macrotask. timeout 1 and timeout 3 are queued first. timeout 1 runs, queues timeout 2. Then timeout 3 runs. Finally timeout 2 runs.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 10, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 1, sourceLineEnd: 6, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'timeout 1 callback', sourceLineStart: 2, sourceLineEnd: 5, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 8, sourceLineEnd: 10, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'timeout 3 callback', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout 1")', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout 1' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 3, sourceLineEnd: 5, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'timeout 2 callback', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout 3")', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout 3' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout 2")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout 2' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'microtask-chain',
    title: 'Microtask Chain',
    description: 'Microtasks can queue more microtasks',
    category: 'fundamentals',
    runtime: 'both',
    code: `console.log("start");

Promise.resolve()
  .then(() => {
    console.log("promise 1");
    return Promise.resolve();
  })
  .then(() => {
    console.log("promise 2");
  });

console.log("end");`,
    expectedOutput: ['start', 'end', 'promise 1', 'promise 2'],
    explanation: 'The microtask queue drains completely before any macrotask. When promise 1 returns a Promise, it queues promise 2 as another microtask, which runs before the event loop continues.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 12, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("start")', sourceLineStart: 1, sourceLineEnd: 1, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'Promise.resolve().then(...).then(...)', sourceLineStart: 3, sourceLineEnd: 10, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'then callback 1', sourceLineStart: 4, sourceLineEnd: 7, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("end")', sourceLineStart: 12, sourceLineEnd: 12, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("promise 1")', sourceLineStart: 5, sourceLineEnd: 5, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'promise 1' } },
      { type: 'execute', action: { type: 'popStack' } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'then callback 2', sourceLineStart: 8, sourceLineEnd: 10, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("promise 2")', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'promise 2' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'nexttick-vs-promise',
    title: 'nextTick vs Promise',
    description: 'Node.js: process.nextTick runs before Promise.then',
    category: 'node',
    runtime: 'node',
    code: `console.log("start");

process.nextTick(() => {
  console.log("nextTick");
});

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");`,
    expectedOutput: ['start', 'end', 'nextTick', 'promise'],
    explanation: 'In Node.js, process.nextTick callbacks run before Promise microtasks. The nextTick queue drains completely before the microtask queue is processed.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 11, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("start")', sourceLineStart: 1, sourceLineEnd: 1, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'process.nextTick(...)', sourceLineStart: 3, sourceLineEnd: 5, color: COLORS.nextTick } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueNextTick',
          task: { type: 'nextTick', label: 'nextTick callback', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.nextTick },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'Promise.resolve().then(...)', sourceLineStart: 7, sourceLineEnd: 9, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'Promise.then callback', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("end")', sourceLineStart: 11, sourceLineEnd: 11, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'nextTick' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("nextTick")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.nextTick } } },
      { type: 'execute', action: { type: 'log', message: 'nextTick' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("promise")', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'promise' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'promise-in-timeout',
    title: 'Promise inside setTimeout',
    description: 'Microtasks created during a macrotask run before the next macrotask',
    category: 'tricky',
    runtime: 'browser',
    code: `setTimeout(() => {
  console.log("timeout 1");
  Promise.resolve().then(() => {
    console.log("promise inside timeout");
  });
}, 0);

setTimeout(() => {
  console.log("timeout 2");
}, 0);`,
    expectedOutput: ['timeout 1', 'promise inside timeout', 'timeout 2'],
    explanation: 'When timeout 1 runs, it creates a microtask. Microtasks drain completely after each macrotask, so "promise inside timeout" logs before timeout 2 runs.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 10, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 1, sourceLineEnd: 6, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'timeout 1 callback', sourceLineStart: 2, sourceLineEnd: 5, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 8, sourceLineEnd: 10, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'timeout 2 callback', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout 1")', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout 1' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'Promise.resolve().then(...)', sourceLineStart: 3, sourceLineEnd: 5, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'promise inside timeout', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("promise inside timeout")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'promise inside timeout' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout 2")', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout 2' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },
  {
    id: 'queuemicrotask',
    title: 'queueMicrotask API',
    description: 'Using queueMicrotask directly',
    category: 'fundamentals',
    runtime: 'both',
    code: `console.log("start");

queueMicrotask(() => {
  console.log("microtask 1");
});

queueMicrotask(() => {
  console.log("microtask 2");
});

console.log("end");`,
    expectedOutput: ['start', 'end', 'microtask 1', 'microtask 2'],
    explanation: 'queueMicrotask directly adds callbacks to the microtask queue, just like Promise.then. Both microtasks run after synchronous code completes, in FIFO order.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 12, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("start")', sourceLineStart: 1, sourceLineEnd: 1, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'queueMicrotask(...)', sourceLineStart: 3, sourceLineEnd: 5, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'queueMicrotask', label: 'microtask 1', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'queueMicrotask(...)', sourceLineStart: 7, sourceLineEnd: 9, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'queueMicrotask', label: 'microtask 2', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("end")', sourceLineStart: 12, sourceLineEnd: 12, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("microtask 1")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'microtask 1' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("microtask 2")', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'microtask 2' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'multiple-awaits',
    title: 'Multiple Awaits',
    description: 'Each await creates a new microtask checkpoint',
    category: 'tricky',
    runtime: 'both',
    code: `async function foo() {
  console.log("foo 1");
  await Promise.resolve();
  console.log("foo 2");
  await Promise.resolve();
  console.log("foo 3");
}

foo();
console.log("after foo");`,
    expectedOutput: ['foo 1', 'after foo', 'foo 2', 'foo 3'],
    explanation: 'Each await pauses the function and schedules continuation as a microtask. "foo 1" runs sync, then foo pauses. "after foo" runs. Then microtasks resume foo twice.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 10, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'foo()', sourceLineStart: 1, sourceLineEnd: 7, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("foo 1")', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'foo 1' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'await Promise.resolve()', sourceLineStart: 3, sourceLineEnd: 3, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'foo() continuation 1', sourceLineStart: 4, sourceLineEnd: 5, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("after foo")', sourceLineStart: 10, sourceLineEnd: 10, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'after foo' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("foo 2")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'foo 2' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'await Promise.resolve()', sourceLineStart: 5, sourceLineEnd: 5, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'foo() continuation 2', sourceLineStart: 6, sourceLineEnd: 6, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("foo 3")', sourceLineStart: 6, sourceLineEnd: 6, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'foo 3' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'promise-executor',
    title: 'Promise Executor is Sync',
    description: 'The Promise constructor callback runs synchronously',
    category: 'tricky',
    runtime: 'both',
    code: `console.log("start");

new Promise((resolve) => {
  console.log("inside promise");
  resolve();
}).then(() => {
  console.log("then");
});

console.log("end");`,
    expectedOutput: ['start', 'inside promise', 'end', 'then'],
    explanation: 'The Promise executor function runs synchronously! Only .then() callbacks are queued as microtasks. "inside promise" logs before "end".',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 10, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("start")', sourceLineStart: 1, sourceLineEnd: 1, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'new Promise(...)', sourceLineStart: 3, sourceLineEnd: 8, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'executor()', sourceLineStart: 3, sourceLineEnd: 6, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("inside promise")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'inside promise' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'resolve()', sourceLineStart: 5, sourceLineEnd: 5, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'then callback', sourceLineStart: 7, sourceLineEnd: 7, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("end")', sourceLineStart: 10, sourceLineEnd: 10, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("then")', sourceLineStart: 7, sourceLineEnd: 7, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'then' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'setimmediate-vs-timeout',
    title: 'setImmediate vs setTimeout',
    description: 'Node.js: setImmediate runs after I/O, setTimeout after timer',
    category: 'node',
    runtime: 'node',
    code: `setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});

console.log("sync");`,
    expectedOutput: ['sync', 'timeout', 'immediate'],
    explanation: 'In Node.js main module, setTimeout(0) typically fires before setImmediate because timer phase comes before check phase. However, this order can vary based on system performance.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 9, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 1, sourceLineEnd: 3, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'timeout callback', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setImmediate(...)', sourceLineStart: 5, sourceLineEnd: 7, color: COLORS.setImmediate } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setImmediate', label: 'immediate callback', sourceLineStart: 6, sourceLineEnd: 6, color: COLORS.setImmediate },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("sync")', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'sync' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout")', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("immediate")', sourceLineStart: 6, sourceLineEnd: 6, color: COLORS.setImmediate } } },
      { type: 'execute', action: { type: 'log', message: 'immediate' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'mixed-async',
    title: 'Mixed Async Patterns',
    description: 'Combining setTimeout, Promise, and async/await',
    category: 'tricky',
    runtime: 'browser',
    code: `async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

async1();

new Promise((resolve) => {
  console.log("promise1");
  resolve();
}).then(() => {
  console.log("promise2");
});

console.log("script end");`,
    expectedOutput: ['script start', 'async1 start', 'async2', 'promise1', 'script end', 'async1 end', 'promise2', 'setTimeout'],
    explanation: 'Classic interview question! Sync code runs first, then all microtasks (async continuations + promise.then), finally setTimeout macrotask.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 25, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("script start")', sourceLineStart: 11, sourceLineEnd: 11, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'script start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 13, sourceLineEnd: 15, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'setTimeout callback', sourceLineStart: 14, sourceLineEnd: 14, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'async1()', sourceLineStart: 1, sourceLineEnd: 5, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("async1 start")', sourceLineStart: 2, sourceLineEnd: 2, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'async1 start' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'async2()', sourceLineStart: 7, sourceLineEnd: 9, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("async2")', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'async2' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'async1 continuation', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'new Promise(...)', sourceLineStart: 19, sourceLineEnd: 24, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'executor()', sourceLineStart: 19, sourceLineEnd: 22, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("promise1")', sourceLineStart: 20, sourceLineEnd: 20, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'promise1' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'promise', label: 'promise2 callback', sourceLineStart: 23, sourceLineEnd: 23, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("script end")', sourceLineStart: 26, sourceLineEnd: 26, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'script end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("async1 end")', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'async1 end' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("promise2")', sourceLineStart: 23, sourceLineEnd: 23, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'promise2' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("setTimeout")', sourceLineStart: 14, sourceLineEnd: 14, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'setTimeout' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },

  {
    id: 'promise-race-condition',
    title: 'Microtask Starvation',
    description: 'Microtasks can starve the macrotask queue',
    category: 'tricky',
    runtime: 'both',
    code: `function recursiveMicrotask(n) {
  if (n <= 0) return;
  console.log("microtask " + n);
  queueMicrotask(() => recursiveMicrotask(n - 1));
}

setTimeout(() => console.log("timeout"), 0);
queueMicrotask(() => recursiveMicrotask(3));
console.log("sync");`,
    expectedOutput: ['sync', 'microtask 3', 'microtask 2', 'microtask 1', 'timeout'],
    explanation: 'Microtasks that queue more microtasks all run before any macrotask. The entire microtask queue must drain before setTimeout runs. This can cause "starvation" if microtasks keep adding more.',
    steps: [
      { type: 'execute', action: { type: 'setPhase', phase: 'script' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'main()', sourceLineStart: 1, sourceLineEnd: 9, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'setTimeout(...)', sourceLineStart: 7, sourceLineEnd: 7, color: COLORS.setTimeout } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMacrotask',
          task: { type: 'setTimeout', label: 'timeout callback', sourceLineStart: 7, sourceLineEnd: 7, color: COLORS.setTimeout },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'queueMicrotask(...)', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.promise } } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'queueMicrotask', label: 'recursiveMicrotask(3)', sourceLineStart: 8, sourceLineEnd: 8, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("sync")', sourceLineStart: 9, sourceLineEnd: 9, color: COLORS.sync } } },
      { type: 'execute', action: { type: 'log', message: 'sync' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'microtasks' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'recursiveMicrotask(3)', sourceLineStart: 1, sourceLineEnd: 5, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("microtask 3")', sourceLineStart: 3, sourceLineEnd: 3, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'microtask 3' } },
      { type: 'execute', action: { type: 'popStack' } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'queueMicrotask', label: 'recursiveMicrotask(2)', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'recursiveMicrotask(2)', sourceLineStart: 1, sourceLineEnd: 5, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("microtask 2")', sourceLineStart: 3, sourceLineEnd: 3, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'microtask 2' } },
      { type: 'execute', action: { type: 'popStack' } },
      {
        type: 'enqueue',
        action: {
          type: 'enqueueMicrotask',
          task: { type: 'queueMicrotask', label: 'recursiveMicrotask(1)', sourceLineStart: 4, sourceLineEnd: 4, color: COLORS.promise },
        },
      },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'microtask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'recursiveMicrotask(1)', sourceLineStart: 1, sourceLineEnd: 5, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("microtask 1")', sourceLineStart: 3, sourceLineEnd: 3, color: COLORS.promise } } },
      { type: 'execute', action: { type: 'log', message: 'microtask 1' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'setPhase', phase: 'task' } },
      { type: 'execute', action: { type: 'dequeueAndRun', queue: 'macrotask' } },
      { type: 'execute', action: { type: 'pushStack', frame: { label: 'console.log("timeout")', sourceLineStart: 7, sourceLineEnd: 7, color: COLORS.setTimeout } } },
      { type: 'execute', action: { type: 'log', message: 'timeout' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'execute', action: { type: 'popStack' } },
      { type: 'complete', action: { type: 'complete' } },
    ],
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function getScenariosByCategory(category: Scenario['category']): Scenario[] {
  return scenarios.filter((s) => s.category === category);
}

export function getScenariosByRuntime(runtime: 'browser' | 'node'): Scenario[] {
  return scenarios.filter((s) => s.runtime === runtime || s.runtime === 'both');
}

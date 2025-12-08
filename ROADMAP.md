# PocketMocker Roadmap

This document outlines the development plan for PocketMocker. Our goal is to evolve from a lightweight tool into a comprehensive, enterprise-ready API mocking platform.

> **Note:** This roadmap is subject to change based on community feedback and priorities.

## Phase 1: Core Experience Enhancements (v1.2.0)

- [ ] **Rule Grouping & Environment Management**
    - Introduce "Groups" or folders to organize rules.
    - Add "Environment" switching (e.g., Dev, Staging, Error-Test) to toggle sets of rules instantly.
- [ ] **GraphQL Support**
    - Implement `operationName` based matching in `matcher.ts`.
    - Add GraphQL-specific UI in the Rule Editor.
    - Adapt Smart Mock generator for GraphQL response structures (`data`/`errors`).
- [ ] **UX Improvements**
    - [ ] Add "Copy to Clipboard" buttons.
    - [ ] Support "Clone Rule" functionality.
    - [ ] Draggable sorting for rules.

## Phase 2: Ecosystem & Connectivity (v1.3.0)

- [ ] **Advanced Import/Export**
    - Export current rules to JSON.
    - Import HAR (HTTP Archive) files from browser network tab.
    - Export rules as Node.js code (e.g., for MSW or unit tests).
- [ ] **Response Streaming Simulation**
    - Support chunked response mocking with configurable delays.
    - Essential for testing AI/LLM applications (Server-Sent Events).
- [ ] **Theming System**
    - Introduce CSS variables for full theming support.

## Phase 3: Architecture & Full-Stack (v2.0.0)

- [ ] **WebSocket Mocking**
    - Intercept `WebSocket` constructor.
    - Rule-based message matching (send A -> reply B).
    - Simulate server-initiated push messages.
- [ ] **Service Worker Mode**
    - Optional interception mode using Service Workers (similar to MSW).
    - Provides cleaner isolation and better compatibility with some libraries.
- [ ] **Headless Mode**
    - Allow running PocketMocker rules in Node.js environments (Jest/Vitest) for API testing.

## Contributing

We welcome contributions to any of these items!
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use React.createElement here to avoid emitting JSX dev helper calls in the
// bundler output (some hosting/build environments can produce `_jsxDEV` calls
// which fail at runtime). This keeps the entry file safe.
createRoot(document.getElementById("root")!).render(React.createElement(App));

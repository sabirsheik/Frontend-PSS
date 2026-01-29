/**
 * ============================================================
 * PSS Frontend Application Entry Point
 * ============================================================
 * 
 * This file bootstraps the React application with all necessary
 * providers and global configurations.
 * 
 * Provider Hierarchy:
 * 1. StrictMode - Highlights potential problems in development
 * 2. QueryClientProvider - TanStack Query for server state management
 * 3. BrowserRouter - React Router for client-side routing
 * 4. App - Main application component
 * 
 * @module main
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { App } from "./App.tsx";
import "./index.css";

/**
 * TanStack Query Client Configuration
 * 
 * Configures global defaults for all queries and mutations.
 * These settings optimize performance and user experience.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Stale Time: How long data is considered fresh (5 minutes)
       * During this time, cached data is returned without refetching
       */
      staleTime: 5 * 60 * 1000,
      
      /**
       * Garbage Collection Time: How long unused data stays in cache (10 minutes)
       * After this, inactive data is removed from memory
       */
      gcTime: 10 * 60 * 1000,
      
      /**
       * Retry: Number of retry attempts on failure
       * Helps handle transient network issues
       */
      retry: 1,
      
      /**
       * Retry Delay: Exponential backoff for retries
       * Prevents overwhelming the server during issues
       */
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      /**
       * Refetch on Window Focus: Disabled for better UX
       * Prevents unexpected refetches when user switches tabs
       */
      refetchOnWindowFocus: false,
      
      /**
       * Refetch on Reconnect: Enabled for data freshness
       * Ensures data is updated after network reconnection
       */
      refetchOnReconnect: true,
    },
    mutations: {
      /**
       * Retry: No retries for mutations by default
       * Prevents duplicate submissions
       */
      retry: 0,
    },
  },
});

/**
 * Render the application
 * 
 * Uses React 18's createRoot API for concurrent features.
 * The root element must exist in index.html.
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check your index.html file.");
}

createRoot(rootElement).render(
  <StrictMode>
    {/* TanStack Query Provider - Manages server state */}
    <QueryClientProvider client={queryClient}>
      {/* React Router - Handles client-side navigation */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
    
    {/* Toast Notifications - Global notification system */}
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        className: "font-sans",
      }}
    />
  </StrictMode>
);

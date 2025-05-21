import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Create a theme provider function that can be used to check the system preference
function getInitialColorMode() {
  const savedColorMode = window.localStorage.getItem('color-mode')
  if (savedColorMode) {
    return savedColorMode
  }
  // Check for system preference
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)')
  return systemPreference.matches ? 'dark' : 'light'
}

// Set the initial color mode
if (getInitialColorMode() === 'dark') {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
) 
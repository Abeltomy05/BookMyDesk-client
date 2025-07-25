import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { persistor, store } from './store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import ErrorBoundary from './utils/errors/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </ErrorBoundary>
 </StrictMode>
)

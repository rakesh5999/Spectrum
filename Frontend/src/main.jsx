import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/app/App.css'
import App from '../src/app/App.jsx'
import { store } from './app/app.store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
 
  <Provider store={store}>
    <App />
 </Provider>
 
)

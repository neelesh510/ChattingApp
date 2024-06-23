import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { configureStore } from '@reduxjs/toolkit';
import './index.css';
import App from './App';
import rootReducer from './reducer';
import { SocketProvider } from './socketContext';

const store = configureStore({
  reducer: rootReducer,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <App />
          <Toaster />
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


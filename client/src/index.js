import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Error from './Pages/Error'
import ConsoleWindow from './__Tests__/Pages/ConsolePage';
const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <App />,
    errorElement: <Error />
  },
  {
    path: "/console", // Root path
    element: <ConsoleWindow />,
    errorElement: <Error />
  }
])
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
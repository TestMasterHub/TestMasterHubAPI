import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Error from './Pages/Error'
import ConsoleWindow from './__Tests__/Pages/ConsolePage';
import Resources from './__Tests__/Pages/Resources';
import Changelog from './__Tests__/Pages/Changelog';
import Community from './__Tests__/Pages/Community';
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
  },
  {
    path: "/resources", // Root path
    element: <Resources />,
    errorElement: <Error />
  },
  {
    path: "/changelog", // Root path
    element: <Changelog />,
    errorElement: <Error />
  },
  {
    path: "/community", // Root path
    element: <Community />,
    errorElement: <Error />
  }
])
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
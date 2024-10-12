import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Error from './Pages/Error';
import ConsoleWindow from './__Tests__/Pages/ConsolePage';
import Resources from './__Tests__/Pages/Resources';
import Changelog from './__Tests__/Pages/Changelog';
import Community from './__Tests__/Pages/Community';
import CollectionPage from './__Tests__/Pages/CollectionPage'; // Import the Collection Page component

const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <App />,
    errorElement: <Error />
  },
  {
    path: "/console", // Console path
    element: <ConsoleWindow />,
    errorElement: <Error />
  },
  {
    path: "/resources", // Resources path
    element: <Resources />,
    errorElement: <Error />
  },
  {
    path: "/changelog", // Changelog path
    element: <Changelog />,
    errorElement: <Error />
  },
  {
    path: "/community", // Community path
    element: <Community />,
    errorElement: <Error />
  },
  {
    path: "/collections/:collectionName", // Dynamic path for collections
    element: <CollectionPage />, // Component to render for collection
    errorElement: <Error />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

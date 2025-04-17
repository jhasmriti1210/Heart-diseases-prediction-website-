import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

import React from "react";

const Prediction = lazy(() => import("./components/pages/prediction"));
const Home = lazy(() => import("./components/pages/home"));

const router = createBrowserRouter([
  {
    path: "/prediction",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Prediction />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

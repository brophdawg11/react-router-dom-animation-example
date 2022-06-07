import React, { Suspense, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  DataBrowserRouter,
  Link,
  Route,
  useLoaderData,
  useLocation,
  useOutlet,
  useParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function AnimatedOutlet() {
  const o = useOutlet();
  const [outlet] = useState(o);
  return <Suspense fallback={<div>Suspense</div>}>{outlet}</Suspense>;
}

function App() {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        fontSize: "calc(10px + 2vmin)",
        position: "relative",
        width: "100vw",
        textAlign: "center",
      }}
    >
      <AnimatePresence initial={false}>
        <PageWrapper key={location.pathname}>
          <AnimatedOutlet />
        </PageWrapper>
      </AnimatePresence>
    </div>
  );
}

//@ts-expect-error
function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: {
          x: "100%",
          y: 0,
        },
        in: {
          x: 0,
          y: 0,
        },
        out: {
          x: "-100%",
          y: 0,
        },
      }}
      transition={{
        duration: 2,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
    >
      {children}
    </motion.div>
  );
}

export const Page = () => {
  let params = useParams();
  let data = useLoaderData();
  let [stableData] = useState(data);

  return (
    <div>
      <nav>
        <Link to="/1">/1</Link> <Link to="/2">/2</Link> <Link to="/3">/3</Link>{" "}
      </nav>
      <p>Page {params.id}</p>
      <p>Random loader value: {stableData.value}</p>
    </div>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <DataBrowserRouter fallbackElement={<p>Loading...</p>}>
    <Route element={<App />}>
      <Route
        path="/"
        element={
          <>
            <Link to="/1">/1</Link>
            <h1>Index</h1>
          </>
        }
      />
      <Route
        path="/:id"
        element={<Page />}
        loader={() => ({
          value: Math.round(Math.random() * 100),
        })}
      />
    </Route>
  </DataBrowserRouter>
);

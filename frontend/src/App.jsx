import Navbar from "./components/Navbar";
import Content from "./components/Content";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Content />
            </>
          }
        />
         

        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;

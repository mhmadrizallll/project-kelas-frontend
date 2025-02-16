import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Protected from "./components/Protected";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            <Protected>
              <Routes>
                <Route path="/home" element={<HomePage />} />
              </Routes>
            </Protected>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;

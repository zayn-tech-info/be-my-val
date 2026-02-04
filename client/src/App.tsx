import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Valentine from "./pages/Valentine";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/v/:id" element={<Valentine />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

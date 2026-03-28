import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Prices from "./pages/Prices";
import Report from "./pages/Report";
import Profile from "./pages/Profile";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/report" element={<Report />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default App;

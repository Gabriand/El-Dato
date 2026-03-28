import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Prices from "./pages/Prices";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import MarketDetail from "./pages/MarketDetail";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/market/:id" element={<MarketDetail />} />
            <Route path="/report" element={<Report />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default App;

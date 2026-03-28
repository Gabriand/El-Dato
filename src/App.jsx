import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Prices from "./pages/Prices";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import MarketDetail from "./pages/MarketDetail";
import EditProfile from "./pages/EditProfile";

function App() {
    return (
        <>
            <Toaster richColors position="top-center" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/prices" element={<Prices />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/market/:id" element={<MarketDetail />} />
                <Route path="/report" element={<Report />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
            </Routes>
        </>
    );
}

export default App;

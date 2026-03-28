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
import MyReports from "./pages/MyReports";
import Favorites from "./pages/Favorites";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Toaster richColors position="top-center" />
            <Routes>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/prices" element={<Prices />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/market/:id" element={<MarketDetail />} />
                
                {/* Rutas Privadas (Protegidas) */}
                <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            </Routes>
        </AuthProvider>
    );
}

export default App;

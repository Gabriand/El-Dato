import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Prices = lazy(() => import("./pages/Prices"));
const Report = lazy(() => import("./pages/Report"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const MarketDetail = lazy(() => import("./pages/MarketDetail"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const MyReports = lazy(() => import("./pages/MyReports"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Register = lazy(() => import("./pages/Register"));

function RouteFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center text-muted font-semibold">
            Cargando pantalla...
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Toaster richColors position="top-center" />
            <Suspense fallback={<RouteFallback />}>
                <Routes>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/prices" element={<Prices />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/market/:id" element={<MarketDetail />} />
                    <Route
                        path="/report"
                        element={
                            <ProtectedRoute>
                                <Report />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-profile"
                        element={
                            <ProtectedRoute>
                                <EditProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-reports"
                        element={
                            <ProtectedRoute>
                                <MyReports />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/favorites"
                        element={
                            <ProtectedRoute>
                                <Favorites />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Suspense>
        </AuthProvider>
    );
}

export default App;

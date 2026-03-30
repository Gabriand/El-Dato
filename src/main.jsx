import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary";

createRoot(document.getElementById("root")).render(
    <AppErrorBoundary>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AppErrorBoundary>,
);

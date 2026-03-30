import { Component } from "react";

export default class AppErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorMessage: "",
        };

        this.handleRetry = this.handleRetry.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: String(error?.message || "Error inesperado."),
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary atrapó un error:", error, errorInfo);
    }

    handleRetry() {
        this.setState({
            hasError: false,
            errorMessage: "",
        });
    }

    handleReload() {
        window.location.reload();
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-md bg-white border-2 border-surface rounded-2xl p-6 shadow-sm text-center">
                    <div className="sm:hidden mb-4 overflow-hidden rounded-2xl border-2 border-surface bg-white p-2">
                        <picture>
                            <source
                                type="image/webp"
                                srcSet="/brand/hero-240.webp 240w, /brand/hero-320.webp 320w, /brand/hero-480.webp 480w"
                                sizes="(max-width: 639px) 90vw, 320px"
                            />
                            <img
                                src="/brand/hero-480.webp"
                                alt="El Dato"
                                className="h-28 w-full rounded-xl bg-white object-contain"
                                loading="eager"
                                decoding="async"
                            />
                        </picture>
                    </div>

                    <div className="hidden sm:flex mb-4 justify-center">
                        <div className="rounded-2xl border-2 border-surface bg-white p-3 shadow-sm">
                            <img
                                src="/brand/logo-64.webp"
                                alt="Logo El Dato"
                                className="h-14 w-14 object-contain"
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    </div>

                    <h1 className="text-xl font-bold text-gray-800 mb-2">
                        Ocurrió un problema
                    </h1>
                    <p className="text-sm text-muted mb-5">
                        La pantalla falló inesperadamente. Puedes intentar de
                        nuevo o recargar la aplicación.
                    </p>
                    <p className="text-xs text-gray-500 bg-surface/40 rounded-lg px-3 py-2 mb-5 wrap-break-word">
                        {this.state.errorMessage}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <button
                            type="button"
                            onClick={this.handleRetry}
                            className="px-4 py-2 rounded-xl bg-surface text-gray-700 font-semibold hover:bg-surface/80 transition-colors"
                        >
                            Reintentar
                        </button>
                        <button
                            type="button"
                            onClick={this.handleReload}
                            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Recargar
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

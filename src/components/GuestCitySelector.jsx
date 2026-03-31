import { useState } from "react";

export default function GuestCitySelector({
    cityOptions,
    activeCityCode,
    activeCityLabel,
    onSelectCity,
    desktopInline = false,
}) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const showMobile = !desktopInline;

    const handleSelectCity = (cityCode) => {
        onSelectCity(cityCode);
        setIsSheetOpen(false);
    };

    return (
        <>
            {showMobile && (
                <div className="sm:hidden mx-5 mb-2">
                    <button
                        type="button"
                        onClick={() => setIsSheetOpen(true)}
                        className="w-full flex items-center justify-between rounded-xl border-2 border-tone bg-tone/30 px-3 py-2"
                    >
                        <span className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-primary"
                                aria-hidden="true"
                            >
                                <path
                                    d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />
                                <path
                                    d="M19.5 10.5C19.5 16.3333 12 21 12 21C12 21 4.5 16.3333 4.5 10.5C4.5 6.35786 7.85786 3 12 3C16.1421 3 19.5 6.35786 19.5 10.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />
                            </svg>
                            {activeCityLabel}
                        </span>
                        <span className="text-primary" aria-hidden="true">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 10L12 14L16 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </button>
                </div>
            )}

            <div
                className={
                    desktopInline
                        ? "hidden sm:block relative w-fit shrink-0"
                        : "hidden sm:block mx-5 lg:mx-10 mb-4 relative w-fit"
                }
            >
                <button
                    type="button"
                    onClick={() => setIsSheetOpen((prev) => !prev)}
                    className="w-full sm:w-auto sm:min-w-64 flex items-center justify-between rounded-xl border-2 border-surface bg-white px-3 py-2 shadow-sm"
                >
                    <span className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="M19.5 10.5C19.5 16.3333 12 21 12 21C12 21 4.5 16.3333 4.5 10.5C4.5 6.35786 7.85786 3 12 3C16.1421 3 19.5 6.35786 19.5 10.5Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                        </svg>
                        Ciudad: {activeCityLabel}
                    </span>
                    <span className="text-xs font-bold text-primary">
                        Cambiar
                    </span>
                </button>

                {isSheetOpen && (
                    <>
                        <button
                            type="button"
                            onClick={() => setIsSheetOpen(false)}
                            className="fixed inset-0 z-20 hidden sm:block"
                            aria-label="Cerrar selector de ciudad"
                        />

                        <div className="absolute top-full right-0 z-30 mt-3 w-[min(30rem,92vw)] rounded-2xl border-2 border-surface bg-white p-4 shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs font-semibold text-gray-700">
                                    Selecciona ciudad de Ecuador
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsSheetOpen(false)}
                                    className="text-xs font-semibold text-muted hover:text-gray-700"
                                >
                                    Cerrar
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {cityOptions.map((cityOption) => {
                                    const isActive =
                                        activeCityCode === cityOption.code;

                                    return (
                                        <button
                                            key={cityOption.code}
                                            type="button"
                                            onClick={() =>
                                                handleSelectCity(
                                                    cityOption.code,
                                                )
                                            }
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                                                isActive
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white text-gray-700 border-surface hover:border-primary"
                                            }`}
                                        >
                                            {cityOption.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showMobile && isSheetOpen && (
                <div
                    className="fixed inset-0 z-40 sm:hidden"
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsSheetOpen(false)}
                        aria-label="Cerrar selector de ciudad"
                    />

                    <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-2 border-surface bg-white px-4 py-4 shadow-xl">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-800">
                                Selecciona tu ciudad
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsSheetOpen(false)}
                                className="text-xs font-semibold text-muted"
                            >
                                Cerrar
                            </button>
                        </div>

                        <p className="mb-3 text-xs text-muted">
                            Mostraremos productos y mercados de la ciudad que
                            elijas.
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                            {cityOptions.map((cityOption) => {
                                const isActive =
                                    activeCityCode === cityOption.code;

                                return (
                                    <button
                                        key={cityOption.code}
                                        type="button"
                                        onClick={() =>
                                            handleSelectCity(cityOption.code)
                                        }
                                        className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                                            isActive
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-surface bg-white text-gray-700"
                                        }`}
                                    >
                                        {cityOption.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

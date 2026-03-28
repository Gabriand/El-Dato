const CITY_CODE_MAP = {
    guayaquil: "gye",
    gye: "gye",
    quito: "uio",
    uio: "uio",
    cuenca: "cue",
    cue: "cue",
};

const CITY_LABEL_MAP = {
    gye: "Guayaquil",
    uio: "Quito",
    cue: "Cuenca",
};

const CITY_ALIASES_MAP = {
    gye: ["gye", "Guayaquil", "guayaquil", "GYE", "GUAYAQUIL"],
    uio: ["uio", "Quito", "quito", "UIO", "QUITO"],
    cue: ["cue", "Cuenca", "cuenca", "CUE", "CUENCA"],
};

export function normalizeCityCode(cityValue) {
    const normalized = String(cityValue || "")
        .trim()
        .toLowerCase();

    if (!normalized) return "gye";
    return CITY_CODE_MAP[normalized] || "gye";
}

export function getCityLabel(cityValue) {
    const code = normalizeCityCode(cityValue);
    return CITY_LABEL_MAP[code] || "Tu localidad";
}

export function getCityAliases(cityValue) {
    const code = normalizeCityCode(cityValue);
    return CITY_ALIASES_MAP[code] || [code];
}

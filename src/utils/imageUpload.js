const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 8 * 1024 * 1024;

function readImage(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("No se pudo leer la imagen seleccionada."));
        };

        img.src = url;
    });
}

function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("No se pudo optimizar la imagen."));
                    return;
                }
                resolve(blob);
            },
            type,
            quality,
        );
    });
}

function getExtension(type) {
    if (type === "image/webp") return "webp";
    if (type === "image/png") return "png";
    return "jpg";
}

export async function optimizeImageForUpload(file, options = {}) {
    if (!file || !(file instanceof File)) {
        throw new Error("Archivo inválido.");
    }

    if (!ALLOWED_TYPES.has(file.type)) {
        throw new Error("Formato no permitido. Usa JPG, PNG o WEBP.");
    }

    if (file.size > MAX_FILE_BYTES) {
        throw new Error("La imagen supera el límite de 8MB.");
    }

    const {
        maxWidth = 1024,
        maxHeight = 1024,
        quality = 0.82,
        outputType = "image/webp",
    } = options;

    const image = await readImage(file);

    const scale = Math.min(
        1,
        maxWidth / image.naturalWidth,
        maxHeight / image.naturalHeight,
    );

    const targetWidth = Math.max(1, Math.round(image.naturalWidth * scale));
    const targetHeight = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No se pudo procesar la imagen.");

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    let blob;
    try {
        blob = await canvasToBlob(canvas, outputType, quality);
    } catch {
        blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }

    const finalType = blob.type || "image/jpeg";
    const baseName = (file.name || "avatar").replace(/\.[^/.]+$/, "");
    const optimizedName = `${baseName}.${getExtension(finalType)}`;

    return new File([blob], optimizedName, { type: finalType });
}

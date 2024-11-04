export function filmEffects(data, opacity, parameters = {}) {
    const saturation = parameters.saturation ?? 1.0;
    const contrast = parameters.contrast ?? 1.0;
    
    const pixels = data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        // Get RGB values
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        
        // Convert to HSL
        let [h, s, l] = rgbToHsl(r, g, b);
        
        // Apply saturation
        s *= saturation;
        s = Math.min(1, Math.max(0, s));
        
        // Convert back to RGB
        [r, g, b] = hslToRgb(h, s, l);
        
        // Apply contrast
        r = applyContrast(r, contrast);
        g = applyContrast(g, contrast);
        b = applyContrast(b, contrast);
        
        // Apply opacity
        r = r * opacity + pixels[i] * (1 - opacity);
        g = g * opacity + pixels[i + 1] * (1 - opacity);
        b = b * opacity + pixels[i + 2] * (1 - opacity);
        
        // Set the pixels
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
    }
}










// Helper function for contrast adjustment
function applyContrast(value, contrast) {
    return Math.min(255, Math.max(0, 
        ((value / 255 - 0.5) * contrast + 0.5) * 255
    ));
}

// Helper functions for color conversions
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}
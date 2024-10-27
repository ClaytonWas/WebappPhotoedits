export function sepia(data, opacity = 1) {
    for (let i = 0; i < data.length; i += 4) {
        const R = Math.min(255, (data[i] * 0.393) + (data[i + 1] * 0.769) + (data[i + 2] * 0.189));
        const G = Math.min(255, (data[i] * 0.349) + (data[i + 1] * 0.686) + (data[i + 2] * 0.168));
        const B = Math.min(255, (data[i] * 0.272) + (data[i + 1] * 0.534) + (data[i + 2] * 0.131));
        
        data[i] = data[i] * (1 - opacity) + R * opacity;
        data[i + 1] = data[i + 1] * (1 - opacity) + G * opacity;
        data[i + 2] = data[i + 2] * (1 - opacity) + B * opacity;
    }
}
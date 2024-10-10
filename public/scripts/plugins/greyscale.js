export const greyscale = (ctx, canvas, brightnessAdjustment=0) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg; // Set R, G, B to the average
        // Apply brightness adjustment
        data[i] += brightnessAdjustment;     // Red
        data[i + 1] += brightnessAdjustment; // Green
        data[i + 2] += brightnessAdjustment; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
}
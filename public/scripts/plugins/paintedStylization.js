export function paintedStylization(data, parameters = {}) {
    const strokeWidth = parameters.width ?? 5
    const strokeLength = parameters.length ?? 5
    const strokeAngle = parameters.angle ?? 45

    const distanceBetweenSamples = parameters.sampling * 4 ?? 40        // Distance between pixels to be sampled. Multiplied by 4 because [R, G, B, A] = 4

    // Get the points you want to sample from.
    for (let i = 0; i < data.length; i += distanceBetweenSamples) {
        console.log(`Pixel ${i/4}: Red ${data[i]}, Green ${data[i+1]}, Blue ${data[i+2]}`)
        
        data[i] = 255
        data[i+1] = 255
        data[i+2] = 255
    }
}

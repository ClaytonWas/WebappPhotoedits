export function paintedStylization(data, parameters = {}) {
    const strokeWidth = parameters.width ?? 5
    const strokeLength = parameters.length ?? 5
    const strokeAngle = parameters.angle ?? 45

    const distanceBetweenSamples = parameters.sampling * 4 ?? 40

    for (let i = 0; i < data.length; i += distanceBetweenSamples) {
        data[i] = 255
        data[i+1] = 255
        data[i+2] = 255
    }
}

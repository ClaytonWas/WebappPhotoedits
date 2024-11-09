export function paintedStylization(image, parameters = {}) {
    let data = image.data

    const strokeWidth = parameters.width ?? 5
    const strokeLength = parameters.length ?? 5
    const strokeAngle = parameters.angle ?? 45

    const distanceBetweenSamples = parameters.sampling * 4 ?? 40        

    // Get the points you want to sample from.
    for (let i = 0; i < data.length; i += distanceBetweenSamples) {
        console.log(`Pixel ${i/4}: Red ${data[i]}, Green ${data[i+1]}, Blue ${data[i+2]}`)
        
        data[i] = 255
        data[i+1] = 255
        data[i+2] = 255
    }

    console.log(data)
}


export function pointsInSpace(image, parameters = {}) {
    let data = image.data

    const distanceBetweenSamples = parameters.sampling * 4 ?? 40        // Distance between pixels to be sampled. Multiplied by 4 because [R, G, B, A] = 4

    // Get the points you want to sample from.
    for (let i = 0; i < data.length; i += distanceBetweenSamples) {        
        data[i] = 255
        data[i+1] = 255
        data[i+2] = 255
    }

    console.log(data)
}

export function linesInSpace(image, parameters = {}) {
    let data = image.data
    const imageWidth = image.width

    const strokeWidth = parameters.width ?? 1
    const strokeLength = parameters.length ?? 3
    let strokeAngle = parameters.angle ?? 90
    strokeAngle = strokeAngle * (Math.PI / 180)
    
    const distanceBetweenSamples = parameters.sampling * 4 ?? 40        


    // Get the points you want to sample from.
    for (let i = 0; i < data.length; i += distanceBetweenSamples) {
        const x = (i / 4) % imageWidth
        const y = Math.floor((i / 4) / imageWidth)

        for (let w = -strokeWidth / 2; w < strokeWidth / 2; w++) {
            for (let l = 0; l < strokeLength; l++) {
                const px = Math.floor(x + Math.cos(strokeAngle) * l + Math.cos(strokeAngle + Math.PI / 2) * w)
                const py = Math.floor(y + Math.sin(strokeAngle) * l + Math.sin(strokeAngle + Math.PI / 2) * w)

                const idx = (py * imageWidth + px) * 4;

                if (px >= 0 && px < imageWidth && py >= 0 && idx < data.length - 2) {
                    data[idx] = 255
                    data[idx + 1] = 255
                    data[idx + 2] = 255
                }
            }
        }
    }


    return data;
}

export function paintStroke(image, parameters = {}) {
    let data = image.data
    const imageWidth = image.width

    const strokeWidth = parameters.width ?? 5
    const strokeLength = parameters.length ?? 5
    let strokeAngle = parameters.angle ?? 45
    strokeAngle = strokeAngle * (Math.PI / 180)
    const distanceBetweenSamples = parameters.sampling * 4 ?? 40
    const edgeThreshold = parameters.edgeThreshold ?? 100

    console.log(data)
    return data;
}

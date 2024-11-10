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

export function vectorsInSpace(image, parameters = {}) {
    const strokeWidth = parameters.width ?? 1
    const strokeLength = parameters.length ?? 3
    const distanceBetweenSamples = parameters.sampling * 4 ?? 40        
    const r = parameters.R ?? 255
    const g = parameters.G ?? 255
    const b = parameters.B ?? 255
    const a = parameters.A ?? 255

    const degrees = parameters.angle ?? 90
    const radians = (degrees * Math.PI) / 180

    for (let i = 0; i < image.data.length; i += distanceBetweenSamples) {
        const currentPixel = (i/4)
        const x = currentPixel % image.width
        const y = Math.floor(currentPixel / image.width)

        // Currently steps by 0.5 instead of 1 because of issues with some angles.
        for (let currentLengthValueOfLine = 0; currentLengthValueOfLine < strokeLength; currentLengthValueOfLine += 0.5) {
            for (let currentWidthValueOfLine = -strokeWidth/2; currentWidthValueOfLine < strokeWidth/2; currentWidthValueOfLine += 0.5) {
                const vectorX = Math.floor(x + Math.cos(radians) * currentLengthValueOfLine + Math.cos(radians + Math.PI / 2) * currentWidthValueOfLine)
                const vectorY = Math.floor(y + Math.sin(radians) * currentLengthValueOfLine + Math.sin(radians + Math.PI / 2) * currentWidthValueOfLine)
    
                const currentDrawIndex = (vectorY * image.width + vectorX) * 4
    
                if (vectorX >= 0 && vectorX < image.width && vectorY >= 0 && currentDrawIndex < image.data.length - 2) {
                    image.data[currentDrawIndex] = r
                    image.data[currentDrawIndex + 1] = g
                    image.data[currentDrawIndex + 2] = b
                    image.data[currentDrawIndex + 3] = a
                }
            }
        }
    }


    return image.data
}

export function paintStroke(image, parameters = {}) {
    const strokeWidth = parameters.width ?? 5
    const strokeLength = parameters.length ?? 5
    const distanceBetweenSamples = parameters.sampling * 4 ?? 40
    const edgeThreshold = parameters.edgeThreshold ?? 100
    
    const degrees = parameters.angle ?? 45
    const radians = degrees * (Math.PI / 180)

    // Calculate edge map using Sobel operator
    const edgeMap = calculateEdgeMap(image.data, image.width)
    
    // Set to track future sample points
    const samplePoints = new Set()
    for (let i = 0; i < image.data.length; i += distanceBetweenSamples) {
        const x = (i/4) % image.width
        const y = Math.floor((i/4) / image.width)
        samplePoints.add(`${x},${y}`)
    }

    // Process each sample point
    for (let i = 0; i < image.data.length; i += distanceBetweenSamples) {
        const currentPixel = (i/4)
        const x = currentPixel % image.width
        const y = Math.floor(currentPixel / image.width)

        // Get source color
        const sourceColor = {
            r: image.data[i],
            g: image.data[i + 1],
            b: image.data[i + 2]
        }

        // Draw the stroke
        for (let currentLengthValueOfLine = 0; currentLengthValueOfLine < strokeLength; currentLengthValueOfLine += 0.5) {
            for (let currentWidthValueOfLine = -strokeWidth/2; currentWidthValueOfLine < strokeWidth/2; currentWidthValueOfLine += 0.5) {
                const vectorX = Math.floor(x + Math.cos(radians) * currentLengthValueOfLine + Math.cos(radians + Math.PI / 2) * currentWidthValueOfLine)
                const vectorY = Math.floor(y + Math.sin(radians) * currentLengthValueOfLine + Math.sin(radians + Math.PI / 2) * currentWidthValueOfLine)
                
                const currentDrawIndex = (vectorY * image.width + vectorX) * 4
                
                // Skip if point is a future sample point
                if (samplePoints.has(`${vectorX},${vectorY}`)) {
                    continue
                }

                // Check if we've hit an edge
                const edgeIndex = vectorY * image.width + vectorX
                if (edgeMap[edgeIndex] > edgeThreshold) {
                    break
                }

                // Draw the pixel if in bounds
                if (vectorX >= 0 && vectorX < image.width && vectorY >= 0 && currentDrawIndex < image.data.length - 2) {
                    image.data[currentDrawIndex] = sourceColor.r
                    image.data[currentDrawIndex + 1] = sourceColor.g
                    image.data[currentDrawIndex + 2] = sourceColor.b
                    image.data[currentDrawIndex + 3] = 255
                }
            }
        }
    }

    return image.data
}

// Helper function to calculate edge map
function calculateEdgeMap(imageData, imageWidth) {
    const height = imageData.length / 4 / imageWidth
    const edgeMap = new Uint8Array(imageWidth * height)

    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < imageWidth - 1; x++) {
            let gx = 0
            let gy = 0

            // Apply Sobel operator
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * imageWidth + (x + kx)) * 4
                    const gray = (imageData[idx] + imageData[idx + 1] + imageData[idx + 2]) / 3
                    const kernelIdx = (ky + 1) * 3 + (kx + 1)
                    gx += gray * sobelX[kernelIdx]
                    gy += gray * sobelY[kernelIdx]
                }
            }

            // Calculate gradient magnitude
            const magnitude = Math.sqrt(gx * gx + gy * gy)
            edgeMap[y * imageWidth + x] = Math.min(255, magnitude)
        }
    }

    return edgeMap
}
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

export function sobelEdges(image, parameters = {}) {
    const referenceImageData = new Uint8ClampedArray(image.data)
    const edgeThreshold = parameters.edgeThreshold ?? 100
    
    // Kernels
    const sobelX = [-1, 0, 1,
                    -2, 0, 2,
                    -1, 0, 1]

    const sobelY = [-1, -2, -1, 
                     0, 0, 0,
                     1, 2, 1]

    // Set image to black rectangle.
    for (let i = 0; i < image.data.length; i += 4) {
        image.data[i] = 0
        image.data[i + 1] = 0
        image.data[i + 2] = 0
        image.data[i + 3] = 255
    }

    // Process all pixels including edges
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            let gradientX = 0
            let gradientY = 0

            // Apply Sobel operator
            for (let kernelY = -1; kernelY <= 1; kernelY++) {
                for (let kernelX = -1; kernelX <= 1; kernelX++) {
                    // Calculate neighbor pixel position
                    const neighbourX = x + kernelX
                    const neighbourY = y + kernelY

                    // Logic to handle neighbour pixels not existing at image borders.
                    const validX = Math.max(0, Math.min(image.width - 1, neighbourX))
                    const validY = Math.max(0, Math.min(image.height - 1, neighbourY))

                    let i = (validY * image.width + validX) * 4
                    const pixelIntensity = (referenceImageData[i] + referenceImageData[i + 1] + referenceImageData[i + 2]) / 3
                    const kernelIndex = (kernelY + 1) * 3 + (kernelX + 1)
                    
                    gradientX += pixelIntensity * sobelX[kernelIndex]
                    gradientY += pixelIntensity * sobelY[kernelIndex]
                }
            }

            // Calculate gradient magnitude.
            // magnitude = √[(∂f/∂x)² + (∂f/∂y)²]
            const magnitude = Math.sqrt(Math.pow(gradientX, 2) + Math.pow(gradientY, 2))
            
            // Draw white if the magnitude of intesntiy change in both directions is above the selected threshold.
            let i = (y * image.width + x) * 4
            if (magnitude > edgeThreshold) {
                image.data[i] = 255
                image.data[i + 1] = 255
                image.data[i + 2] = 255
            }
        }
    }

    return image.data
}

export function prewireEdges(image, parameters = {}) {
    const referenceImageData = new Uint8ClampedArray(image.data)
    const edgeThreshold = parameters.edgeThreshold ?? 100
    
    // Kernels
    const prewireX = [-1, 0, 1,
                    -1, 0, 1,
                    -1, 0, 1]

    const prewireY = [1, 1, 1, 
                     0, 0, 0,
                     -1, -1, -1]

    // Set image to black rectangle.
    for (let i = 0; i < image.data.length; i += 4) {
        image.data[i] = 0
        image.data[i + 1] = 0
        image.data[i + 2] = 0
        image.data[i + 3] = 255
    }

    // Process all pixels including edges
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            let gradientX = 0
            let gradientY = 0

            // Apply Sobel operator
            for (let kernelY = -1; kernelY <= 1; kernelY++) {
                for (let kernelX = -1; kernelX <= 1; kernelX++) {
                    // Calculate neighbor pixel position
                    const neighbourX = x + kernelX
                    const neighbourY = y + kernelY

                    // Logic to handle neighbour pixels not existing at image borders.
                    const validX = Math.max(0, Math.min(image.width - 1, neighbourX))
                    const validY = Math.max(0, Math.min(image.height - 1, neighbourY))

                    let i = (validY * image.width + validX) * 4
                    const pixelIntensity = (referenceImageData[i] + referenceImageData[i + 1] + referenceImageData[i + 2]) / 3
                    const kernelIndex = (kernelY + 1) * 3 + (kernelX + 1)
                    
                    gradientX += pixelIntensity * prewireX[kernelIndex]
                    gradientY += pixelIntensity * prewireY[kernelIndex]
                }
            }

            // Calculate gradient magnitude.
            // magnitude = √[(∂f/∂x)² + (∂f/∂y)²]
            const magnitude = Math.sqrt(Math.pow(gradientX, 2) + Math.pow(gradientY, 2))
            
            // Draw white if the magnitude of intesntiy change in both directions is above the selected threshold.
            let i = (y * image.width + x) * 4
            if (magnitude > edgeThreshold) {
                image.data[i] = 255
                image.data[i + 1] = 255
                image.data[i + 2] = 255
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

        // Use labels to break both loops when edge is detected
        strokeDrawing: {
            for (let currentLengthValueOfLine = 0; currentLengthValueOfLine < strokeLength; currentLengthValueOfLine += 0.5) {
                for (let currentWidthValueOfLine = -strokeWidth/2; currentWidthValueOfLine < strokeWidth/2; currentWidthValueOfLine += 0.5) {
                    const currentPositionOfVectorX = Math.floor(x + Math.cos(radians) * currentLengthValueOfLine + Math.cos(radians + Math.PI / 2) * currentWidthValueOfLine)
                    const currentPositionOfVectorY = Math.floor(y + Math.sin(radians) * currentLengthValueOfLine + Math.sin(radians + Math.PI / 2) * currentWidthValueOfLine)
                    
                    const currentDrawIndex = (currentPositionOfVectorY * image.width + currentPositionOfVectorX) * 4
                    
                    // Skip if point is a future sample point
                    if (samplePoints.has(`${currentPositionOfVectorX},${currentPositionOfVectorY}`)) {
                        continue
                    }

                    // Check if we've hit an edge
                    const edgeIndex = currentPositionOfVectorY * image.width + currentPositionOfVectorX
                    if (edgeMap[edgeIndex] > edgeThreshold) {
                        // Break out of both loops using label
                        break strokeDrawing
                    }

                    // Draw the pixel if in bounds
                    if (currentPositionOfVectorX >= 0 && currentPositionOfVectorX < image.width && currentPositionOfVectorY >= 0 && currentDrawIndex < image.data.length - 2) {
                        image.data[currentDrawIndex] = sourceColor.r
                        image.data[currentDrawIndex + 1] = sourceColor.g
                        image.data[currentDrawIndex + 2] = sourceColor.b
                        image.data[currentDrawIndex + 3] = 255
                    }
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
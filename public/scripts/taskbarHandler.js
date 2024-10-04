import { ImageProcessingHandler } from './core/imageProcessingHandler.js';

//Temporary code both in placement and in content to load greyscale images.
const greyscale = (ctx, canvas, brightnessAdjustment = 0) => {
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

document.addEventListener('DOMContentLoaded', () => {
    // Initialize handler to allow direct calls throughout the UI
    var imageProcessingHandler = null

    // "Open" click, passes user to the hidden upload Input which recieves an image file.
    document.getElementById('openFile').addEventListener('click', () => {
        document.getElementById('uploadFile').click()
    })

    // Passed on "Open" click
    // Recieves the FileList (in this case always a single image) and builds the canvas.
    document.getElementById('uploadFile').addEventListener('change', (response) => {
        const imageFile = response.target.files[0]
        if(imageFile) {
            const image = new Image()
            image.src = URL.createObjectURL(imageFile)

            image.onload = function() {
                const imageCanvas = document.getElementById('imageCanvas')
                const context = imageCanvas.getContext('2d')

                imageProcessingHandler = new ImageProcessingHandler(image, imageCanvas)
                imageProcessingHandler.loadImage()

                URL.revokeObjectURL(imageFile);


                //Temporary code both in placement and in content to load greyscale images.
                document.getElementById('greyscale').addEventListener('click', () => {
                    console.log('Greyscale function:', greyscale)
                    imageProcessingHandler.addLayer(greyscale)
                    imageProcessingHandler.applyLayers()
                    imageProcessingHandler.loadImage()
                })

            };
        }
    })
});
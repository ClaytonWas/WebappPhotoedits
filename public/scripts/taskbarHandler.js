import { ImageProcessingHandler } from './core/imageProcessingHandler.js';
import { greyscale } from './plugins/greyscale.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize handler to allow direct calls throughout the UI
    var imageProcessingHandler = null

    // "Open" click, passes user to the hidden upload Input which recieves an image file.
    document.getElementById('openFile').addEventListener('click', () => {
        document.getElementById('uploadFile').click()
    })

    // Passed on "Open" click
    // Recieves the FileList (in this case always a single image) and builds the canvas.
    // Initalizes canvas.
    // Scales divs within the imageViewingModule, this doesn't resize the canvas obeject directly. No loss of quality.
    document.getElementById('uploadFile').addEventListener('change', (response) => {
        const imageFile = response.target.files[0]        
        if(imageFile) {
            document.getElementById("imageCanvasDiv").style.height = `${window.screen.height / 2}px`
            document.getElementById("imageCanvasDiv").style.width = `${window.screen.width / 2}px`

            const image = new Image()
            image.src = URL.createObjectURL(imageFile)

            image.onload = function() {
                const imageCanvas = document.getElementById('imageCanvas')
                const context = imageCanvas.getContext('2d')

                imageProcessingHandler = new ImageProcessingHandler(image, imageCanvas)
                imageProcessingHandler.loadImage()

                URL.revokeObjectURL(imageFile);
            };

            
        }
    })

    //Temporary code both in placement and in content to load greyscale images.
    document.getElementById('greyscale').addEventListener('click', () => {
        console.log('Greyscale function:', greyscale)
        imageProcessingHandler.addLayer(greyscale)
        imageProcessingHandler.applyLayers()
        imageProcessingHandler.loadImage()
    })
});
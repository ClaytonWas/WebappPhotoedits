import { Layer } from './layer.js';

export class ImageProcessingHandler {
    constructor(image, canvas = null) {
        this.image = image
        this.modifiedImage = image
        this.layers = []

        // Allows canvas to be created on the fly if not using the front end.
        this.imageCanvas = canvas || document.createElement('canvas')
        this.imageCanvasContext = this.imageCanvas.getContext('2d')
        this.imageCanvas.width = this.image.width
        this.imageCanvas.height = this.image.height
    };

    // Load image loads a canvas with the passed image.
    // TODO: It's important to do this to allow the user to crop the image at a later date. (I will need to change this.image calls to something more relative.)
    // TODO: This should also avoid the problem of reloading an image, and it should allow applyLayers() to start at the index of the current image without redrawing everything below it.
    loadImage() {
        this.imageCanvasContext.drawImage(this.modifiedImage, 0, 0)
    };

    // Passes an effect, and associated effect variables as its arguement(s).
    addLayer(effect) {
        console.log('Adding layer with effect:', effect)
        const layer = new Layer(effect)
        this.layers.push(layer)
    };

    // Loads image using base context and applies all layers.
    // TOFO: This is inefficient as it recomputes all layers on layer update but for now its fine.
    applyLayers() {
        this.layers.forEach(layer => {
            console.log('Applying effect:', layer.effect)
            layer.applyEffect(this.imageCanvas)
        })

        this.modifiedImage = this.imageCanvas
    };

    // Function to get image data. 
    // This contains a imageData.data array which has each set of 4 entries mapped to R,G,B,A.
    getImageData() {
        const imageData = imageCanvasContext.getImageData(0, 0, this.imageCanvas.width, this.imageCanvas.height)
        return imageData
    };
};
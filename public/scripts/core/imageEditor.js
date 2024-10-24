import { Layer, LayerManager } from './layers.js';

export class ImageEditor {
    constructor(image, canvas = null) {
        this.image = image
        this.modifiedImage = image
        this.layerManager = new LayerManager()

        this.imageCanvas = canvas || document.createElement('canvas')
        this.imageCanvasContext = this.imageCanvas.getContext('2d')
        this.imageCanvas.width = this.image.width
        this.imageCanvas.height = this.image.height
    }

    // Load image loads a canvas with the passed image.
    // TODO: It's important to do this to allow the user to crop the image at a later date. (I will need to change this.image calls to something more relative.)
    // TODO: This should also avoid the problem of reloading an image, and it should allow applyLayers() to start at the index of the current image without redrawing everything below it.
    loadImage() {
        this.imageCanvasContext.drawImage(this.modifiedImage, 0, 0)
    }

    exportImage() {
        //return this.imageCanvas.toDataURL("image/png");
    }
}
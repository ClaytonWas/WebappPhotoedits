import { Layer, LayerManager } from './layers.js';

export class ImageEditor {
    constructor(image, imageName, imageFileType, canvas = null) {
        // Imported Image Data
        this.image = image
        this.Name = imageName // Source Image Name
        this.FileType = imageFileType // Source Image File Type Represented As: `image/<extension>`
        this.FileExtension = this.FileType.slice(6) // Slicing The 'image/' Off FileType

        // Created Image Data
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
        let exportAnchor = document.createElement('a')
        exportAnchor.href = this.imageCanvas.toDataURL(this.FileType)
        exportAnchor.download = `${this.Name}_PhotoEditsExport.${this.FileExtension}`
        exportAnchor.click()
    }
}
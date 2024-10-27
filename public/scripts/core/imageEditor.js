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
        this.canvas = canvas || document.createElement('canvas')
        this.canvasContext = this.canvas.getContext('2d')
        this.canvas.width = this.image.width
        this.canvas.height = this.image.height
    }

    // Load image loads a canvas with the passed image.
    // TODO: It's important to do this to allow the user to crop the image at a later date. (I will need to change this.image calls to something more relative.)
    // TODO: This should also avoid the problem of reloading an image, and it should allow applyLayers() to start at the index of the current image without redrawing everything below it.
    loadImage() {
        this.canvasContext.drawImage(this.modifiedImage, 0, 0)
    }

    exportImage() {
        let exportAnchor = document.createElement('a')
        exportAnchor.href = this.canvas.toDataURL(this.FileType)
        exportAnchor.download = `${this.Name}_PhotoEditsExport.${this.FileExtension}`
        exportAnchor.click()
    }

    renderImage() {
        this.modifiedImage = this.image
        this.canvasContext.drawImage(this.modifiedImage, 0, 0)
        const imageData = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        this.layerManager.applyLayerEffects(imageData)

        this.canvasContext.putImageData(imageData, 0, 0)
        console.log('Image Drawn')
    }

    toggleVisibility(index) {
        this.layerManager.toggleVisibility(index)
    }

    addLayer() {
        this.layerManager.addLayer()
    }

    deleteLayer(index) {
        this.layerManager.deleteLayer(index)
        this.renderImage()
    }

    setSelectedIndex(index) {
        if(index == null) {
            this.layerManager.selectedLayerIndex = null
        } else if (this.layerManager.layers[index]) {
            this.layerManager.selectedLayerIndex = index
        } else {
            console.log(`Layer at index ${index} does not exist. Selected index not updated.`)
        }
    }

    getSelectedIndex() {
        return this.layerManager.selectedLayerIndex
    }
}
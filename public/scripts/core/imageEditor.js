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
        this.canvas.width = this.modifiedImage.width
        this.canvas.height = this.modifiedImage.height
        this.canvasContext.drawImage(this.modifiedImage, 0, 0)
    }

    quickExport() {
        let exportAnchor = document.createElement('a')
        exportAnchor.href = this.canvas.toDataURL(this.FileType)
        exportAnchor.download = `${this.Name}_PhotoEditsExport.${this.FileExtension}`
        exportAnchor.click()
    }

    renderImage() {
        this.modifiedImage = this.image
        this.canvasContext.drawImage(this.modifiedImage, 0, 0)
        const imageData = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height)
        
        this.layerManager.applyLayerEffects(imageData)

        this.canvasContext.putImageData(imageData, 0, 0)
    }

    bilinearInterpolation() {

    }

    nearestNeighbourInterpolation(newHeight, newWidth, isConstrained, interpolationType) {
        // Create a new canvas for the interpolated image
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        // Nearest Neighbor Interpolation Algorithm
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                // Calculate the position in the original image
                const originalX = Math.floor((x * this.image.width) / newWidth);
                const originalY = Math.floor((y * this.image.height) / newHeight);

                // Get the pixel color from the original image
                const pixelData = this.canvasContext.getImageData(originalX, originalY, 1, 1).data;

                // Set the pixel color in the new image
                tempContext.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                tempContext.fillRect(x, y, 1, 1);
            }
        }

        // Update the modified image with the interpolated image data
        let resizedImage = new Image()
        resizedImage.src = tempCanvas.toDataURL(this.FileType)
        this.image = resizedImage

        // Optionally, draw the modified image to the original canvas
        this.canvas.height = newHeight
        this.canvas.width = newWidth
        this.canvasContext.drawImage(tempCanvas, 0, 0);
    }

    // This changes the resolution of this.image. Can be dangerous as we rely on this.image being an accurate representation of the provided image.
    // The reason we change this.image has to do this this.renderImage()
    resizeCanvas(newHeight, newWidth, isConstrained, interpolationType) {
        console.log('Passing through: ', newHeight, newWidth, isConstrained, interpolationType)

        if (isConstrained) {

        }

        // Were going to need to resize both the regular image and the modified image.
        if (interpolationType === "Nearest Neighbour") {
            console.log("Nearest Neighbour Interpolation Chosen")
            this.nearestNeighbourInterpolation(newHeight, newWidth, isConstrained, interpolationType)
        } else if (interpolationType === "Bilinear") {
            console.log("Bilinear Interpolation Chosen")
        }

        this.renderImage()
    }

    toggleVisibility(index) {
        this.layerManager.toggleVisibility(index)
        this.renderImage()
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
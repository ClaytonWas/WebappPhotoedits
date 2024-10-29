import { Layer, LayerManager } from './layers.js';

export class ImageEditor {
    constructor(image, name, type, extension, canvas, context) {
        this.IMAGE = image
        /* this.IMAGE
        This is the Image() element that stores the original image:
          If anything bad happens to an image type, revert to this.
          This is your guiding light in the abyss.
          Do not overwrite this.
          Maintain in memory always.
          It's not inefficient, it's good redundancy.
          Affirm!
        */

        this.NAME = name 
        this.EXTENSION = extension                   
        this.TYPE = type
        /* this.XXXX
        Variables that are passed in from the larger File type that maps onto the class.
            Example Structure:
                Name:           squirrel
                Extension:      png
                Type:           image/png 
        */
 
    
        this.canvas = canvas
        this.context = canvas.getContext("2d")

        // Created Image Data
        this.modifiedImage = this.IMAGE
        this.layerManager = new LayerManager()
        this.canvas.width = this.IMAGE.width
        this.canvas.height = this.IMAGE.height
    }

    // Load image loads a canvas with the passed image.
    // TODO: It's important to do this to allow the user to crop the image at a later date. (I will need to change this.image calls to something more relative.)
    // TODO: This should also avoid the problem of reloading an image, and it should allow applyLayers() to start at the index of the current image without redrawing everything below it.
    loadImage() {
        this.context.drawImage(this.IMAGE, 0, 0)
    }

    quickExport() {
        let exportAnchor = document.createElement('a')
        exportAnchor.href = this.canvas.toDataURL(this.TYPE)
        exportAnchor.download = `${this.NAME}_PhotoEditsExport.${this.EXTENSION}`
        exportAnchor.click()
    }

    renderImage() {
        this.modifiedImage = this.IMAGE
        this.context.drawImage(this.modifiedImage, 0, 0)
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        
        this.layerManager.applyLayerEffects(imageData)

        this.context.putImageData(imageData, 0, 0)
    }

    bilinearInterpolation(newWidth, newHeight) {

    }

    nearestNeighbourInterpolation(newHeight, newWidth) {
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                // Calculate the position in the original image
                const originalX = Math.floor((x * this.IMAGE.width) / newWidth);
                const originalY = Math.floor((y * this.IMAGE.height) / newHeight);

                // Get the pixel color from the original image
                const pixelData = this.context.getImageData(originalX, originalY, 1, 1).data;

                // Set the pixel color in the new image
                tempContext.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                tempContext.fillRect(x, y, 1, 1);
            }
        }

        // Update core image to the new height and width.
        let resizedImage = new Image()
        resizedImage.src = tempCanvas.toDataURL(this.TYPE)
        this.IMAGE = resizedImage

        this.canvas.height = newHeight
        this.canvas.width = newWidth
        this.context.drawImage(tempCanvas, 0, 0);
    }

    // This changes the resolution of this.image. Can be dangerous as we rely on this.image being an accurate representation of the provided image.
    // The reason we change this.image has to do this this.renderImage()
    resizeCanvas(newHeight, newWidth, maintainAspectRatio, interpolationType) {
        console.log('Passing through: ', newHeight, newWidth, maintainAspectRatio, interpolationType)



        // Were going to need to resize both the regular image and the modified image.
        if (interpolationType === "Nearest Neighbour") {
            console.log("Nearest Neighbour Interpolation Chosen")
            this.nearestNeighbourInterpolation(newHeight, newWidth)
        } else if (interpolationType === "Bilinear") {
            console.log("Bilinear Interpolation Chosen")
            this.bilinearInterpolation(newHeight, newWidth)
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
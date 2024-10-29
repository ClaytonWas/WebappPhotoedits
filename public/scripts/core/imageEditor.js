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
 
        this.image = this.IMAGE                     // Used to resize images from from the original image dimensions while allow overwrites. 
        this.canvas = canvas
        this.context = canvas.getContext("2d")

        // Created Image Data
        this.modifiedImage = this.IMAGE
        this.layerManager = new LayerManager()
        this.canvas.width = this.IMAGE.width
        this.canvas.height = this.IMAGE.height
    }

    // Load image loads a canvas with the passed image.
    // TODO: It's important to do this to allow the user to crop the image at a later date. (I will need to change this.IMAGE calls to something more relative.)
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
        this.modifiedImage = this.image
        this.context.drawImage(this.modifiedImage, 0, 0)
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        
        this.layerManager.applyLayerEffects(imageData)

        this.context.putImageData(imageData, 0, 0)
    }

    bilinearInterpolation(newWidth, newHeight) {

    }

    nearestNeighbourInterpolation(newWidth, newHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        this.image = this.IMAGE
        tempContext.drawImage(this.image, 0, 0, newWidth, newHeight); //I had no clue draw image had prebuilt interpolation, im just doing this instead wow

        // Create new Image from the tempCanvas Context
        let resizedImage = new Image();
        resizedImage.src = tempCanvas.toDataURL(this.TYPE);
        resizedImage.onload = () => {
            this.image = resizedImage;
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.context.drawImage(resizedImage, 0, 0);
        };
    }

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
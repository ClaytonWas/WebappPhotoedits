import { Layer, LayerManager } from './layers.js';

export class ImageEditor {
    constructor(image, name, type, extension, canvas) {
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
        this.modifiedImage = this.image
        this.layerManager = new LayerManager()
        this.canvas.width = this.IMAGE.width
        this.canvas.height = this.IMAGE.height
    }

    // loadImage loads a canvas with the original image data.
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
        // Come back to this tomorrow
    }

    nearestNeighbourInterpolation(newWidth, newHeight) {

    }

    // Uses the browsers default setting for context.drawImage() calls
    defaultInterpolation(newWidth, newHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        this.image = this.IMAGE

        //Currently this is doing lininterp.
        tempContext.drawImage(this.image, 0, 0, newWidth, newHeight); // Make a linear interpolation that works with this new data type.

        // Create new Image from the tempCanvas Context
        let resizedImage = new Image();
        resizedImage.src = tempCanvas.toDataURL(this.TYPE);
        resizedImage.onload = () => {
            this.image = resizedImage;
            this.context.drawImage(resizedImage, 0, 0);
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.renderImage()
        };

        tempCanvas.remove()
    }

    resizeCanvas(newHeight, newWidth, maintainAspectRatio, interpolationType) {
        console.log('Passing through: ', newHeight, newWidth, maintainAspectRatio, interpolationType)
        if (interpolationType === "Default") {
            console.log("Default Interpolation Chosen")
            this.defaultInterpolation(newWidth, newHeight)
        } else if (interpolationType === "Nearest Neighbour") {
            console.log("Nearest Neighbour Interpolation Chosen")
            this.nearestNeighbourInterpolation(newWidth, newHeight)
        } else if (interpolationType === "Bilinear") {
            console.log("Bilinear Interpolation Chosen")
            this.bilinearInterpolation(newWidth, newHeight)
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

    changeCanvasHSV(hue, saturate, brightness) {
        this.context.filter = `
        hue-rotate(${hue}deg)
        saturate(${saturate}%)
        brightness(${brightness}%)
        `
    }
}
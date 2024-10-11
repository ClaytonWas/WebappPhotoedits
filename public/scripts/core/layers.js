export class Layer {
    constructor(imageData=null, name="New Layer", visible = true, opacity = 1) {
        this.imageData = imageData
        this.name = name
        this.visible = visible
        this.opacity = opacity
    }
}

export class LayerManager {
    constructor() {
        this.layers = []
    }

    addLayer() {
        const layer = new Layer()
        this.layers.push(layer)
    }

    // When I figure out how to write imageData as layers I need to implement this.
    filterLayer(index) {
        this.layers[index].imageData = null
    }

    deleteLayer(index) {
        this.layers.splice(index, 1)
    }

    toggleVisability(index) {
        this.layers[index].visible = !this.layers[index].visible
    }

    setOpacity(index, opacity) {
        this.layers[index].opacity = opacity
    }
}
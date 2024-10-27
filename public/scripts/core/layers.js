export class Layer {
    constructor(id, imageData=null, name="New Layer", visible = true, opacity = 1, effect=null) {
        this.id = id
        this.imageData = imageData
        this.name = name
        this.visible = visible
        this.opacity = opacity
        this.effect = effect
    }

    applyEffect(image) {
        let data = image.data
        this.effect(data)
    }
}

export class LayerManager {
    constructor() {
        this.layers = []
        this.selectedLayerIndex = null // Is the selected index in this.layers[], null otherwise.
    }

    addLayer() {
        let layerId = this.layers.length
        const layer = new Layer(layerId)
        this.layers.push(layer)
        this.selectedLayerIndex = this.layers.length
    }

    addLayerEffect(index, effect) {
        this.layers[index].effect = effect
    }

    applyLayerEffects(imageData) {
        for (const layer of this.layers) {
            if (layer.effect && layer.visible) {
                layer.applyEffect(imageData)
                console.log(`Applying effect of layer ${layer.id}: ${layer.name}`)
            }
        }
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
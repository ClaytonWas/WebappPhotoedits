export class Layer {
    constructor(name="New Layer", visible = true, opacity = 1, effect=null) {
        this.name = name
        this.visible = visible
        this.opacity = opacity
        this.effect = effect
    }

    applyEffect(image) {
        this.effect(image.data)
    }
}

export class LayerManager {
    constructor() {
        this.layers = []
        this.selectedLayerIndex = null // Is the selected index in this.layers[], null otherwise.
    }

    addLayer() {
        const layer = new Layer()
        this.layers.push(layer)
        this.selectedLayerIndex = this.layers.length
    }

    addLayerEffect(index, effect) {
        this.layers[index].effect = effect
    }

    applyLayerEffects(image) {
        for (const layer of this.layers) {
            if (layer.effect && layer.visible) {
                layer.applyEffect(image)
                console.log(`Applying effect of layer: ${layer.name}`)
            }
        }
    }

    deleteLayer(index) {
        this.layers.splice(index, 1)
    }

    toggleVisibility(index) {
        this.layers[index].visible = !this.layers[index].visible
    }

    setOpacity(index, opacity) {
        this.layers[index].opacity = opacity
    }
}
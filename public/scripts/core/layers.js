export class Layer {
    constructor(name="New Layer", visible = true, opacity = 1, effect=null, effectParameters = {}) {
        this.name = name
        this.visible = visible
        this.opacity = opacity
        this.effect = effect
        this.effectParameters = effectParameters
    }

    applyEffect(image) {
        if (!this.effect) return;
    
        // Prepare parameters with only "value:" properties for each effect parameter
        const params = {};
        for (const [key, config] of Object.entries(this.effectParameters)) {
            params[key] = config.value;  // Extract only the value for each parameter
        }
    
        this.effect(image.data, params);
    }

    setEffect(selectedEffect, parameters = {}) {
        this.effect = selectedEffect
        this.effectParameters = parameters
    }

    setEffectParams(parameters) {
        // Iterate over each parameter to ensure only the value is modified
        for (let key in parameters) {
            if (this.effectParameters[key]) {
                this.effectParameters[key].value = parameters[key].value;
            }
        }
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

    addLayerEffect(index, effect, parameters = {}) {
        this.layers[index].setEffect(effect, parameters)
    }

    applyLayerEffects(image) {
        for (const layer of this.layers) {
            if (layer.effect && layer.visible && layer.opacity > 0) {
                layer.applyEffect(image)
                console.log(`Applying effect of layer: ${layer.name}`, layer.effectParameters)
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
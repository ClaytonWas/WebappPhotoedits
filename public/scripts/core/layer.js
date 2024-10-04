export class Layer {
    constructor(effect) {
        this.effect = effect
    };

    applyEffect(imageCanvas) {
        const canvasContext = imageCanvas.getContext('2d')

        console.log(this.effect);

        this.effect(canvasContext, imageCanvas)
    };
};
function initializeOriginalImageDataModule(imageEditor) {
    document.title = `PhotoEdits | ${imageEditor.NAME}`

    document.getElementById('titleName').textContent = 'Name:'
    document.getElementById('imageName').textContent = imageEditor.NAME

    document.getElementById('titleDimensions').textContent = 'Dimensions:'
    document.getElementById('imageDimensions').textContent = `${imageEditor.IMAGE.width} x ${imageEditor.IMAGE.height}px`

    document.getElementById('titleExtension').textContent = 'Extension:'
    document.getElementById('imageExtension').textContent = `.${imageEditor.EXTENSION}`
}

window.addEventListener('imageEditorReady', (event) => {
    let imageEditor = event.detail.instance;
    
    imageEditor.loadImage()
    initializeOriginalImageDataModule(imageEditor)
})
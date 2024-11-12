function initializeOriginalImageDataModule(imageEditor) {
    document.title = `PhotoEdits | ${imageEditor.NAME}`

    document.getElementById('titleName').textContent = 'Name:'
    document.getElementById('imageName').textContent = imageEditor.NAME

    document.getElementById('titleDimensions').textContent = 'Dimensions:'
    document.getElementById('imageDimensions').textContent = `${imageEditor.IMAGE.width} x ${imageEditor.IMAGE.height}px`

    document.getElementById('titleExtension').textContent = 'Extension:'
    document.getElementById('imageExtension').textContent = `.${imageEditor.EXTENSION}`
}

export function initializeModifiedImageDataModule(imageEditor) {
    document.getElementById('titleNameModified').textContent = 'Name:'
    document.getElementById('imageNameModified').textContent = imageEditor.NAME

    document.getElementById('titleDimensionsModified').textContent = 'Dimensions:'
    document.getElementById('imageDimensionsModified').textContent = `${imageEditor.image.width} x ${imageEditor.image.height}px`

    document.getElementById('titleExtensionModified').textContent = 'Extension:'
    document.getElementById('imageExtensionModified').textContent = `.${imageEditor.EXTENSION}`
}

window.addEventListener('imageEditorReady', (event) => {
    let imageEditor = event.detail.instance;
    imageEditor.loadImage()                         // Render
    initializeOriginalImageDataModule(imageEditor)  // Initializing Modules Begins
    initializeModifiedImageDataModule(imageEditor)
    // Initializing Modules Ends


    const viewingModule = document.querySelector('.imageViewingModule')
    const canvasDiv = document.querySelector('#imageCanvasDiv')
    const canvas = imageEditor.canvas
    const context = imageEditor.context

    let isPanning = false
    let isCropping = false
    let startPoint = { x: 0, y: 0 }
    let currentTranslate = { x: 0, y: 0 }
    let scale = 1

    function updateTransform() {
        canvasDiv.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }

    viewingModule.addEventListener('mousedown', (event) => {
        if (isCropping) return
        isPanning = true

        startPoint = {
            x: event.clientX - currentTranslate.x,
            y: event.clientY - currentTranslate.y
        }

        viewingModule.style.cursor = 'grabbing'
    })
  
    viewingModule.addEventListener('mousemove', (event) => {
        if (isCropping || !isPanning) return
        
        currentTranslate = {
            x: event.clientX - startPoint.x,
            y: event.clientY - startPoint.y
        }
        
        updateTransform()
    })
  
    viewingModule.addEventListener('mouseup', () => {
        if (isCropping) return
        isPanning = false
        viewingModule.style.cursor = 'grab'
    })
  
    viewingModule.addEventListener('mouseleave', () => {
        if (isCropping) return
        isPanning = false
        viewingModule.style.cursor = 'grab'
    })
  
    // Zoom functionality
    viewingModule.addEventListener('wheel', (event) => {
        if (isCropping) return
        event.preventDefault()
        
        const rect = viewingModule.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
  
        // Calculate where the mouse is relative to the canvas
        const beforeTransformX = (mouseX - currentTranslate.x) / scale
        const beforeTransformY = (mouseY - currentTranslate.y) / scale
  
        // Zoom adjustment based on scroll direction.
        scale *= event.deltaY < 0 ? 1.1 : 0.9
        /*
        *   This line adjusts the scale factor based on the deltaY property of the scroll event (event.deltaY). 
                
            If event.deltaY is negative (typically when scrolling up), scale is multiplied by 1.1, 
            which increases the amount of space the canvas takes up it by 10%.
            If event.deltaY is positive (scrolling down), scale is multiplied by 0.9, reducing canvas by 10%.
        */
        
        // Limit zoom level to 0.1-10 times original size.
        scale = Math.min(Math.max(0.5, scale), 20)
  
        // Calculate the new position after scale
        const afterTransformX = (mouseX - currentTranslate.x) / scale
        const afterTransformY = (mouseY - currentTranslate.y) / scale
  
        // Adjust translation to keep the mouse point in the same place
        currentTranslate.x += (afterTransformX - beforeTransformX) * scale
        currentTranslate.y += (afterTransformY - beforeTransformY) * scale
  
        updateTransform()
    })
})
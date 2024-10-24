import { ImageEditor } from './core/imageEditor.js';
import { greyscale } from './plugins/greyscale.js';

let imageEditor = null

// Function for initializing an image for front end use from a provided image file.
// The primary purpose of this function is to initalize an ImageEditor object.
async function uploadImage(imageFile) {
    try {
        const image = new Image()
        image.src = URL.createObjectURL(imageFile)
        URL.revokeObjectURL(imageFile)
        image.onload = function () {
            const imageCanvas = document.getElementById('imageCanvas')

            // Understanding Image Data
            const fileName = imageFile.name.substring(0, imageFile.name.lastIndexOf('.'))
            const fileType = imageFile.type

            // Initializing Image Editor
            imageEditor = new ImageEditor(image, fileName, fileType, imageCanvas)
            imageEditor.loadImage()

            // Setting Title
            document.title = `PhotoEdits | ${fileName}`

            // Initializing Front End Layers Manager List
            let layersList = document.getElementById('layersList')
            layersList.innerHTML = ''

            // Initalizing Image Data Module
            document.getElementById('titleName').textContent = 'Name:'
            document.getElementById('imageName').textContent = imageEditor.Name

            document.getElementById('titleDimensions').textContent = 'Dimensions:'
            document.getElementById('imageDimensions').textContent = `${imageEditor.image.width} x ${imageEditor.image.height}px`

            document.getElementById('titleExtension').textContent = 'Extension:'
            document.getElementById('imageExtension').textContent = `.${imageEditor.FileExtension}`

            return imageEditor
        }
    } catch (error) {
        console.error('Error importing image:', error)
    }
}

// Function that takes the current imageEditor and recreates layerDiv's dynamically based on updates to the imageEditor.layerManager.
// This removes the selectedLayerIndex reference.
function renderLayersList(imageEditor) {
    let layersList = document.getElementById('layersList')
    let index = 0
    layersList.innerHTML = ''

    imageEditor.layerManager.layers.forEach(layer => {
        const layerDiv = document.createElement('div')
        layerDiv.className = 'layerDiv'
        layerDiv.id = index

        const layerDivName = document.createElement('p')
        layerDivName.classList.add('layerDivName')
        layerDivName.textContent = layer.name

        const layerDivToggleVisability = document.createElement('input')
        layerDivToggleVisability.classList.add('layerDivToggleVisability')
        layerDivToggleVisability.type = 'checkbox'
        layerDivToggleVisability.checked = layer.visible


        layerDiv.appendChild(layerDivName)
        layerDiv.appendChild(layerDivToggleVisability)
        layersList.appendChild(layerDiv)

        index += 1
    })

    imageEditor.layerManager.selectedLayerIndex = null
}

window.addEventListener('load', () => {

    /*
    * Taskbar Event Listeners
    */

    // Opens file browser and loads the selected image to the canvas.
    document.getElementById('openFile').addEventListener('click', () => {
        document.getElementById('uploadFile').click()
    })
    document.getElementById('uploadFile').addEventListener('change', (response) => {        
        if(response.target.files[0]) {   
            const imageFile = response.target.files[0]   
            uploadImage(imageFile).catch((error) => {
                console.error('Image editor could not be instantiated:', error)
            })
        }
    })
    
    document.getElementById('quickExport').addEventListener('click', () => {
        imageEditor.exportImage()
    })
    //Temporary code both in placement and in content to load greyscale images.
    document.getElementById('greyscale').addEventListener('click', () => {
        console.log('Greyscale function:', greyscale)
    })




    /*
    * Layers Selector Event Listeners
    */

    // Listens to double clicks on layerDiv's to create a rename input.
    let layersList_HTMLElement = document.getElementById('layersList')
    layersList_HTMLElement.addEventListener('dblclick', (event) => {
        var selectedLayerDivName = event.target.closest('.layerDivName')
        if(selectedLayerDivName) {
            const selectedLayerDiv = event.target.closest('.layerDiv')
            if(selectedLayerDiv) {
                const selectedLayerIndex = selectedLayerDiv.id
                
                // Dynamic creation of input.
                const layerNameInput = document.createElement('input')
                layerNameInput.type = 'text'
                layerNameInput.name = 'newInput'
                layerNameInput.value = imageEditor.layerManager.layers[selectedLayerIndex].name
                selectedLayerDivName.textContent = ''
                selectedLayerDivName.appendChild(layerNameInput)
                
                // Bringing the new input to the users attention. Saves text in input field when unfocused.
                layerNameInput.focus()
                layerNameInput.addEventListener('blur', () => {
                    const newLayerName = layerNameInput.value
                    imageEditor.layerManager.layers[selectedLayerIndex].name = newLayerName
                    renderLayersList(imageEditor)
                    imageEditor.layerManager.selectedLayerIndex = selectedLayerIndex
                    const layerDivs = document.querySelectorAll('.layerDiv')
                    layerDivs[selectedLayerIndex].classList.add('selectedLayerDiv')
                })
                layerNameInput.addEventListener('keydown', (keypress) => {
                    if (keypress.key === 'Enter') {
                        layerNameInput.blur()
                    }
                })
            }
        }
    })

    layersList_HTMLElement.addEventListener('click', (event) => {
        const selectedLayerDiv = event.target.closest('.layerDiv')
        if(selectedLayerDiv) {
            const layerDivs = document.querySelectorAll('.layerDiv')
            layerDivs.forEach(layer => layer.classList.remove('selectedLayerDiv'))
            selectedLayerDiv.classList.add('selectedLayerDiv')
            imageEditor.layerManager.selectedLayerIndex = Number(selectedLayerDiv.id)
        }
    })

    document.getElementById('addLayer').addEventListener('click', () => {
        // Now I neeed to map the data structure of the layer to the list element of the same name.
        imageEditor.layerManager.addLayer()
        
        // Then call renderLayers
        renderLayersList(imageEditor)
        let layersList = document.getElementById('layersList')
        layersList.lastElementChild.classList.add('selectedLayerDiv')
        imageEditor.layerManager.selectedLayerIndex = Number(layersList.lastElementChild.id)
    })

    document.getElementById('deleteLayer').addEventListener('click', () => {
        // Check if there is a currently selected layer, remove layer and the layerManager index point if it exists.
        const selectedLayerIndex = imageEditor.layerManager.selectedLayerIndex
        if (selectedLayerIndex !== null) {
            imageEditor.layerManager.deleteLayer(selectedLayerIndex)
            imageEditor.layerManager.selectedLayerIndex = null
        }

        renderLayersList(imageEditor)
    })
});
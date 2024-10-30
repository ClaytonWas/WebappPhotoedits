// Function that takes the current imageEditor and recreates layerDiv's dynamically based on updates to the imageEditor.layerManager.
// This removes the selectedLayerIndex reference.
function renderLayersList(imageEditor) {
    let layersList = document.getElementById('layersList')
    let index = 0
    layersList.innerHTML = ''

    imageEditor.layerManager.layers.forEach(layer => {
        const layer_HTMLDiv = document.createElement('div')
        layer_HTMLDiv.className = 'layerDiv'
        layer_HTMLDiv.id = index

        const layerName = document.createElement('p')
        layerName.classList.add('layerDivName')
        layerName.textContent = layer.name

        const visabilityCheckbox = document.createElement('input')
        visabilityCheckbox.classList.add('layerDivToggleVisability')
        visabilityCheckbox.type = 'checkbox'
        visabilityCheckbox.checked = layer.visible
        visabilityCheckbox.id = index
        visabilityCheckbox.addEventListener('click', () => {
            imageEditor.toggleVisibility(visabilityCheckbox.id)
        })

        layer_HTMLDiv.appendChild(layerName)
        layer_HTMLDiv.appendChild(visabilityCheckbox)
        layersList.appendChild(layer_HTMLDiv)

        index += 1
    })

    imageEditor.layerManager.selectedLayerIndex = null
}

window.addEventListener('imageEditorReady', (event) => {
    let imageEditor = event.detail.instance;

    let layersList_HTMLElement = document.getElementById('layersList')

    // Clicks on layerDiv's to select layer.
    layersList_HTMLElement.addEventListener('click', (event) => {
        const selectedLayer_HTMLDiv = event.target.closest('.layerDiv')
        if(selectedLayer_HTMLDiv) {
            const layerDivs = document.querySelectorAll('.layerDiv')
            layerDivs.forEach(layer => {
                layer.classList.remove('selectedLayerDiv')
            })
            selectedLayer_HTMLDiv.classList.add('selectedLayerDiv')
            imageEditor.setSelectedIndex(Number(selectedLayer_HTMLDiv.id))
        }
    })

    // Double clicks on layerDiv's to rename selected layer.
    layersList_HTMLElement.addEventListener('dblclick', (event) => {
        var selectedLayerDivName = event.target.closest('.layerDivName')
        if(selectedLayerDivName) {
            const selectedLayerDiv = event.target.closest('.layerDiv')
            if(selectedLayerDiv) {
                const selectedLayerIndex = Array.from(selectedLayerDiv.parentNode.children).indexOf(selectedLayerDiv)
                
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

    document.getElementById('addLayer').addEventListener('click', () => {
        // Now I neeed to map the data structure of the layer to the list element of the same name.
        imageEditor.layerManager.addLayer()

        // Then call renderLayers
        renderLayersList(imageEditor)
        layersList_HTMLElement.lastElementChild.classList.add('selectedLayerDiv')
        imageEditor.setSelectedIndex(Number(layersList_HTMLElement.lastElementChild.id))
    })

    document.getElementById('deleteLayer').addEventListener('click', () => {
        // Check if there is a currently selected layer, remove layer and the layerManager index point if it exists.
        const selectedLayerIndex = imageEditor.getSelectedIndex()
        if (selectedLayerIndex !== null) {
            imageEditor.deleteLayer(selectedLayerIndex)
            imageEditor.setSelectedIndex(null)
        }

        renderLayersList(imageEditor)
    })
})
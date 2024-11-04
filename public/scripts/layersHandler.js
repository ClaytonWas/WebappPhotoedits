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

function renderLayerProperties(imageEditor) {
    let propertiesDiv = document.getElementById("currentLayerSelector")
    let selectedLayerIndex = imageEditor.getSelectedIndex()

    propertiesDiv.innerHTML = ''

    if (!imageEditor.layerManager.layers[selectedLayerIndex]) {
        return
    } 
    
    let layer = imageEditor.layerManager.layers[selectedLayerIndex]

    propertiesDiv.classList.add('layerPropertiesOpacity')
    let opacityDiv = document.createElement("div")
    let opacityP = document.createElement("p")
    opacityP.textContent = 'Opacity'
    
    let opacitySlider = document.createElement("input")
    opacitySlider.type = 'range'
    opacitySlider.min = '0'
    opacitySlider.max = '1'
    opacitySlider.step = '0.01'
    opacitySlider.value = layer.opacity

    let opacityInput = document.createElement("input")
    opacityInput.value = layer.opacity

    opacityDiv.appendChild(opacityP)
    opacityDiv.appendChild(opacitySlider)
    opacityDiv.appendChild(opacityInput)
    propertiesDiv.appendChild(opacityDiv)

    // Layer displays parameters that are needed.
    if (layer.effect && layer.effectParameters) {
        Object.entries(layer.effectParameters).forEach(([parameterName, parameterValue]) => {
            let parameterDiv = document.createElement("div")
            parameterDiv.classList.add('effectParameter')
            let parameterP = document.createElement("p")
            parameterP.textContent = parameterName.charAt(0).toUpperCase() + parameterName.slice(1)
            
            let parameterSlider = document.createElement("input")
            let parameterInput = document.createElement("input")

            if (typeof parameterValue === 'number') {
                parameterSlider.type = 'range'
                parameterSlider.min = '0'
                parameterSlider.max = '1'
                parameterSlider.step = '0.1'
                parameterSlider.value = parameterValue

                parameterInput.type = 'number'
                parameterInput.step = '0.1'
                parameterInput.value = parameterValue

                parameterSlider.addEventListener('mouseup', () => {
                    parameterInput.value = parameterSlider.value
                    const params = { ...layer.effectParameters }
                    params[parameterName] = parseFloat(parameterSlider.value)
                    layer.setEffectParams(params)
                    imageEditor.renderImage()
                })

                parameterInput.addEventListener('change', () => {
                    parameterSlider.value = parameterInput.value
                    const params = { ...layer.effectParameters }
                    params[parameterName] = parseFloat(parameterInput.value)
                    layer.setEffectParams(params)
                    imageEditor.renderImage()
                })

                parameterDiv.appendChild(parameterP)
                parameterDiv.appendChild(parameterSlider)
                parameterDiv.appendChild(parameterInput)
            } else if (typeof parameterValue === 'boolean') {
                parameterInput.type = 'checkbox'
                parameterInput.checked = parameterValue

                parameterInput.addEventListener('change', () => {
                    const params = { ...layer.effectParameters }
                    params[parameterName] = parameterInput.checked
                    layer.setEffectParams(params)
                    imageEditor.renderImage()
                })

                parameterDiv.appendChild(parameterP)
                parameterDiv.appendChild(parameterInput)
            } else {
                // Garbage input collection
                parameterInput.type = 'text'
                parameterInput.value = parameterValue

                parameterInput.addEventListener('change', () => {
                    const params = { ...layer.effectParameters }
                    params[parameterName] = parameterInput.value
                    layer.setEffectParams(params)
                    imageEditor.renderImage()
                })

                parameterDiv.appendChild(parameterP)
                parameterDiv.appendChild(parameterInput)
            }

            propertiesDiv.appendChild(parameterDiv)
        })
    }

    opacitySlider.addEventListener('change', () => {
        opacityInput.value = opacitySlider.value
        layer.opacity = opacitySlider.value

        imageEditor.renderImage()
    })

    opacityInput.addEventListener('change', () => {
        if (opacityInput.value > 1) {
            opacityInput.value = 1
        } else if (opacityInput.value < 0) {
            opacityInput.value = 0
        }
        opacityInput.value = parseFloat(opacityInput.value).toFixed(2)
        opacitySlider.value = opacityInput.value
        layer.opacity = opacitySlider.value

        imageEditor.renderImage()
    })
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
            imageEditor.setSelectedIndex(selectedLayer_HTMLDiv.id)
            renderLayerProperties(imageEditor, selectedLayer_HTMLDiv.id)
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
        imageEditor.setSelectedIndex(layersList_HTMLElement.lastElementChild.id)
        renderLayerProperties(imageEditor)
    })

    document.getElementById('deleteLayer').addEventListener('click', () => {
        // Check if there is a currently selected layer, remove layer and the layerManager index point if it exists.
        const selectedLayerIndex = imageEditor.getSelectedIndex()
        if (selectedLayerIndex !== null) {
            imageEditor.deleteLayer(selectedLayerIndex)
            imageEditor.setSelectedIndex(null)
        }

        renderLayersList(imageEditor)
        renderLayerProperties(imageEditor, selectedLayerIndex)

    })
})
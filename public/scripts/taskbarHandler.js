import { ImageEditor } from './core/imageEditor.js';
import { filmEffects } from './plugins/filmEffects.js';
import { greyscale } from './plugins/greyscale.js';
import { sepia } from './plugins/sepia.js';


let imageEditor = null

function resetEditor() {
    if (imageEditor) {
        imageEditor = null;
    }

    // Reset UI elements related to the image data
    document.getElementById('titleName').textContent = '';
    document.getElementById('imageName').textContent = '';
    document.getElementById('titleDimensions').textContent = '';
    document.getElementById('imageDimensions').textContent = '';
    document.getElementById('titleExtension').textContent = '';
    document.getElementById('imageExtension').textContent = '';
    document.getElementById("currentLayerSelector").innerHTML = '';


    // Clear layers list
    document.getElementById('layersList').innerHTML = '';
    document.title = 'PhotoEdits';

    // Hide or reset any other UI modules
    closeResizeModule();
}

async function uploadImage() {
    const file = document.querySelector("input[type=file]").files[0];
    if (!file) return;

    resetEditor();

    const reader = new FileReader();
    const image = new Image();

    // File Metadata
    const name = file.name.substring(0, file.name.lastIndexOf('.'));
    const type = file.type;
    const extension = type.slice(6);
    const canvas = document.getElementById('imageCanvas');

    // Writes image data (Base64) to image.src
    reader.onload = () => {
        image.src = reader.result;
    };

    image.onload = () => {
        imageEditor = new ImageEditor(image, name, type, extension, canvas);
        window.imageEditor = imageEditor

        const imageEditorInstantiationEvent = new CustomEvent('imageEditorReady', { detail: { instance: imageEditor } });
        window.dispatchEvent(imageEditorInstantiationEvent)
    };

    reader.readAsDataURL(file);
}

function openResizeModule() {
    document.getElementById('resizeModule').style.display = 'block'
    document.querySelector('.taskbarItemDropdown').classList.add('noTaskbarItemCollapse')
}

function closeResizeModule() {
    document.getElementById('resizeModule').style.display = 'none'
    document.querySelector('.taskbarItemDropdown').classList.remove('noTaskbarItemCollapse')

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
        Object.entries(layer.effectParameters).forEach(([parameterName, parameterConfig]) => {
            let parameterDiv = document.createElement("div")
            parameterDiv.classList.add('effectParameter')
            let parameterP = document.createElement("p")
            parameterP.textContent = parameterName.charAt(0).toUpperCase() + parameterName.slice(1)

            const { value: parameterValue, range = [0, 1] } = parameterConfig
            
            let parameterSlider = document.createElement("input")
            let parameterInput = document.createElement("input")

            if (typeof parameterValue === 'number') {
                parameterSlider.type = 'range'
                parameterSlider.min = range[0]
                parameterSlider.max = range[1]
                parameterSlider.step = (range[1] - range[0]) / 100
                parameterSlider.value = parameterValue

                parameterInput.type = 'number'
                parameterInput.min = range[0]
                parameterInput.max = range[1]
                parameterInput.step = (range[1] - range[0]) / 100
                parameterInput.value = parameterValue

                parameterSlider.addEventListener('mouseup', () => {
                    parameterInput.value = parameterSlider.value
                    layer.effectParameters[parameterName].value = parseFloat(parameterSlider.value)
                    layer.setEffectParams(layer.effectParameters)
                    imageEditor.renderImage()
                })

                parameterInput.addEventListener('change', () => {
                    parameterSlider.value = parameterInput.value
                    layer.effectParameters[parameterName].value = parseFloat(parameterInput.value)
                    layer.setEffectParams(layer.effectParameters)
                    imageEditor.renderImage()
                })

                parameterDiv.appendChild(parameterP)
                parameterDiv.appendChild(parameterSlider)
                parameterDiv.appendChild(parameterInput)
            } else if (typeof parameterValue === 'boolean') {
                parameterInput.type = 'checkbox'
                parameterInput.checked = parameterValue

                parameterInput.addEventListener('change', () => {
                    layer.effectParameters[parameterName].value = parameterInput.checked
                    layer.setEffectParams(layer.effectParameters)
                    imageEditor.renderImage()
                })

                parameterDiv.appendChild(parameterP)
                parameterDiv.appendChild(parameterInput)
            } else {
                parameterInput.type = 'text'
                parameterInput.value = parameterValue

                parameterInput.addEventListener('change', () => {
                    layer.effectParameters[parameterName].value = parameterInput.value
                    layer.setEffectParams(layer.effectParameters)
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
        opacityInput.value = Math.min(Math.max(parseFloat(opacityInput.value), 0), 1).toFixed(2)
        opacitySlider.value = opacityInput.value
        layer.opacity = opacitySlider.value
        imageEditor.renderImage()
    })
}

window.addEventListener('load', () => {

    /*
    * Taskbar Event Listeners
    */

    // Opens file browser and loads the selected image to the canvas.
    document.getElementById('openFile').addEventListener('click', () => {
        const fileInput = document.getElementById("uploadFile");
        fileInput.addEventListener("change", uploadImage)
        fileInput.click()
    })
    
    document.getElementById('quickExport').addEventListener('click', () => {
        imageEditor.quickExport()
    })

    document.getElementById('resize').addEventListener('click', () => {
        openResizeModule()
    })

    document.getElementById('cancelResize').addEventListener('click', () => {
        closeResizeModule()
    })

    let maintainAspectRatio = document.getElementById('constrainedCheckbox')
    maintainAspectRatio.addEventListener('change', () => {
        let resizeHeight = document.getElementById('resizeHeight')
        let resizeWidth = document.getElementById('resizeWidth')
        let DIV = document.getElementById('resizeScaleDIV')
        let scaleFactor = document.getElementById('resizeScale')

        if (maintainAspectRatio.checked) {
            DIV.style.display = 'flex'
            document.getElementById('resizeScaleDiv')

            resizeHeight.disabled = true
            resizeWidth.disabled = true

            resizeHeight.value = imageEditor.IMAGE.height
            resizeWidth.value = imageEditor.IMAGE.width

            scaleFactor.addEventListener('change', () => {
                if (scaleFactor.value < 0.1) {
                    scaleFactor.value = 0.1
                } else if (scaleFactor.value > 10) {
                    scaleFactor.value = 10
                }

                resizeHeight.value = Math.round(imageEditor.IMAGE.height * scaleFactor.value)
                resizeWidth.value = Math.round(imageEditor.IMAGE.width * scaleFactor.value)
                
            })
        } else {
            DIV.style.display = 'none'

            resizeHeight.disabled = false
            resizeWidth.disabled = false

            scaleFactor.value = '1'
        }
    })

    document.getElementById('resizeSubmit').addEventListener('click', () => {
        // Gather the data from the form.
        let newHeight = document.getElementById('resizeHeight').value
        let newWidth = document.getElementById('resizeWidth').value
        let isConstrained = document.getElementById('constrainedCheckbox').checked
        let interpolationType = document.getElementById('interpolationType').value

        imageEditor.resizeCanvas(newHeight, newWidth, isConstrained, interpolationType)
    })

    document.getElementById('rotateImage').addEventListener('click', () => {
        //Cool!
    })



    // Filter applications
    document.getElementById('greyscale').addEventListener('click', () => {
        let index = imageEditor.getSelectedIndex()
        imageEditor.layerManager.addLayerEffect(index, greyscale)
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })

    document.getElementById('sepia').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(), 
            sepia,
            {
                intensity: { value: 1, range: [0, 1] }
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })

    document.getElementById('filmEffects').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            filmEffects,
            {
                saturation: { value: 0, range: [0, 255] },
                contrast: { value: 0, range: [0, 255] },
                colourPalette: { value: 0, range: [-100, 100] }
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })
})
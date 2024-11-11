import { ImageEditor } from './core/imageEditor.js';
import { paintedStylization, pointsInSpace, vectorsInSpace, sobelEdges, prewireEdges } from './plugins/paintedStylization.js'
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
    closeHSVModule();
    document.getElementById('hsvReset').click()
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
}

function closeResizeModule() {
    document.getElementById('resizeModule').style.display = 'none'
}

function openHSVModule() {
    document.getElementById('hsvModule').style.display = 'block'
}

function closeHSVModule() {
    document.getElementById('hsvModule').style.display = 'none'
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

            const { value: parameterValue, range = [0, 1], valueStep: stepValue} = parameterConfig
            
            let parameterSlider = document.createElement("input")
            let parameterInput = document.createElement("input")

            if (typeof parameterValue === 'number') {
                parameterSlider.type = 'range'
                parameterSlider.min = range[0]
                parameterSlider.max = range[1]
                parameterSlider.step = stepValue
                parameterSlider.value = parameterValue

                parameterInput.type = 'number'
                parameterInput.min = range[0]
                parameterInput.max = range[1]
                parameterInput.step = stepValue
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


    // Core image modifications
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
        document.getElementById('hsvReset').click()
    })

    document.getElementById('hsv').addEventListener('click', () => {
        openHSVModule()
    })

    document.getElementById('hsvCancel').addEventListener('click', () => {
        closeHSVModule()
    })

    let hueSlider = document.getElementById('hueSlider')
    let saturationSlider = document.getElementById('saturationSlider')
    let brightnessSlider = document.getElementById('brightnessSlider')
    hueSlider.addEventListener('change', () => {
        console.log(hueSlider.value)
        if(imageEditor) {
            imageEditor.context.filter = `
            hue-rotate(${hueSlider.value}deg)
            saturate(${saturationSlider.value}%)
            brightness(${brightnessSlider.value}%)
            `
            imageEditor.renderImage()
        }
    })
    saturationSlider.addEventListener('change', () => {
        console.log(saturationSlider.value)
        if(imageEditor) {
            imageEditor.context.filter = `
            hue-rotate(${hueSlider.value}deg)
            saturate(${saturationSlider.value}%)
            brightness(${brightnessSlider.value}%)
            `
            imageEditor.renderImage()
        }
    })
    brightnessSlider.addEventListener('change', () => {
        console.log(brightnessSlider.value)
        if(imageEditor) {
            imageEditor.context.filter = `
            hue-rotate(${hueSlider.value}deg)
            saturate(${saturationSlider.value}%)
            brightness(${brightnessSlider.value}%)
            `
            imageEditor.renderImage()
        }
    })
    document.getElementById('hsvReset').addEventListener('click', () => {
        hueSlider.value = 0
        saturationSlider.value = 100
        brightnessSlider.value = 100
        if(imageEditor) {
            imageEditor.context.filter = `
            hue-rotate(0deg)
            saturate(100%)
            brightness(100%)
            `
            imageEditor.renderImage()
        }
    })

    document.getElementById('rotateImage').addEventListener('click', () => {
        // Implement this soon!
        console.log('Rotate Image!')
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
                intensity: { value: 1, range: [0, 1], valueStep: 0.01 }
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
                contrast: { value: 0, range: [0, 255], valueStep: 1 },
                colourPalette: { value: 0, range: [-100, 100], valueStep: 1 }
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })
    document.getElementById('paintedStylization').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            paintedStylization,
            {
                width: { value: 5, range: [1, 200], valueStep: 1 },
                length: { value: 5, range: [1, 200], valueStep: 1 },
                angle: {value: 145, range: [0, 360], valueStep: 1 },
                sampling: {value: 10, range: [5, 10000], valueStep: 1},
                edgeThreshold: {value: 100, range: [1, 200], valueStep: 1}
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })


    // Visualization filters (for concepts from labs and other cool things that I couldn't fit neatly into a catagory.)
    document.getElementById('pointsInSpace').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            pointsInSpace,
            {
                sampling: {value: 10, range: [2, 100], valueStep: 1}
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })

    document.getElementById('vectorsInSpace').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            vectorsInSpace,
            {
                width: { value: 1, range: [1, 500], valueStep: 1 },
                length: { value: 3, range: [1, 1000], valueStep: 1 },
                angle: {value: 0, range: [0, 360], valueStep: 1 },
                sampling: {value: 10, range: [2, 1000000], valueStep: 1},
                R: {value: 255, range: [0, 255], valueStep: 1},
                G: {value: 255, range: [0, 255], valueStep: 1},
                B: {value: 255, range: [0, 255], valueStep: 1},
                A: {value: 255, range: [0, 255], valueStep: 1}
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })

    document.getElementById('sobelEdges').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            sobelEdges,
            {
                edgeThreshold: {value: 50, range: [0, 255], valueStep: 1}
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })

    document.getElementById('prewireEdges').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            prewireEdges,
            {
                edgeThreshold: {value: 50, range: [0, 255], valueStep: 1}
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })
})
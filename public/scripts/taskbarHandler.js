import { ImageEditor } from './core/imageEditor.js';
import { initializeModifiedImageDataModule } from './canvasHandler.js'
import { renderLayerProperties } from './layersHandler.js'
import { paintedStylization, pointsInSpace, vectorsInSpace, sobelEdges, sobelEdgesColouredDirections, prewireEdges, prewireEdgesColouredDirections } from './plugins/paintedStylization.js'
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
    document.getElementById('hsvReset').click();
    closeCropModule();
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

function openCropModule() {
    document.getElementById('cropModule').style.display = 'block'
}

function closeCropModule() {
    document.getElementById('cropModule').style.display = 'none'
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

            resizeHeight.value = imageEditor.image.height
            resizeWidth.value = imageEditor.image.width

            scaleFactor.addEventListener('change', () => {
                if (scaleFactor.value < 0.1) {
                    scaleFactor.value = 0.1
                } else if (scaleFactor.value > 10) {
                    scaleFactor.value = 10
                }

                resizeHeight.value = Math.round(imageEditor.image.height * scaleFactor.value)
                resizeWidth.value = Math.round(imageEditor.image.width * scaleFactor.value)
                
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

        setTimeout(() => {
            initializeModifiedImageDataModule(imageEditor);
        }, 50);
    })

    document.getElementById('crop').addEventListener('click', () => {
        openCropModule()
    })

    document.getElementById('cancelCrop').addEventListener('click', () => {
        closeCropModule()
    })

    document.getElementById('cropSubmit').addEventListener('click', () => {
        let startHeight = document.getElementById('cropStartHeight').value
        let startWidth = document.getElementById('cropStartWidth').value

        let endHeight = document.getElementById('cropEndHeight').value
        let endWidth = document.getElementById('cropEndWidth').value

        imageEditor.crop(startHeight, startWidth, endHeight, endWidth)
        
        setTimeout(() => {
            initializeModifiedImageDataModule(imageEditor);
        }, 50);
    })

    document.getElementById('resetImage').addEventListener('click', () => {
        imageEditor.resetImage()
        setTimeout(() => {
            initializeModifiedImageDataModule(imageEditor);
        }, 50);
        imageEditor.renderImage()
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
        if(!imageEditor) return
        imageEditor.changeCanvasHSV(hueSlider.value, saturationSlider.value, brightnessSlider.value)
        imageEditor.renderImage()
    })
    saturationSlider.addEventListener('change', () => {
        if(!imageEditor) return
        imageEditor.changeCanvasHSV(hueSlider.value, saturationSlider.value, brightnessSlider.value)
        imageEditor.renderImage()
    })
    brightnessSlider.addEventListener('change', () => {
        if(!imageEditor) return
        imageEditor.changeCanvasHSV(hueSlider.value, saturationSlider.value, brightnessSlider.value)
        imageEditor.renderImage()
    })
    document.getElementById('hsvReset').addEventListener('click', () => {
        hueSlider.value = 0
        saturationSlider.value = 100
        brightnessSlider.value = 100
        if(!imageEditor) return
        imageEditor.changeCanvasHSV(hueSlider.value, saturationSlider.value, brightnessSlider.value)
    })

    document.getElementById('rotateCW90').addEventListener('click', () => {
        imageEditor.rotate(90)
    })

    document.getElementById('rotateCCW90').addEventListener('click', () => {
        imageEditor.rotate(-90)
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
                width: { value: 5, range: [1, 500], valueStep: 1 },
                length: { value: 5, range: [1, 1000], valueStep: 1 },
                angle: {value: 145, range: [0, 360], valueStep: 1 },
                sampling: {value: 10, range: [5, 1000000], valueStep: 1},
                edgeThreshold: {value: 100, range: [1, 255], valueStep: 1}
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
    
    document.getElementById('sobelEdgesColouredDirections').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            sobelEdgesColouredDirections,
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

    document.getElementById('prewireEdgesColouredDirections').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(
            imageEditor.getSelectedIndex(),
            prewireEdgesColouredDirections,
            {
                edgeThreshold: {value: 50, range: [0, 255], valueStep: 1}
            }
        )
        renderLayerProperties(imageEditor)
        imageEditor.renderImage()
    })
})
import { ImageEditor } from './core/imageEditor.js';
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
        console.log('clicked!')
        imageEditor.canvas.style.transform = 'rotate(90deg)'
    })



    // Filter applications
    document.getElementById('greyscale').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(imageEditor.getSelectedIndex(), greyscale)
        imageEditor.renderImage()
    })

    document.getElementById('sepia').addEventListener('click', () => {
        imageEditor.layerManager.addLayerEffect(imageEditor.getSelectedIndex(), sepia)
        imageEditor.renderImage()
    })
});
import { ImageEditor } from './core/imageEditor.js';
import { greyscale } from './plugins/greyscale.js';

let imageEditor = null

//

async function uploadImage(imageFile) {
    try {
        const image = new Image()
        image.src = URL.createObjectURL(imageFile)
        URL.revokeObjectURL(imageFile)
        image.onload = function () {
            const imageCanvas = document.getElementById('imageCanvas')

            var imageEditor = new ImageEditor(image, imageCanvas)
            imageEditor.loadImage()
            return imageEditor
        }
    } catch (error) {
        console.error('Error importing image:', error)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Opens file browser and loads the selected image to the canvas.
    document.getElementById('openFile').addEventListener('click', () => {
        document.getElementById('uploadFile').click()
    })
    document.getElementById('uploadFile').addEventListener('change', (response) => {        
        const imageFile = response.target.files[0]   
        uploadImage(imageFile).then((editor) => {
            imageEditor = editor
            document.title = 'PhotoEdits | ' + imageFile.name   
        }).catch((error) => {
            console.error('Image editor could not be instantiated:', error)
        })
    })
    


    //Temporary code both in placement and in content to load greyscale images.
    document.getElementById('greyscale').addEventListener('click', () => {
        console.log('Greyscale function:', greyscale)
    })


    document.getElementById('addLayer').addEventListener('click', () => {
        let layersList = document.getElementById('layersList')
        let layer = document.createElement('li')
        layer.textContent = 'New Layer'

        //imageEditor.addLayer()
        console.log('Fix this add layer passing reference error issue.')
        layersList.appendChild(layer)
    })
});
# WebappPhotoedits
Photo manipulation software using JavaScript inspired by applications like Photoshop and Photopea.
Provding filter and image transformations.

# Current Stage
A JavaScript Webapp that serves a photo manipulation user interface to a front-end user using Node.js and Express.js. This code also contains functionality to be used apart from a front end to allow programatic interactions by creating on the fly canvas elements for image instantiation.

Currently in development.

### Installation
1. Install packages:
   ```bash
   npm i
   ```
2. Run local server:
   ```bash
   node server.js
   ```

### Images
Image imports working with front end users local storage.
![File Imports](./public/images/fileImportsOnUI.png)

Front end visualization of image.
![Image Import](./public/images/RosesOnImport.jpg)

Taskbar interaction that manipulates the image mapped to the canvas.
![Greyscaling](./public/images/RosesGreyscaleOnTaskbar.jpg)

### TODO:
1. Change the layers system to work as intended layers instead of overwriting the core image sequentially.
2. Get the plugins system to load into the handler on instantiation.
3. Separate the logic of the image proccessor into a low level manipluation class, and a higher level import class. This needs plugins to work, so implement those first. (This would be super cool.)
4. Plugins...


### Most important TODO
Implement the imageViewingModule that handles the frame of reference the canvas, canvas space, and layers side bar will exist in. 
Currently the taskbarHandler changes the canvas div to be 1/2 the screens height, needs to be made more like this. ^ 
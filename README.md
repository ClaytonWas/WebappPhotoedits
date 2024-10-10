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
1. Get the layers system to appear dynamically in the layers selector. Writing this I realize I don't know exactly how layers work in lightroom, and I need to ask Jacob for help. The goal is to have filters be applied incrementally, but obviously different types of layers will effect this.
2. Change the layers system to work as intended layers instead of overwriting the core image sequentially. This is harder done than said.
3. Get the plugins system to load into the handler on instantiation.
4. Separate the logic of the image proccessor into a low level manipluation class, and a higher level import class. This needs plugins to work, so implement those first. (This would be super cool.)
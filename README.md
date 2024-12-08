# WebappPhotoedits
Photo manipulation software using JavaScript inspired by applications like Photoshop and Photopea.
Provding filter and image transformations. <br >
[Version 0.1 Showcase](https://youtu.be/N5Vu2j7mWeA) <br >
[Version 0.2 Showcase](https://youtu.be/yxHyBOE9t0Q) This is not meant to be a comprehensive overview.
# Current Stage
A webapp that serves a photo manipulation user interface to a front-end user using Node.js and Express.js. 

This code is built on a programatic ImageEditor class instance, that handles front end interaction and performs image manipulations with context provided by an imagefile and HTML canvas. If no canvas is provided, it creates one internally. 

Currently in development.

### Installation
1. Install packages (with Node v20.15.1):
   ```bash
   npm ci
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
1. Finish interpolation types for resize module.
2. Get the plugins system to load into the handler on instantiation.
3. MASKS


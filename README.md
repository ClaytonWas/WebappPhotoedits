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
1. FILTERS
exposure - altering light that hits the image
contrast - difference of instensities between extreme
colour balance - white balancing, colour correction
colour grade - changing the brightness(luminance)/hue/saturation, for individual colours and/or entire image

2. MASKS
slectivley hide or show parts of a layer
spot healing - remove unwanted parts of image, the brush automatically selects pixel neighbours to replace unwanted ones

3. TRANSFORMS (NON LAYER MANIPULATIONS)
cropping 
rotation

4. Get the plugins system to load into the handler on instantiation.
# WebappPhotoedits
Photo manipulation software using javascript to mimic applications like photoshop and photopea.
Provding filter and image transformations.


# Current Stage (Prototype)
A Python application that allows users to convert images to greyscale and equalizations.

- Loads images in JPG, JPEG, PNG, BMP.
- Display original and processed images alongside their histograms.
- Scale and export images.

## Requirements

To run this application, you'll need Python and the following packages:

- PySimpleGUI
- Pillow
- numpy
- opencv-python
- matplotlib
- Tkinter

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/image-grayscale-equalization.git
   cd image-grayscale-equalization
   ```

2. Install the required packages:
   ```bash
    pip install -r requirements.txt
   ```

3. (Optional) Make sure Tkinter is installed:
   - **Windows**: Typically included with Python.
   - **Ubuntu**:
     ```bash
        sudo apt-get install python3-tk
     ```
    - **AlmaLinux**:
        ```bash
            sudo dnf install python3 python3-pip python3-tkinter
        ```
        ```bash
            pip3 install -r requirements.txt
        ```
## Usage

1. Run the application:
   ```bash
   python sIE.py
   ```
   To pass with an image attached:
   ```bash
   python sIE.py image_name.extension
   ```

2. Use the **Load Image** button to select an image file.
![Select File Image](SelectFile.jpg)
3. Program includes the following functionalities:
   - **Switch Image**: Toggle between the original and grayscale images.
   ![Greyscale Panel Image](ExportGreyscale.png)
   - **Switch Histogram**: Toggle between the original and adjusted histograms.
   ![Equalized Panel Image](RosesEqualized.png)
   - **Save as ...**: Save the current displayed image.
   ![Save As](SaveAs.png)

## Acknowledgments

- [Faisal Z. Qureshi](http://vclab.science.uoit.ca/)
[^](https://csundergrad.science.uoit.ca/courses/csci3240u/labs/lab2-image-enhancement/image_viewer.py)
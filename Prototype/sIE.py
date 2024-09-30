# Modified version of code from:
# Faisal Z. Qureshi
# www.vclab.ca

import argparse
import PySimpleGUI as sg
from PIL import Image
from io import BytesIO
import numpy as np
import cv2
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('TkAgg')
tkcanvas = None
canvasWidth = 640

def get_float_input(input_scale):
    layout = [
        [sg.Text(input_scale)],
        [sg.InputText(key='-INPUT-')],
        [sg.Button('OK'), sg.Button('Cancel')]
    ]

    window = sg.Window('Input', layout)

    while True:
        event, values = window.read()
        if event == sg.WINDOW_CLOSED or event == 'Cancel':
            window.close()
            return None
        if event == 'OK':
            try:
                input_scale = values['-INPUT-'].strip()
                if input_scale == '':
                    window.close()
                    return 1
                window.close()
                return float(input_scale)
            except ValueError:
                sg.popup_error('Invalid input. Please enter a valid integer.')

def np_im_to_data(im):
    array = np.array(im, dtype=np.uint8)
    im = Image.fromarray(array)
    with BytesIO() as output:
        im.save(output, format='PNG')
        data = output.getvalue()
    return data

def construct_image_histogram(image):
    L = 256
    bins = np.arange(L+1)
    hist, _ = np.histogram(image, bins)
    return hist

def draw_hist(canvas, figure): 
    global tkcanvas
    if tkcanvas is not None:
        tkcanvas.get_tk_widget().destroy()

    tkcanvas = FigureCanvasTkAgg(figure, canvas)
    tkcanvas.draw()
    tkcanvas.get_tk_widget().pack(side='top', fill='both', expand=1)

def hist_equalization(image):
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        h, s, v = cv2.split(image)

        hist = construct_image_histogram(v)
        pdf = hist / np.sum(hist)
        cdf = np.cumsum(pdf)

        adjustment_curve = (cdf*255)
        adjusted_v = adjustment_curve[v].astype(np.uint8)
        image[:,:,2] = adjusted_v
        adjusted_image = cv2.cvtColor(image, cv2.COLOR_HSV2RGB)


    elif len(image.shape) == 2:
        hist = construct_image_histogram(image)
        pdf = hist / np.sum(hist)
        cdf = np.cumsum(pdf)
        
        adjustment_curve = cdf*255
        adjusted_image = adjustment_curve[image].astype(np.uint8)


    adjusted_hist, bin_edges = np.histogram(adjusted_image, np.arange(257))


    return adjusted_hist, adjusted_image

def display_image(scaled_image, original_image):
    # Creating the grayscale image
    greyscale_image = cv2.cvtColor(scaled_image, cv2.COLOR_BGR2GRAY)

    # Convert numpy array to data that sg.Graph can understand
    image_data = np_im_to_data(scaled_image)
    greyscale_image_data = np_im_to_data(greyscale_image)
    
    height = scaled_image.shape[0]
    width = scaled_image.shape[1]

    greyscale_hist = construct_image_histogram(greyscale_image)
    greyscale_fig = plt.figure(figsize=(5,4),dpi=100)
    greyscale_fig.add_subplot(111).bar(np.arange(len(greyscale_hist)), greyscale_hist)
    plt.title('Histogram')

    hist = construct_image_histogram(scaled_image)
    fig = plt.figure(figsize=(5,4),dpi=100)
    fig.add_subplot(111).bar(np.arange(len(hist)), hist)
    plt.title('Histogram')

    greyscale_hist = construct_image_histogram(greyscale_image)
    greyscale_adjusted_hist, greyscale_adjusted_image = hist_equalization(greyscale_image)
    greyscale_adjusted_image_data = np_im_to_data(greyscale_adjusted_image)
    greyscale_adjusted_hist_fig = plt.figure(figsize=(5,4),dpi=100)
    plt.title('Histogram Equalization')
    plt.xlabel('Intensities')
    plt.ylabel('Counts')
    plt.bar(np.arange(256), greyscale_hist, label='original')
    plt.bar(np.arange(256), greyscale_adjusted_hist, label='adjusted')
    plt.legend()

    hist = construct_image_histogram(scaled_image)
    adjusted_hist, adjusted_image = hist_equalization(scaled_image)
    adjusted_image_data = np_im_to_data(adjusted_image)
    adjusted_hist_fig = plt.figure(figsize=(5,4),dpi=100)
    plt.title('Histogram Equalization')
    plt.xlabel('Intensities')
    plt.ylabel('Counts')
    plt.bar(np.arange(256), hist, label='original')
    plt.bar(np.arange(256), adjusted_hist, label='adjusted')
    plt.legend()

    # Define the layouts
    layout = [
        [
            sg.Graph(
                canvas_size=(width, height),
                graph_bottom_left=(0, 0),
                graph_top_right=(width, height),
                key='-IMAGE-',
                background_color='white',
                change_submits=True,
                drag_submits=True),
            sg.Canvas(
                key='-HIST-')
        ],
        [sg.Button('Switch Histogram'), sg.Button('Switch Image'), sg.Button('Save as ...'), sg.Button('Load new image ...'), sg.Button('Exit')]
    ]

    # Create the window
    window = sg.Window('Display Image', layout, finalize=True)    
    window['-IMAGE-'].draw_image(data=image_data, location=(0, height))
    draw_hist(window['-HIST-'].TKCanvas, fig)

    current_image_data = image_data
    colorBoolean = True
    equalizeBoolean = False
    # Event loop
    while True:
        event, values = window.read()
        if event == sg.WINDOW_CLOSED or event == 'Exit':
            break
        if event == 'Switch Image':
            equalizeBoolean = False
            if colorBoolean:
                window['-IMAGE-'].draw_image(data=greyscale_image_data, location=(0, height))
                draw_hist(window['-HIST-'].TKCanvas, greyscale_fig)
                colorBoolean = False
            else:
                window['-IMAGE-'].draw_image(data=image_data, location=(0, height))
                draw_hist(window['-HIST-'].TKCanvas, fig)
                colorBoolean = True
        if event == 'Switch Histogram':
            if colorBoolean:
                if equalizeBoolean:
                    window['-IMAGE-'].draw_image(data=image_data, location=(0, height))
                    draw_hist(window['-HIST-'].TKCanvas, fig)
                    equalizeBoolean = False
                else:
                    window['-IMAGE-'].draw_image(data=adjusted_image_data, location=(0, height))
                    draw_hist(window['-HIST-'].TKCanvas, adjusted_hist_fig)
                    equalizeBoolean = True
            else:
                if equalizeBoolean:
                    window['-IMAGE-'].draw_image(data=greyscale_image_data, location=(0, height))
                    draw_hist(window['-HIST-'].TKCanvas, greyscale_fig)
                    equalizeBoolean = False
                else:
                    window['-IMAGE-'].draw_image(data=greyscale_adjusted_image_data, location=(0, height))
                    draw_hist(window['-HIST-'].TKCanvas, greyscale_adjusted_hist_fig)
                    equalizeBoolean = True
        if event == 'Save as ...':
            scale_factor = 0
            scale_factor = get_float_input("Rescaling Factor: ")
            if scale_factor is not None:                        
                # Linking the original image to the relationships made in the virtual canvas.
                actual_height, actual_width, channels = original_image.shape
                desired_height = int(actual_height * scale_factor)
                
                desired_width = int(actual_width*scale_factor)

        
                
                final_resolution_image = cv2.resize(original_image, (desired_width, desired_height), cv2.INTER_LINEAR)
                
                save_filename = sg.popup_get_file('Save As', save_as=True, no_window=True, default_extension='.png', file_types=(("PNG Files", "*.png"), ("All Files", "*.*")))
                if save_filename:
                    with open(save_filename, 'wb') as f:
                            # These are conditional statements to check what the state of the image is on the users screen.
                            # This will help determine what effects need to be applied to the newly created images.
                            # We are modifying final_resolution_image using the Boolean tags from button calls.
                            if colorBoolean and not equalizeBoolean:
                                #Regular Case
                                f.write(np_im_to_data(final_resolution_image))
                            elif colorBoolean and equalizeBoolean:
                                #Equalization Case
                                adjusted_hist, adjusted_image = hist_equalization(final_resolution_image)
                                f.write(np_im_to_data(adjusted_image))
                            elif not colorBoolean and not equalizeBoolean:
                                #Grayscale Case
                                greyscale_image = cv2.cvtColor(final_resolution_image, cv2.COLOR_RGB2GRAY)
                                f.write(np_im_to_data(greyscale_image))
                            elif not colorBoolean and equalizeBoolean:
                                #Greyscale Equalization Case
                                greyscale_image = cv2.cvtColor(final_resolution_image, cv2.COLOR_RGB2GRAY)
                                adjusted_hist, adjusted_image = hist_equalization(greyscale_image)
                                f.write(np_im_to_data(adjusted_image))
                    sg.popup(f'Image saved as {save_filename}')
        if event == 'Load new image ...':     
            window.close()
            main()

    window.close()

def scale_image(image, desired_width):
    actual_height, actual_width, channels = image.shape
    scale_percentage = desired_width/actual_width
    desired_height = int(actual_height * scale_percentage)

    return cv2.resize(image, (desired_width, desired_height), interpolation=cv2.INTER_LINEAR)


def main():
    parser = argparse.ArgumentParser(description='A simple image viewer.')
    parser.add_argument('file', nargs='?', help='Image file path.')
    args = parser.parse_args()

    if args.file:
        file_path = args.file
    else:
        file_path = sg.popup_get_file('Select an Image File', 
                                       file_types=(('Image Files', '*.jpg'), 
                                                    ('Image Files', '*.jpeg'), 
                                                    ('Image Files', '*.png'), 
                                                    ('Image Files', '*.bmp'), 
                                                    ('All Files', '*.*')),
                                       default_extension='.jpg')

    if not file_path:
        sg.popup("No file selected. Exiting.")
        return

    print(f'Loading {file_path} ... ', end='')
    image = cv2.imread(file_path)
    
    if image is None:
        sg.popup("Failed to load image.")
        return

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    scaled_image = scale_image(image, canvasWidth)

    display_image(scaled_image, image)

if __name__ == '__main__':
    main()
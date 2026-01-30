import pytesseract
from PIL import Image
import io
from pdf2image import convert_from_bytes

def extract_text_from_image(file):
    image = Image.open(io.BytesIO(file.read()))
    return pytesseract.image_to_string(image)

def extract_text_from_pdf(file):
    images = convert_from_bytes(file.read())
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img) + "\n"
    return text

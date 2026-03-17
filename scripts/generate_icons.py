from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('icons', exist_ok=True)

# Draw a simple icon with a letter
# Supports fallback to default font when Arial not available.

def make_icon(path, size, color, text):
    img = Image.new('RGBA', (size, size), color)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('arial.ttf', size // 5)
    except Exception:
        font = ImageFont.load_default()
    # Pillow 11+ uses textbbox instead of textsize
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((size - w) / 2, (size - h) / 2), text, fill='white', font=font)
    img.save(path, format='PNG')

make_icon('icons/icon-192x192.png', 192, (20, 120, 210, 255), 'N')
make_icon('icons/icon-512x512.png', 512, (20, 120, 210, 255), 'N')
make_icon('icons/icon-192.png', 192, (20, 120, 210, 255), 'N')
print('icons regenerated')

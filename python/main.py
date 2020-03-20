import board
import busio
import adafruit_ssd1306

from PIL import Image, ImageDraw, ImageFont

i2c = busio.I2C(board.SCL, board.SDA);
oled = adafruit_ssd1306.SSD1306_I2C(128, 32, i2c, addr=0x3C);

# Load default font.
font = ImageFont.load_default()
 
# Draw Some Text
text = "Hello World!"
(font_width, font_height) = font.getsize(text)
draw.text(
    (oled.width // 2 - font_width // 2, oled.height // 2 - font_height // 2),
    text,
    font=font,
    fill=255,
)
oled.fill(0)
oled.show()
 
# Create blank image for drawing.
# Make sure to create image with mode '1' for 1-bit color.
image = Image.new("1", (oled.width, oled.height))
 
# Get drawing object to draw on image.
draw = ImageDraw.Draw(image)
import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import subprocess

RST = 0

disp = Adafruit_SSD1306.SSD1306_128_32(rst=RST, addr=0x3d)
disp.begin()
disp.clear()
disp.display()

width = disp.width
height = disp.height

image1 = Image.new('1', (width, height))
draw = ImageDraw.Draw(image1)

padding = -2
top = padding

bottom = height-padding
x = 0
font = ImageFont.load_default()

disp.clear()
disp.display()
draw.text((x, top),       "OLED Interfacing " ,  font=font, fill=255)
draw.text((x, top+8),     "Circuit Digest", font=font, fill=255)

disp.image(image1)
disp.display()
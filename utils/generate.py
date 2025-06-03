import os

### relative filepaths to images
photography_path = 'photography'
digital_art_path = 'digital_art'

path = digital_art_path


### imgs per row, repeated until all pictures are placed
repeat = [2, 1, 3, 3]


def getPath():
    return f'../pages/assets/images/{path}'

def getFileNames(path):
    filenames = []
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isfile(item_path):
            filenames.append(item)
    return filenames



def generateImgTag(filename, path):
    img = f'\t<img src="./assets/images/{path}/{filename}" alt="" onclick="myFoo(this)">'
    return img

filenames = getFileNames(getPath())

filenames.sort()


index = 0
repeatIndex = 0

while (index < len(filenames)):
    offset = 0
    print('<div class="row">')
    for i in range(repeat[repeatIndex]):
        if (index + i) < len(filenames):
            print(generateImgTag(filenames[index + i], path))
            offset = i + 1
    print('</div>')
    index+=offset
    repeatIndex = (repeatIndex + 1) % len(repeat)
import requests
from bs4 import BeautifulSoup
import shutil
import json
import os


URL = 'https://www.ft.dk/da/medlemmer/regeringen'
page = requests.get(URL, verify=False)

soup = BeautifulSoup(page.content, 'html.parser')

ministers = {}

for img in soup.find_all(class_='bio-image'):
    minister = img.parent.next_sibling.next_sibling.text.split('\n')[1].strip()
    src = str(img.get('src'))
    name = str(img.get('alt'))
    filename = name.lower().replace(' ', '_') + '.jpg'
    ministers[minister] = {'name': name, 'photo': filename}

    # Download photos
    file_path = 'photos/'+filename
    if os.path.exists(file_path):
        continue
    print(filename, src)
    r = requests.get(src, stream=True, verify=False)
    if r.status_code == 200:
        with open(file_path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)

with open('ministers.json', 'w') as f:
    json.dump(ministers, f, indent=2)

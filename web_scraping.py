import requests
from bs4 import BeautifulSoup
import shutil
import json
import os


def download_photo(file_path, url):
    r = requests.get(url, stream=True, verify=False)
    if r.status_code == 200:
        with open(file_path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)


def scrape_ministers():
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
        download_photo(file_path, src)

    with open('ministers.json', 'w') as f:
        json.dump(ministers, f, indent=2)


def scrape_party_leaders():
    URL = 'https://www.ft.dk/da/folkestyret/folketinget/hvem-er-hvad-i-folketinget'
    page = requests.get(URL, verify=False)
    soup = BeautifulSoup(page.content, 'html.parser')

    parties = {}

    read_more_boxes = list(soup.find_all('div', class_='read-more'))
    party_leaders = read_more_boxes[2].p.children
    for leader in party_leaders:
        leader_name = str(leader.text).strip()
        try:
            leader_url = leader['href']
        except (TypeError, KeyError):
            continue
        page = requests.get(leader_url, verify=False)
        soup = BeautifulSoup(page.content, 'html.parser')
        img_src = soup.find(class_='bio-image').get('src')
        party_name = soup.find(class_='person__container__functionparty').text.split(', ')[1].strip()
        filename = leader_name.lower().replace(' ', '_') + '.jpg'
        parties[party_name] = {'name': leader_name, 'photo': filename}

        file_path = 'photos/' + filename
        if os.path.exists(file_path):
            continue
        print(filename, img_src)
        download_photo(file_path, img_src)

    with open('party_leaders.json', 'w') as f:
        json.dump(parties, f, indent=2)


scrape_ministers()
scrape_party_leaders()

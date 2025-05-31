import os
import requests
from pycountry import countries

# Base GitHub raw URL for mapsicon SVGs
base_url = "https://raw.githubusercontent.com/djaiss/mapsicon/master/all/"

# Output folder
output_folder = "country_maps"
os.makedirs(output_folder, exist_ok=True)

# Download SVGs
for country in countries:
    iso2 = country.alpha_2.lower()
    name = country.name.replace(" ", "_")
    url = f"{base_url}{iso2}/vector.svg"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            with open(os.path.join(output_folder, f"{name}.svg"), "wb") as f:
                f.write(response.content)
            print(f"Downloaded: {name}.svg")
        else:
            print(f"Not found: {name} ({iso2})")
    except Exception as e:
        print(f"Error downloading {name}: {e}")

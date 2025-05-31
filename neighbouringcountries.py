import json
import geopandas as gpd
import matplotlib.pyplot as plt
import os
import random

# Load world map data
world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
world = world[world.name != "Antarctica"]  # Remove Antarctica

# Create directory for images
output_dir = "neighbours_quiz_maps"
os.makedirs(output_dir, exist_ok=True)

# Create a dict of country to geometry
country_geometries = {row["name"]: row["geometry"] for _, row in world.iterrows()}

def get_neighbors(country_name, geom):
    return [
        other_name for other_name, other_geom in country_geometries.items()
        if other_name != country_name and geom.touches(other_geom)
    ]

quiz_data = []

for _, row in world.iterrows():
    country = row["name"]
    geom = row["geometry"]
    neighbors = get_neighbors(country, geom)
    
    if not neighbors:
        continue
    
    correct = random.choice(neighbors)
    others = [c for c in world["name"] if c not in neighbors and c != country]
    options = random.sample(others, 3) + [correct]
    random.shuffle(options)

    # Plot map
    fig, ax = plt.subplots(figsize=(6, 4))
    world.plot(ax=ax, color="lightgrey")
    world[world["name"] == country].plot(ax=ax, color="red")
    ax.axis("off")

    image_filename = f"{country}.png"
    image_path = os.path.join(output_dir, image_filename)
    plt.savefig(image_path, bbox_inches='tight', pad_inches=0)
    plt.close()

    quiz_data.append({
        "image": f"../images/{image_filename}",
        "question": f"Which country borders {country}?",
        "options": options,
        "answer": correct
    })

# Save JSON
with open("neighbors_quiz.json", "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2)

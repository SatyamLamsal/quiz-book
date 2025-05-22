import pycountry
import json
import random

countries = list(pycountry.countries)

def generate_options(correct_country, all_countries, num_options=4):
    # Start with the correct answer
    options = [correct_country.name]
    # Get other countries except the correct one
    others = [c.name for c in all_countries if c.name != correct_country.name]
    # Randomly pick (num_options-1) distractors
    distractors = random.sample(others, num_options - 1)
    options.extend(distractors)
    random.shuffle(options)
    return options

quiz_data = []

for country in countries:
    image_path = f"../images/{country.name.replace(' ', '_')}.png"
    options = generate_options(country, countries)
    entry = {
        "image": image_path,
        "options": options,
        "answer": country.name
    }
    quiz_data.append(entry)

# Save to JSON file
with open("quiz_all_countries.json", "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print(f"Generated quiz for {len(quiz_data)} countries.")

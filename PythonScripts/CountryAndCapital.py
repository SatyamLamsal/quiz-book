import random
import json
import pycountry
import requests

# Load country-capital data from REST Countries API
url = "https://restcountries.com/v3.1/all"
response = requests.get(url)
data = response.json()

quiz_data = []

# Build a dictionary: country -> capital
country_capital = {}
for item in data:
    try:
        country_name = item['name']['common']
        capital = item['capital'][0]  # first capital
        country_capital[country_name] = capital
    except:
        continue  # skip if no capital

# Create quiz questions
for country, capital in country_capital.items():
    options = [capital]
    # Pick 3 wrong options
    other_capitals = list(country_capital.values())
    other_capitals.remove(capital)
    options += random.sample(other_capitals, 3)
    random.shuffle(options)
    
    question = {
        "question": f"What is the capital of {country}?",
        "options": options,
        "answer": capital
    }
    quiz_data.append(question)

# Save to JSON
with open("guess_capital_data.json", "w", encoding='utf-8') as f:
    json.dump(quiz_data, f, ensure_ascii=False, indent=2)

print("Capital city quiz data saved to 'guess_capital_data.json'")

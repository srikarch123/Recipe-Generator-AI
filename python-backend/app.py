from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

app = Flask(__name__)
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)

recipe_prompt = PromptTemplate.from_template("You are a chef. Write me a recipe using {ingredients} with a {cuisine} flair.")

@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    ingredients = data.get("ingredients", [])
    cuisine = data.get("cuisine", "general")

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    input_data = {
        "ingredients": ", ".join(ingredients),
        "cuisine": cuisine
    }

    try:
        resp = recipe_prompt | llm
        result = resp.invoke(input_data)
        return jsonify({"recipe": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

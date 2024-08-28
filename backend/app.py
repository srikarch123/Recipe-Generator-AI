# pip install -r requirements.txt to install requirements
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

app = Flask(__name__)
CORS(app)
load_dotenv()

# Load the Google API key from the .env file
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Ensure the API key is loaded
if not GOOGLE_API_KEY:
    raise ValueError("No Google API key found. Please set it in the .env file.")


# Initialize the Google Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    try:
        data = request.json
        print(f"Received data: {data}")
        ingredients = data.get('ingredients', [])
        cuisine = data.get('cuisine', 'Indian')
        course_type = data.get('course_type', 'maincourse')

        if not ingredients:
            return jsonify({"error": "No ingredients provided"}), 400

        recipe_prompt = PromptTemplate.from_template(
            """You are a chef specializing in {cuisine} cuisine. Using your culinary expertise, create the best possible {course_type} recipe from the following ingredients: {ingredients}.
            Use only the ingredients that make sense for the recipe, and feel free to omit any ingredients that aren't suitable. The recipe should be structured as follows:

            1. **Title:** Provide a creative and fitting title for the recipe.
            2. **Recipe Ingredients:** List the ingredients you chose to use, each on a new line, starting with an asterisk (*).
            3. **Instructions:** Number the steps (1., 2., 3., etc.) and clearly describe each step on a new line.
            4. **Tips:** List any additional tips, each starting with an asterisk (*).

            Please ensure the format is exactly as described above and use your judgment to create a delicious and practical dish."""
        )

        input_data = {
            "ingredients": ", ".join(ingredients),
            "cuisine": cuisine,
            "course_type": course_type
        }

        # Format the prompt with input data
        formatted_prompt = recipe_prompt.format(**input_data)

        # Generate the recipe using the LLM with the correct invocation method
        recipe_response = llm.invoke(formatted_prompt)
        recipe_content = recipe_response.content  # Access the content property directly
        
        print(f"Generated recipe: {recipe_content}")
        return jsonify({"recipe": recipe_content}), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)

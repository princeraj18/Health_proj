from dotenv import load_dotenv
load_dotenv()   # MUST be first
from flask_cors import CORS


from flask import Flask, render_template, request, jsonify
import os
from google import genai

from src.prompts import *
from src.ocr_utils import extract_text_from_image, extract_text_from_pdf
from src.pinecone_utils import search_context

app = Flask(__name__)
CORS(app, origins=["http://localhost:8000"])

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
MODEL_NAME = "models/gemini-flash-latest"


@app.route("/")
def index():
    return render_template("chat.html")


@app.route("/api/report", methods=["POST"])
def report_api():
    file = request.files.get("report")
    if not file:
        return jsonify({"answer": "Upload a medical report."})

    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file)
    else:
        text = extract_text_from_image(file)

    if not text.strip():
        return jsonify({"answer": "Could not read report."})

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=REPORT_PROMPT + text[:12000]
    )

    return jsonify({"answer": response.text})


@app.route("/api/nutrition", methods=["POST"])
def nutrition_api():
    data = request.get_json() or request.form

    age = data.get("age")
    gender = data.get("gender")
    weight = data.get("weight")
    height = data.get("height")
    activity = data.get("activity")
    conditions = data.get("conditions", "none")

    if not all([age, gender, weight, height, activity]):
        return jsonify({
            "answer": "Please provide age, gender, weight, height, and activity level."
        })

    # Optional RAG context (kept light)
    context = search_context(f"{conditions} diet")[:500]

    nutrition_prompt = f"""
You are a friendly nutrition coach.

Explain everything in **simple and easy words**.
Keep the answer **short, clear, and under 200 words**.
Avoid medical terms, tables, and long explanations.

User details:
Age: {age}
Gender: {gender}
Weight: {weight} kg
Height: {height} cm
Activity level: {activity}
Health condition: {conditions}

Give:
- Daily calories (1 line)
- Foods to eat (bullet points)
- Foods to avoid (bullet points)
- Simple one-day meal example
- One short safety note

Rules:
- Use plain English
- Use bullet points
- Sound like a helpful human
- No medical diagnosis
- Keep it short
- Answer under 200 words strictly

Helpful context (if useful):
{context}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=nutrition_prompt
    )

    return jsonify({"answer": response.text})


@app.route("/api/medicine", methods=["POST"])
def medicine_api():
    image = request.files.get("medicine_image")

    if not image:
        return jsonify({"answer": "Please upload a medicine image."})

    # OCR from image
    text = extract_text_from_image(image)

    medicine_prompt = f"""
You are a medical assistant.

Task:
1. First decide if the image is related to a medicine.
2. If NOT a medicine image, reply exactly:
   "Wrong image. Please upload a medicine image."

If it IS a medicine image, explain in simple words:
- What the medicine is used for
- How to take it safely
- Common precautions
- Possible side effects

Rules:
- Simple English
- Bullet points
- No medical diagnosis
- Short and clear
- Do NOT guess if unclear

Extracted text from image:
{text[:4000]}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=medicine_prompt
    )

    return jsonify({"answer": response.text})



@app.route("/api/disease", methods=["POST"])
def disease_api():
    msg = request.form.get("msg", "")
    context = search_context(msg)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=DISEASE_PROMPT + context + msg
    )

    return jsonify({"answer": response.text})


if __name__ == "__main__":
    app.run(debug=True, port=8080)

from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

app = Flask(__name__)

# Allow requests from localhost:5174 (your frontend) explicitly
CORS(app, origins="http://localhost:5174")  # You can add other domains here if needed

# Load the scaler and model
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("knn_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/")
def home():
    return "Welcome to the Heart Disease Prediction API"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        features = [
            data["age"], data["sex"], data["cp"], data["trestbps"],
            data["chol"], data["fbs"], data["restecg"], data["thalach"],
            data["exang"], data["oldpeak"], data["slope"], data["ca"],
            data["thal"]
        ]

        features_np = np.array([features])
        features_scaled = scaler.transform(features_np)

        distances, indices = model.kneighbors(features_scaled)
        neighbor_labels = model._y[indices[0]]

        vote_counts = np.bincount(neighbor_labels)
        total_votes = np.sum(vote_counts)

        prediction = int(np.argmax(vote_counts))
        confidence = round((vote_counts[prediction] / total_votes) * 100, 2) if total_votes > 0 else 0

        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "voteCounts": {
                "0": int(vote_counts[0]) if len(vote_counts) > 0 else 0,
                "1": int(vote_counts[1]) if len(vote_counts) > 1 else 0
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

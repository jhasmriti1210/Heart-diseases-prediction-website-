from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Load the scaler and model
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("knn_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract feature values in correct order
        features = [
            data["age"], data["sex"], data["cp"], data["trestbps"],
            data["chol"], data["fbs"], data["restecg"], data["thalach"],
            data["exang"], data["oldpeak"], data["slope"], data["ca"],
            data["thal"]
        ]

        features_np = np.array([features])  # Shape (1, 13)
        features_scaled = scaler.transform(features_np)

        # Get distances and indices of k nearest neighbors
        distances, indices = model.kneighbors(features_scaled)

        # Get labels of the k nearest neighbors
        neighbor_labels = model._y[indices[0]]  # Use model._y to access training labels

        # Count votes
        vote_counts = np.bincount(neighbor_labels)
        total_votes = np.sum(vote_counts)

        # Final prediction and confidence
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

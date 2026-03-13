"""
app.py
------
Flask microservice — Hospital Suitability Ranking (ML Service)
Port: 5002

Endpoint
--------
POST /predict_rank
  Body  : JSON array of hospital objects
  Return: ranked JSON array (most suitable first)

Example request body
--------------------
[
  {
    "id": "H1",
    "name": "City General Hospital",
    "distance_km": 3.2,
    "capacity": 250,
    "emergency_support": 1,
    "wait_time_min": 15,
    "rating": 4.5
  },
  {
    "id": "H2",
    "name": "Sunrise Clinic",
    "distance_km": 1.0,
    "capacity": 40,
    "emergency_support": 0,
    "wait_time_min": 45,
    "rating": 3.8
  }
]
"""

from flask import Flask, request, jsonify
from model import predict_scores

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    """Simple liveness probe."""
    return jsonify({"status": "ok", "service": "ml_service", "port": 5002})


# ---------------------------------------------------------------------------
# Main prediction endpoint
# ---------------------------------------------------------------------------

@app.route("/predict_rank", methods=["POST"])
def predict_rank():
    """
    Accept a JSON list of hospitals, score each one with the XGBoost model,
    and return them sorted by ascending suitability_score (most suitable first).

    Required field per hospital:
      - distance_km (float)

    Optional fields (defaults applied if missing):
      - capacity          (int,   default 100)
      - emergency_support (0|1,   default 1)
      - wait_time_min     (float, default 30.0)
      - rating            (float, default 3.5)
      - id                (any,   passed through)
      - name              (str,   passed through)
    """
    data = request.get_json(silent=True)

    # --- Input validation ---------------------------------------------------
    if data is None:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    if not isinstance(data, list):
        return jsonify({"error": "Expected a JSON array of hospital objects."}), 400

    if len(data) == 0:
        return jsonify({"error": "Hospital list is empty."}), 400

    for i, hospital in enumerate(data):
        if not isinstance(hospital, dict):
            return jsonify({"error": f"Item at index {i} is not an object."}), 400
        if "distance_km" not in hospital:
            return jsonify(
                {"error": f"Item at index {i} is missing required field 'distance_km'."}
            ), 400
        try:
            float(hospital["distance_km"])
        except (TypeError, ValueError):
            return jsonify(
                {"error": f"'distance_km' at index {i} must be a number."}
            ), 400

    # --- Score & rank -------------------------------------------------------
    try:
        scores = predict_scores(data)
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Model inference failed: {str(exc)}"}), 500

    # Attach scores to each hospital dict (non-destructive copy)
    ranked = []
    for hospital, score in zip(data, scores):
        entry = dict(hospital)          # shallow copy — original untouched
        entry["suitability_score"] = round(float(score), 6)
        ranked.append(entry)

    # Sort ascending: lower score = more suitable
    ranked.sort(key=lambda h: h["suitability_score"])

    # Add rank field for convenience
    for rank_idx, entry in enumerate(ranked, start=1):
        entry["rank"] = rank_idx

    return jsonify({
        "ranked_hospitals": ranked,
        "total": len(ranked),
        "note": "Hospitals sorted by suitability_score (lower = more suitable).",
    })


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)

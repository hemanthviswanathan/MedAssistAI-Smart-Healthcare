"""
model.py
--------
Builds and caches a lightweight XGBoost regression model in memory.

The model is intentionally 'dummy': it is trained on synthetic data that
encodes a simple heuristic — lower distance and higher capacity lead to a
better (lower) suitability score, which the API then sorts on.

In a real system you would replace `_build_model()` with a call that loads
a pre-trained model from disk / a model registry.
"""

import numpy as np
import xgboost as xgb
from sklearn.preprocessing import MinMaxScaler

# ---------------------------------------------------------------------------
# Feature schema (must match the feature extraction in app.py)
# ---------------------------------------------------------------------------
# [distance_km, capacity, emergency_support, wait_time_min, rating]
FEATURE_NAMES = ["distance_km", "capacity", "emergency_support", "wait_time_min", "rating"]

# Module-level singletons
_model: xgb.XGBRegressor | None = None
_scaler: MinMaxScaler | None = None


def _build_model() -> tuple[xgb.XGBRegressor, MinMaxScaler]:
    """
    Create a synthetic training dataset and fit an XGBRegressor on it.

    The target 'suitability_score' is a composite metric where:
      - Lower distance      → lower score (better)
      - Higher capacity     → lower score (better)
      - Emergency support   → lower score (better)
      - Lower wait time     → lower score (better)
      - Higher rating       → lower score (better)

    We deliberately keep the relationship linear + noise so the model
    learns a monotone heuristic — clean enough to demo, realistic enough
    to be useful.
    """
    rng = np.random.default_rng(seed=42)

    n_samples = 2000

    distance_km       = rng.uniform(0.5, 50.0, n_samples)
    capacity          = rng.integers(10, 500, n_samples).astype(float)
    emergency_support = rng.choice([0.0, 1.0], n_samples, p=[0.3, 0.7])
    wait_time_min     = rng.uniform(5.0, 120.0, n_samples)
    rating            = rng.uniform(1.0, 5.0, n_samples)

    # Composite score (higher = less suitable)
    suitability_score = (
        0.40 * distance_km / 50.0        # distance penalty
        + 0.20 * (1 - capacity / 500.0)  # low-capacity penalty
        + 0.15 * (1 - emergency_support)  # no-emergency penalty
        + 0.15 * wait_time_min / 120.0   # wait-time penalty
        + 0.10 * (1 - rating / 5.0)      # low-rating penalty
        + rng.normal(0, 0.02, n_samples) # small noise
    )
    suitability_score = np.clip(suitability_score, 0.0, 1.0)

    X = np.column_stack([distance_km, capacity, emergency_support, wait_time_min, rating])

    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)

    model = xgb.XGBRegressor(
        n_estimators=150,
        max_depth=4,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0,
    )
    model.fit(X_scaled, suitability_score)

    return model, scaler


def get_model() -> tuple[xgb.XGBRegressor, MinMaxScaler]:
    """Return the cached (model, scaler) pair, building it on first call."""
    global _model, _scaler
    if _model is None:
        print("[ml_service] Building dummy XGBoost model in memory …")
        _model, _scaler = _build_model()
        print("[ml_service] Model ready.")
    return _model, _scaler


def predict_scores(hospitals: list[dict]) -> list[float]:
    """
    Given a list of hospital dicts, return a parallel list of suitability
    scores (lower = more suitable).

    Expected keys per hospital (missing keys fall back to sensible defaults):
      - distance_km       (float, required)
      - capacity          (int)
      - emergency_support (0 or 1)
      - wait_time_min     (float)
      - rating            (float 1-5)
    """
    model, scaler = get_model()

    rows = []
    for h in hospitals:
        row = [
            float(h.get("distance_km", 10.0)),
            float(h.get("capacity", 100)),
            float(h.get("emergency_support", 1)),
            float(h.get("wait_time_min", 30.0)),
            float(h.get("rating", 3.5)),
        ]
        rows.append(row)

    X = np.array(rows, dtype=np.float32)
    X_scaled = scaler.transform(X)
    scores = model.predict(X_scaled).tolist()
    return scores

import sys
import pickle
import numpy as np
import os
import tensorflow as tf
from sklearn.feature_extraction.text import CountVectorizer
import h5py

def detect_sql_injection(request):

    model_path = os.path.join(os.path.dirname(__file__), 'sql_injection_model.h5')
    print(f"Model path: {model_path}")

    with h5py.File(model_path , 'r') as f:
        print(f.keys())

    with open(model_path, 'rb') as f:
        model = tf.keras.models.load_model(f)

    vectorizer = CountVectorizer()
    request_vector = vectorizer.transform(np.array([request]))

    prediction = model.predict(request_vector)

    return prediction[0]

if __name__ == "__main__":
    request = sys.argv[1]

    print("request:", request)

    result = detect_sql_injection(request)

    print(result)
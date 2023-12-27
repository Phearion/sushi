import sys
import pickle
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer

def detect_sql_injection(model_path, request):
    with open(model_path, 'rb') as file:
        model = pickle.load(file)

    vectorizer = CountVectorizer()
    request_vector = vectorizer.transform(np.array([request]))

    prediction = model.predict(request_vector)

    return prediction[0]

if __name__ == "__main__":
    model_path = sys.argv[1]
    request = sys.argv[2]

    result = detect_sql_injection(model_path, request)

    print(result)
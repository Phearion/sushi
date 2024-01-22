import sys
import pickle
import numpy as np
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from sklearn.feature_extraction.text import CountVectorizer
import h5py
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras import backend as K

def detect_sql_injection(request):
    print(request)

    model_path = os.path.join(os.path.dirname(__file__), 'sql_injection_model.h5')
    tokenizer_path = os.path.join(os.path.dirname(__file__), 'tokenizer.pickle')
    #print(f"Model path: {model_path}")

    model = tf.keras.models.load_model(model_path)

    stemmer = PorterStemmer()
    with open(tokenizer_path, 'rb') as handle:
        tokenizer = pickle.load(handle)

    nltk.download('stopwords')

    # Preprocess the request
    request = request.lower()
    tokens = request.split()
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    tokens = [stemmer.stem(word) for word in tokens]
    processed_request = ' '.join(tokens)

    # Convert the preprocessed request into sequences of tokens
    sequences = tokenizer.texts_to_sequences([processed_request])
    padded_request = pad_sequences(sequences, maxlen=50)

    # Use the model to make a prediction
    prediction = model.predict(padded_request)

    return prediction[0]

if __name__ == "__main__":
    request = sys.argv[1]

    result = detect_sql_injection(request)

    # prediction
    if (result > 0.5):
        statement = 'SQL injection attack'
    else:
        statement = 'benign'

    print('Prediction:', result, 'La requête est', statement)

    K.clear_session()
import logging
from gradio_client import Client

def make_prediction(client, query):
    try:
        result = client.predict(query, api_name="/predict")
        print(result)
        return result
    except Exception as e:
        logging.error(f"An error occurred during prediction: {e}")
        return None


def main(query):
    logging.basicConfig(level=logging.INFO)
    client = Client("https://phanthive-phanthive-bigbrain.hf.space/--replicas/fjlpg/")
    result = make_prediction(client, query)
    if result is not None:
        print("Generated response:")
        print(result)

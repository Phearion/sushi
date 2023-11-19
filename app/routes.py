from flask import request, jsonify
from app import app
import app.bigbrain as bb

@app.route('/request', methods=['POST'])
def predict():
    print("request received")
    print(request)  # print the entire request object
    try:
        print("Getting JSON data from request")
        data = request.get_json(force=True)
        # get string data from the request
        data = data['data']
        print(data)  # print the JSON data
        bb_response = bb.main(data)
    except Exception as e:
        print("An error occurred:")
        print(e)  # print any exceptions that occur
        return jsonify({"error": str(e)}), 500
    return jsonify({"response": bb_response}), 200
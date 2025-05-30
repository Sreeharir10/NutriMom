import tempfile
import json
import yaml
import os
import re
import datetime
from inference_sdk import InferenceHTTPClient, InferenceConfiguration
from llm_chains import load_normal_chain  # Load your LLM processing function

# Load config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

# Initialize inference client
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="Xqu1B5tB0s3Di5Kpqi5N"
)

# Set confidence threshold for detection
custom_configuration = InferenceConfiguration(confidence_threshold=0.3, iou_threshold=0.5)

def process_image(image_bytes, user_data):
    """
    Process the uploaded image, run inference, and generate a single JSON response.

    Args:
        image_bytes (bytes): Image data received from frontend.
        user_data (dict): User details (age, weight, height, trimester, etc.).

    Returns:
        dict: JSON response with food details and personalized nutrition info.
    """

    try:
        # Save uploaded image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(image_bytes)
            temp_file_path = temp_file.name

        # Run inference with custom confidence threshold
        with CLIENT.use_configuration(custom_configuration):
            result = CLIENT.infer(temp_file_path, model_id="calorie-tracker-pmuck/4")

        # Extract detected food items
        predictions = result.get("predictions", [])
        print(predictions)

        if not predictions:
            return {"error": "No food detected in the image. Please try another image."}

        food_items = [{"name": pred["class"]} for pred in predictions]

        # Convert detected food list into LLM input format
        food_list_str = json.dumps(food_items)

        # 🟢 Ensure user data is passed correctly
        combined_data = json.dumps(user_data)  

        # Load LLM chain
        llm_chain = load_normal_chain()

        # Get LLM response (expects JSON)
        llm_response = llm_chain.run(food_list_str, combined_data)
        print("Raw LLM response:", llm_response)
        # raw_llm_response = ... (received from llm_chain.run(...))
        file_path = save_llm_response_to_file(llm_response, user_data)


        # Convert response to JSON
    

        return file_path


    except Exception as e:
        print(f"Error in process_image: {e}")
        return {"error": str(e)}
def save_llm_response_to_file(raw_llm_response, user_data) -> str:
    """
    Cleans and parses the LLM string response into JSON and saves it to file.

    Args:
        raw_llm_response (str): Raw string from LLM.
        user_data (str or dict): User metadata (dict or stringified JSON).

    Returns:
        str: Path to the saved JSON file.
    """
    try:
        # 🔹 Ensure user_data is a dict
        if isinstance(user_data, str):
            user_data = json.loads(user_data)

        # 🔹 Step 1: Clean and extract JSON from LLM response
        if isinstance(raw_llm_response, dict):
            nutrition_data = raw_llm_response
        else:
            cleaned = raw_llm_response.strip()
            cleaned = re.sub(r"^```json\s*|\s*```$", "", cleaned, flags=re.MULTILINE).strip()

            # Extract JSON block
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if not match:
                raise ValueError("Could not extract JSON object from LLM response.")

            json_str = match.group(0)
            nutrition_data = json.loads(json_str)

        # 🔹 Step 2: Generate timestamped filename
        output_dir = "nutrition_reports"
        os.makedirs(output_dir, exist_ok=True)

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        age = user_data.get("age", "NA")
        weight = user_data.get("weight", "NA")
        trimester = user_data.get("trimester", "NA")
        filename = f"report_{timestamp}_{age}_{weight}_{trimester}.json"
        output_path = os.path.join(output_dir, filename)

        # 🔹 Step 3: Save to JSON
        with open(output_path, "w") as f:
            json.dump(nutrition_data, f, indent=2)

        print(f"✅ Saved to {output_path}")
        return output_path

    except Exception as e:
        print(f"❌ Error saving LLM response: {e}")
        return ""
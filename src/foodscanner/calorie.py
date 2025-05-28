import tempfile
import json
import yaml
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

        # Convert response to JSON
        try:
            nutrition_data = json.loads(llm_response)
        except json.JSONDecodeError:
            return {"error": "Failed to parse LLM response."}

        print("Processing completed. Nutrition data:", nutrition_data)

        # 🟢 Final structured response (SINGLE REPORT)
        final_report = {
            "success": True,
            "message": "Nutrition analysis completed successfully.",
            "personalized_nutrition_report": {
                "detected_food": food_items,
                "nutrition_info": nutrition_data,
                "user_profile": user_data
            }
        }

        return final_report

    except Exception as e:
        print(f"Error in process_image: {e}")
        return {"error": str(e)}
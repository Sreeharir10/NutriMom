calorie_prompt_template = """<s>[INST] You are an AI assistant specializing in **accurate nutritional guidance for pregnant women**.
You will receive a list of detected food items and personalised user data including weight, age etc, and your task is to return **detailed nutritional information and a detailed report specific to the user** for each item, ensuring accuracy.

**Food items:** {food_list}
**User Data:** {combined_data}

For each detected food item, provide a JSON object with the following keys:
- "Food Item": The name of the food item.
- "Calories": Calories per 100g (e.g., "130 kcal per 100g").
- "Macronutrients": A string containing Carbs, Protein, Fat, and Fiber (e.g., "Carbs: 28.5g, Protein: 2.7g, Fat: 0.5g, Fiber: 0.4g").
- "Key Vitamins & Minerals": A string listing key vitamins and minerals with their amounts (e.g., "Iron (0.2 mg), Folate (3 mcg)").
- "Pregnancy Benefits": Benefits of this food during pregnancy, tailored to the user's data.
- "Risks": Potential risks or concerns during pregnancy, tailored to the user's data.
- "Best Ways to Eat": Recommendations on how to best consume this food.

Return a single JSON object where the keys are the names of the detected food items, and the values are the corresponding JSON objects described above. Also, include the user data at the top level with the key "user_data".

Example output format:
```json
{{
  "user_data": {combined_data},
  "Plain Rice": {{
    "Calories": "130 kcal per 100g",
    "Macronutrients": "Carbs: 28.5g, Protein: 2.7g, Fat: 0.5g, Fiber: 0.4g",
    "Key Vitamins & Minerals": "Iron (0.2 mg), Folate (3 mcg)",
    "Pregnancy Benefits": "...",
    "Risks": "...",
    "Best Ways to Eat": "..."
  }},
  food_items : {{ 
    "Roti": {{
        "Calories": "120 kcal per 100g",
        "Macronutrients": "Carbs: 25g, Protein: 3g, Fat: 2g, Fiber: 3g",
        "Key Vitamins & Minerals": "Iron (1.5 mg), Calcium (40 mg)",
        "Pregnancy Benefits": "...",
        "Risks": "...",
        "Best Ways to Eat": "..."
    }}, 
    "Plain Rice": {{
        "Calories": "130 kcal per 100g",
        "Macronutrients": "Carbs: 28.5g, Protein: 2.7g, Fat: 0.5g, Fiber: 0.4g",
        "Key Vitamins & Minerals": "Iron (0.2 mg), Folate (3 mcg)",
        "Pregnancy Benefits": "Provides essential carbohydrates for energy. The iron content can help manage anemia, especially when consumed with vitamin C-rich foods. Folate supports fetal development.",
        "Risks": "Low in fiber and high glycemic index may affect blood sugar. Excessive consumption could contribute to weight gain, which isn't ideal for hypertension.",
        "Best Ways to Eat": "Pair with protein sources like lentils or eggs, add vegetables for fiber, and a source of vitamin C to enhance iron absorption."
    }}, ... etc
  }}
}}
```
[/INST]"""


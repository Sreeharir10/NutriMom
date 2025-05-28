import requests
import json
from prompt_template import calorie_prompt_template
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.vectorstores import Chroma
import yaml
from langchain.schema.runnable import Runnable

# Load configuration from YAML
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

class OpenRouterInferenceLLM(Runnable):
    """ Custom LLM class to interact with OpenRouter API """
    
    def __init__(self, model_name=config["model_path"], api_key=config["api_key"]):
        self.api_key = api_key
        self.model_name = model_name
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

    def invoke(self, prompt, *args, **kwargs):
        if hasattr(prompt, "to_string"):  # Check if it has the to_string() method
            prompt = prompt.to_string()
        elif hasattr(prompt, "format"):  # Use format() to get the string
            prompt = prompt.format()

        messages = [{"role": "user", "content": prompt}]
        
        response = requests.post(
            url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": config.get("site_url", ""),  # Optional
                "X-Title": config.get("site_name", ""),  # Optional
            },
            data=json.dumps({
                "model": self.model_name,
                "messages": messages,
            })
        )

        response_json = response.json()
        if "choices" in response_json and len(response_json["choices"]) > 0:
            return response_json["choices"][0]["message"]["content"]
        else:
            return "Error: Invalid response from OpenRouter API"

def create_llm():
    """ Create an instance of the OpenRouter API-based LLM """
    return OpenRouterInferenceLLM()

def create_prompt_from_template(template):
    return PromptTemplate.from_template(template)

def create_llm_chain(llm, chat_prompt):
    return LLMChain(llm=llm, prompt=chat_prompt)

class ChatChain:
    def __init__(self):
        llm = create_llm()
        chat_prompt = create_prompt_from_template(calorie_prompt_template)
        self.llm_chain = create_llm_chain(llm, chat_prompt)

    def run(self, user_input, combined_data):
        if isinstance(user_input, list):  # Ensure user_input is a string, not a list
            user_input = ", ".join(user_input) 
          
        return self.llm_chain.run({"food_list": user_input, "combined_data": combined_data})

def load_normal_chain():
    """ Loads the normal chatbot without retrieval. """
    return ChatChain()
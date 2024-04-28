from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.memory import ConversationBufferMemory
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import HuggingFacePipeline
import os

app = Flask(__name__)
CORS(app,origins="http://localhost:3000")



os.environ["HUGGINGFACEHUB_API_TOKEN"] = "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"

llm = HuggingFacePipeline.from_model_id(
    model_id="google/flan-t5-large",
    task="text2text-generation",
    model_kwargs={"temperature": 0.8, "max_length": 200, "do_sample": True},
    device=-1
)

loader = UnstructuredMarkdownLoader("README.md")
data = loader.load()
embeddings = HuggingFaceEmbeddings() 
vectorstore = FAISS.from_documents(data, embeddings)
retriever = vectorstore.as_retriever()
memory = ConversationBufferMemory(llm=llm, memory_key="chat_history", output_key='answer', return_messages=True)
chain = RetrievalQA.from_chain_type(llm, retriever=retriever)

@app.route("/")
def home():
    with open("templates/index.html", "r") as f:
        html_content = f.read()
    return html_content, 200

@app.route("/query", methods=["GET", "POST"])
def process_query():
    if request.method == "GET":
        return jsonify({"error": "GET method not supported for this endpoint"}), 405
    try:
        user_input = request.form["user_input"]
        result = chain({"query": user_input})
        response = result["result"]
        return jsonify({"response": response}), 200
    except KeyError:
        return jsonify({"error": "Missing 'user_input' field in form data"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

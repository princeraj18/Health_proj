import os
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Connect to index
index = pc.Index(os.getenv("PINECONE_INDEX"))

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

def search_context(query, top_k=3):
    vector = model.encode(query).tolist()

    result = index.query(
        vector=vector,
        top_k=top_k,
        include_metadata=True
    )

    texts = []
    for match in result["matches"]:
        meta = match.get("metadata", {})
        if "text" in meta:
            texts.append(meta["text"])

    return " ".join(texts)

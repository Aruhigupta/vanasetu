import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from backend.app.main import app

# Vercel serverless function entrypoint pointing to canonical /backend

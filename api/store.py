from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        # In a real Vercel environment, we would read the JSON file from the public folder.
        # For simplicity in this demo serverless function, we'll return a static success message.
        # The frontend reads public/data/products.json directly in this implementation.
        
        response = {
            "status": "success",
            "message": "Store API is running. Products are loaded via static JSON.",
            "endpoint": "/api/store"
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
        return

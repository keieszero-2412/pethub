from http.server import BaseHTTPRequestHandler
import json
import uuid
import datetime

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "status": "success",
            "message": "Booking API is running."
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            
            # Basic validation
            required_fields = ['service', 'petName', 'date', 'time', 'ownerName', 'phone']
            for field in required_fields:
                if field not in data or not data[field]:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    error = {"success": False, "error": f"Missing required field: {field}"}
                    self.wfile.write(json.dumps(error).encode('utf-8'))
                    return

            # Simulate saving booking and returning a booking ID
            booking_id = f"BK-{str(uuid.uuid4())[:8].upper()}"
            
            response = {
                "success": True,
                "booking": {
                    "id": booking_id,
                    **data,
                    "status": "confirmed",
                    "createdAt": datetime.datetime.now().isoformat()
                }
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error = {"success": False, "error": "Invalid JSON format"}
            self.wfile.write(json.dumps(error).encode('utf-8'))

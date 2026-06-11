from google import genai
from google.genai import types
import json
import re
from typing import Optional, Dict, Any
import os
from pydantic import BaseModel,Field
from flask import Flask,request,jsonify,render_template
import base64
app = Flask(__name__)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = "gemini-2.5-flash"
client = genai.Client()
class parsed_transaction(BaseModel):
    item_name: str = Field(description="name of the item sold or bought")
    quantity: int = Field(description="number of unit of the item sold")
    unit_price: float = Field(description="price of one unit of the item sold")
    total: float = Field(description="total price of all units of item sold")
    transaction_type: str = Field(description='can only be "sale"(trader sold to a custome) or "expense"(trader bought something like a restock, supply or transport etc.)')
def _extract_json(s: str) -> Optional[Dict[str, Any]]:
    if not s:
        return None
    s = s.strip()
    # quick direct parse
    try:
        parsed = json.loads(s)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass

    start = s.find('{')
    if start == -1:
        return None
    depth = 0
    for i in range(start, len(s)):
        if s[i] == '{':
            depth += 1
        elif s[i] == '}':
            depth -= 1
            if depth == 0:
                candidate = s[start:i+1]
                try:
                    parsed = json.loads(candidate)
                    if isinstance(parsed, dict):
                        return parsed
                except Exception:
                    return None
                
    m = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", s, re.IGNORECASE)
    if m:
        try:
            parsed = json.loads(m.group(1))
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            return None
    return None
@app.route("/text")
def parse_text()-> parsed_transaction:
    try:
        
        data = request.get_json()
        text = data.get("query","")
        language = data.get("language","")
        prompt = f'''
                You are a bookkeeping assistant for Nigerian market traders.
                Extract the transaction from this message and return ONLY valid JSON with no extra text or markdown.

                Message (language: {language}): {text}

                Return exactly a JSON in this exact format:
                {{
                "itemName": "name of item",
                "quantity": <number>,
                "unitPrice": <number>,
                "total": <number>,
                "transactionType": "sale or expense"
                }}

                Rules:
                - "sale" = trader sold something to a customer
                - "expense" = trader bought/spent (restock, supplies, transport, etc.)
                - If total is not stated, calculate it as quantity * unitPrice
                - If you cannot find a clear transaction, return: {{ "error": "no_transaction" }}
                '''
        response = client.interactions.create(
        model=model,
        input=prompt,
        response_format={
                            "type": "text",
                            "mime_type": "application/json",
                            "schema": parsed_transaction.model_json_schema()
                        },
                    )
        print(response.output_text)
        clean = _extract_json(response.output_text)
        return jsonify({"reply": clean})
    except Exception as e:
        return jsonify({"reply":f"Error processing Query:{e}"})
@app.route("/audio")
def parse_audio() -> parsed_transaction:
    try:
        data = request.get_json()
        audio = data.get("audio","")
        mimeType = data.get("mime_type","")
        language = data.get("language","")

        with open('path/to/small-sample.mp3', 'rb') as f:
            audio_bytes = f.read()
        response = client.interactions.create(
        model=model,
        input=[{"type":"text","text":
             f'''
            You are a bookkeeping assistant for Nigerian market traders.
            The trader sent a voice note (language: {language}).
            Listen carefully and extract the transaction they described.
            Return ONLY valid JSON with no extra text or markdown:

            {{
            "itemName": "name of item",
            "quantity": <number>,
            "unitPrice": <number>,
            "total": <number>,
            "transactionType": "sale" or "expense"
            }}

            If you cannot find a clear transaction, return: {{ "error": "no_transaction" }}'''},
                      
            {"type": "audio","data": base64.b64encode(audio_bytes).decode('utf-8'),"mime_type": "audio/mp3"}
      
        ]
        )
        print(response.output_text)
        clean = _extract_json(response.output_text)
        return jsonify({"reply": clean})
        
    except Exception as e:
        return jsonify({"reply":f"error processing request {e}"})

@app.route("/intent")
def detect_intent()->str:
    try:
        data = request.get_json()
        text = data.get("query")
        language = data.get("language")
        
        
        response = client.interactions.create(
            model=model,
            input=f'''
            You are classifying a WhatsApp message from a Nigerian market trader.
            Message (language: {language}): "{text}"

            Return ONLY one of these exact strings — no explanation, no punctuation:
            record_transaction
            check_today_sales
            check_stock
            restock
            dashboard_link
            market_query
            calculate
            adashi
            help
            Rules:
            - record_transaction: selling or recording an expense
            - check_today_sales: asking about today's earnings or sales total
            - check_stock: asking about current inventory levels
            - restock: adding new stock / buying more items
            - dashboard_link: wants the dashboard URL or a link to see stats
            - market_query: asking current price of something in the market
            - calculate: asking to do math (e.g. "3 bags at 4200 each")
            - adashi: anything about savings group, adashi, ajo, isusu
            - help: anything else or unclear
                        '''
                    )
        clean = _extract_json(response.output_text)
        return jsonify({"reply":clean})
    except Exception as e:
        return jsonify({"reply":f"Error processing request: {e}"})
    
    
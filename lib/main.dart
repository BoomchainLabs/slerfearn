import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from web3 import Web3
import uvicorn

# Load .env
load_dotenv()

# === Environment Variables ===
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
REWARD_SIGNER_KEY = os.getenv("REWARD_SIGNER_KEY")
BASE_RPC_URL = os.getenv("BASE_RPC_URL")
SLERF_CONTRACT = os.getenv("SLERF_CONTRACT")

# === Firebase Admin Init ===
cred = credentials.Certificate("firebase-admin.json")  # Place your Firebase service account here
firebase_admin.initialize_app(cred)

# === Web3 Setup ===
w3 = Web3(Web3.HTTPProvider(BASE_RPC_URL))
account = w3.eth.account.from_key(REWARD_SIGNER_KEY)
contract = w3.eth.contract(
    address=Web3.to_checksum_address(SLERF_CONTRACT),
    abi=[
        {
            "inputs": [{"internalType": "address", "name": "recipient", "type": "address"}],
            "name": "reward",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
)

# === FastAPI App ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RewardRequest(BaseModel):
    address: str  # Wallet address

# === Firebase ID Token Verification ===
def verify_token(req: Request):
    auth_header = req.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    id_token = auth_header.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Firebase verification failed")

# === SLERF Reward Handler ===
def reward_user(wallet_address: str):
    nonce = w3.eth.get_transaction_count(account.address)
    txn = contract.functions.reward(wallet_address).build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": 200000,
        "gasPrice": w3.to_wei("5", "gwei")
    })
    signed_txn = w3.eth.account.sign_transaction(txn, REWARD_SIGNER_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    return w3.to_hex(tx_hash)

# === Reward Endpoint ===
@app.post("/reward")
async def reward(request: Request, payload: RewardRequest):
    verify_token(request)  # Firebase verification
    try:
        tx = reward_user(payload.address)
        return {"status": "success", "tx_hash": tx}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reward failed: {str(e)}")

# === Run Server (if not running via uvicorn CLI) ===
if __name__ == "__main__":
    uvicorn.run("slerfearn_server:app", host="0.0.0.0", port=8000, reload=True)

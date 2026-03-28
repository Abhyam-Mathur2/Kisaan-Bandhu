import os
import asyncio
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv("d:\\CSI Hackathon\\Kisan Bandhu\\Kisaan-Bandhu\\.env")

async def get_models():
    client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
    try:
        models = await client.models.list()
        with open("d:\\CSI Hackathon\\Kisan Bandhu\\Kisaan-Bandhu\\backend\\groq_models.txt", "w") as f:
            for m in models.data:
                f.write(m.id + "\n")
        print("Models dumped")
    except Exception as e:
        print("Error:", str(e))

asyncio.run(get_models())

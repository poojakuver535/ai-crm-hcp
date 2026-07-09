from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import interactions, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI CRM - HCP Module", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interactions.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "AI CRM HCP Module API is running"}
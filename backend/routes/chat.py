from fastapi import APIRouter
from schemas import ChatMessage
from langchain_core.messages import HumanMessage
from agent.graph import agent

router = APIRouter(prefix="/api/chat", tags=["chat"])

conversations = {}

@router.post("/")
async def chat(message: ChatMessage):
    conv_id = message.conversation_id or "default"

    if conv_id not in conversations:
        conversations[conv_id] = []

    conversations[conv_id].append(HumanMessage(content=message.message))

    result = agent.invoke({"messages": conversations[conv_id]})

    ai_message = result["messages"][-1]
    conversations[conv_id] = result["messages"]

    return {
        "response": ai_message.content,
        "conversation_id": conv_id,
    }

@router.delete("/{conversation_id}")
async def clear_chat(conversation_id: str):
    if conversation_id in conversations:
        del conversations[conversation_id]
    return {"message": "Conversation cleared"}
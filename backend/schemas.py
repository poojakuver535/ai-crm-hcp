from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InteractionCreate(BaseModel):
    hcp_name: str
    hcp_specialty: Optional[str] = None
    interaction_type: str
    interaction_date: datetime
    product_discussed: Optional[str] = None
    key_topics: Optional[str] = None
    follow_up_actions: Optional[str] = None
    sentiment: Optional[str] = None
    notes: Optional[str] = None
    ai_summary: Optional[str] = None

class InteractionUpdate(BaseModel):
    hcp_name: Optional[str] = None
    hcp_specialty: Optional[str] = None
    interaction_type: Optional[str] = None
    interaction_date: Optional[datetime] = None
    product_discussed: Optional[str] = None
    key_topics: Optional[str] = None
    follow_up_actions: Optional[str] = None
    sentiment: Optional[str] = None
    notes: Optional[str] = None
    ai_summary: Optional[str] = None

class InteractionResponse(BaseModel):
    id: int
    hcp_name: str
    hcp_specialty: Optional[str]
    interaction_type: str
    interaction_date: datetime
    product_discussed: Optional[str]
    key_topics: Optional[str]
    follow_up_actions: Optional[str]
    sentiment: Optional[str]
    notes: Optional[str]
    ai_summary: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None
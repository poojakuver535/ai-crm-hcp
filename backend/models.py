from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), nullable=False)
    hcp_specialty = Column(String(255), nullable=True)
    interaction_type = Column(String(50), nullable=False)
    interaction_date = Column(DateTime, nullable=False)
    product_discussed = Column(String(255), nullable=True)
    key_topics = Column(Text, nullable=True)
    follow_up_actions = Column(Text, nullable=True)
    sentiment = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
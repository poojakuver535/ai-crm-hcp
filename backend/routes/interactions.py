from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Interaction
from schemas import InteractionCreate, InteractionUpdate, InteractionResponse
from typing import List

router = APIRouter(prefix="/api/interactions", tags=["interactions"])

@router.post("/", response_model=InteractionResponse)
def create_interaction(data: InteractionCreate, db: Session = Depends(get_db)):
    interaction = Interaction(**data.model_dump())
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction

@router.get("/", response_model=List[InteractionResponse])
def list_interactions(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Interaction).order_by(
        Interaction.interaction_date.desc()
    ).offset(skip).limit(limit).all()

@router.get("/{interaction_id}", response_model=InteractionResponse)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.put("/{interaction_id}", response_model=InteractionResponse)
def update_interaction(interaction_id: int, data: InteractionUpdate, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(interaction, key, value)
    db.commit()
    db.refresh(interaction)
    return interaction

@router.delete("/{interaction_id}")
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    db.delete(interaction)
    db.commit()
    return {"message": f"Interaction #{interaction_id} deleted"}
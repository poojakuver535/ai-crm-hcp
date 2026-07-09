from langchain_core.tools import tool
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Interaction
from datetime import datetime
from typing import Optional
import json


@tool
def log_interaction(
    hcp_name: str,
    interaction_type: str,
    interaction_date: str,
    product_discussed: str = "",
    key_topics: str = "",
    follow_up_actions: str = "",
    sentiment: str = "neutral",
    notes: str = "",
    hcp_specialty: str = ""
) -> str:
    """Log a new interaction with a Healthcare Professional (HCP).
    Use this when the user wants to record a meeting, call, email,
    or any interaction with a doctor.

    Args:
        hcp_name: Name of the HCP/doctor
        interaction_type: Type - in_person, phone_call, email, video_call, conference
        interaction_date: Date in YYYY-MM-DD format
        product_discussed: Drug or product discussed
        key_topics: Main topics covered
        follow_up_actions: Next steps or follow-ups
        sentiment: HCP sentiment - positive, neutral, negative
        notes: Additional notes
        hcp_specialty: Doctor specialty e.g. Cardiology
    """
    db = SessionLocal()
    try:
        interaction = Interaction(
            hcp_name=hcp_name,
            hcp_specialty=hcp_specialty,
            interaction_type=interaction_type,
            interaction_date=datetime.strptime(interaction_date, "%Y-%m-%d"),
            product_discussed=product_discussed,
            key_topics=key_topics,
            follow_up_actions=follow_up_actions,
            sentiment=sentiment,
            notes=notes,
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        return json.dumps({
            "status": "success",
            "message": f"Interaction #{interaction.id} logged successfully with Dr. {hcp_name}",
            "interaction_id": interaction.id
        })
    except Exception as e:
        db.rollback()
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


@tool
def edit_interaction(
    interaction_id: str,
    hcp_name: str = "",
    interaction_type: str = "",
    product_discussed: str = "",
    key_topics: str = "",
    follow_up_actions: str = "",
    sentiment: str = "",
    notes: str = "",
    hcp_specialty: str = ""
) -> str:
    """Edit an existing interaction record.
    Use this when the user wants to modify a previously logged interaction.

    Args:
        interaction_id: The ID of the interaction to edit
        hcp_name: Updated HCP name (leave empty to keep existing)
        interaction_type: Updated type
        product_discussed: Updated product
        key_topics: Updated topics
        follow_up_actions: Updated follow-ups
        sentiment: Updated sentiment
        notes: Updated notes
        hcp_specialty: Updated specialty
    """
    db = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(
            Interaction.id == int(interaction_id)
        ).first()
        if not interaction:
            return json.dumps({
                "status": "error",
                "message": f"Interaction #{interaction_id} not found"
            })

        if hcp_name: interaction.hcp_name = hcp_name
        if interaction_type: interaction.interaction_type = interaction_type
        if product_discussed: interaction.product_discussed = product_discussed
        if key_topics: interaction.key_topics = key_topics
        if follow_up_actions: interaction.follow_up_actions = follow_up_actions
        if sentiment: interaction.sentiment = sentiment
        if notes: interaction.notes = notes
        if hcp_specialty: interaction.hcp_specialty = hcp_specialty

        db.commit()
        return json.dumps({
            "status": "success",
            "message": f"Interaction #{interaction_id} updated successfully"
        })
    except Exception as e:
        db.rollback()
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


@tool
def search_interactions(
    query: str,
    hcp_name: str = "",
    limit: str = "10"
) -> str:
    """Search and retrieve past interactions.
    Use this when the user wants to find or look up previous interactions.

    Args:
        query: Search term to look for in notes, topics, products
        hcp_name: Filter by specific HCP name
        limit: Max number of results to return
    """
    db = SessionLocal()
    try:
        q = db.query(Interaction)
        if hcp_name:
            q = q.filter(Interaction.hcp_name.ilike(f"%{hcp_name}%"))
        if query:
            q = q.filter(
                (Interaction.key_topics.ilike(f"%{query}%")) |
                (Interaction.notes.ilike(f"%{query}%")) |
                (Interaction.product_discussed.ilike(f"%{query}%"))
            )
        results = q.order_by(Interaction.interaction_date.desc()).limit(int(limit)).all()

        interactions = []
        for r in results:
            interactions.append({
                "id": r.id,
                "hcp_name": r.hcp_name,
                "specialty": r.hcp_specialty,
                "type": r.interaction_type,
                "date": r.interaction_date.strftime("%Y-%m-%d"),
                "product": r.product_discussed,
                "topics": r.key_topics,
                "sentiment": r.sentiment,
            })
        return json.dumps({
            "status": "success",
            "count": len(interactions),
            "interactions": interactions
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


@tool
def summarize_interaction(interaction_id: str) -> str:
    """Get a detailed summary of a specific interaction.
    Use this when the user asks for details about a particular interaction.

    Args:
        interaction_id: The ID of the interaction to summarize
    """
    db = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(
            Interaction.id == int(interaction_id)
        ).first()
        if not interaction:
            return json.dumps({
                "status": "error",
                "message": f"Interaction #{interaction_id} not found"
            })

        return json.dumps({
            "status": "success",
            "interaction": {
                "id": interaction.id,
                "hcp_name": interaction.hcp_name,
                "specialty": interaction.hcp_specialty,
                "type": interaction.interaction_type,
                "date": interaction.interaction_date.strftime("%Y-%m-%d"),
                "product": interaction.product_discussed,
                "topics": interaction.key_topics,
                "follow_ups": interaction.follow_up_actions,
                "sentiment": interaction.sentiment,
                "notes": interaction.notes,
                "ai_summary": interaction.ai_summary,
            }
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


@tool
def get_hcp_history(hcp_name: str) -> str:
    """Get the full engagement history for a specific HCP/doctor.
    Use this when the user wants to see all past interactions with a doctor.

    Args:
        hcp_name: Name of the HCP to look up
    """
    db = SessionLocal()
    try:
        results = db.query(Interaction).filter(
            Interaction.hcp_name.ilike(f"%{hcp_name}%")
        ).order_by(Interaction.interaction_date.desc()).all()

        if not results:
            return json.dumps({
                "status": "success",
                "message": f"No interactions found for {hcp_name}",
                "history": []
            })

        history = []
        for r in results:
            history.append({
                "id": r.id,
                "date": r.interaction_date.strftime("%Y-%m-%d"),
                "type": r.interaction_type,
                "product": r.product_discussed,
                "topics": r.key_topics,
                "sentiment": r.sentiment,
                "follow_ups": r.follow_up_actions,
            })

        return json.dumps({
            "status": "success",
            "hcp_name": hcp_name,
            "total_interactions": len(history),
            "history": history
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


ALL_TOOLS = [
    log_interaction,
    edit_interaction,
    search_interactions,
    summarize_interaction,
    get_hcp_history,
]
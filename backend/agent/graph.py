from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from dotenv import load_dotenv
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agent.tools import ALL_TOOLS

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

llm_with_tools = llm.bind_tools(ALL_TOOLS)

SYSTEM_PROMPT = """You are an AI assistant for a pharmaceutical CRM system.
You help field sales representatives log and manage their interactions
with Healthcare Professionals (HCPs/doctors).

You can:
1. Log new interactions (meetings, calls, emails with doctors)
2. Edit existing interactions
3. Search through past interactions
4. Summarize specific interactions
5. Get full engagement history for any HCP

When a user describes a meeting or interaction conversationally, extract:
- HCP name, specialty
- Interaction type (in_person, phone_call, email, video_call, conference)
- Date (use YYYY-MM-DD format)
- Products discussed
- Key topics covered
- Follow-up actions needed
- Sentiment (positive, neutral, negative)

Be proactive: if information is missing, ask for it before logging.
Always confirm what you've logged with the user.
"""


def should_continue(state: MessagesState):
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END


def call_model(state: MessagesState):
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


def create_agent():
    graph = StateGraph(MessagesState)

    graph.add_node("agent", call_model)
    graph.add_node("tools", ToolNode(ALL_TOOLS))

    graph.add_edge(START, "agent")
    graph.add_conditional_edges("agent", should_continue, ["tools", END])
    graph.add_edge("tools", "agent")

    return graph.compile()


agent = create_agent()
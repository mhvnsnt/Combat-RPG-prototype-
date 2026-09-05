import os
import json
import logging
from google import genai
from tools import ProjectCensusTool, GitOpsTool, BuildCoordinatorTool

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AutonomousUnrealAgent:
    def __init__(self):
        # We rely on Application Default Credentials (ADC) populated by the Workload Identity Federation
        # Google Application Default Credentials abstract away the token handling.
        self.client = genai.Client()
        self.repo_context = {}
        
        # Initialize Tools
        self.census_tool = ProjectCensusTool()
        self.git_tool = GitOpsTool()
        self.build_tool = BuildCoordinatorTool()

    def run(self, event_payload: dict, command: str):
        logger.info(f"Agent activated with command: {command}")
        
        # STEP 1: Always perform/verify Project Census before planning implementation
        self.repo_context = self.census_tool.execute()
        logger.info(f"Census complete. UE Version: {self.repo_context.get('engine_version')}")
        
        if command.lower() == "run census":
            logger.info("Census requested. Terminating after census.")
            return self.repo_context
            
        # STEP 2: Implementation Planning (Evidence-based)
        # In a full run, we would pass the census to the Gemini model to decide on branch creation and modifications
        # For bootstrapping infrastructure, we log the intent.
        logger.info(f"Planning implementation based on census context: {json.dumps(self.repo_context)}")
        
        # Further steps (Modifications, PRs, Dispatching Builds) will be orchestrated here
        # based on model tool-calling outputs.
        
if __name__ == "__main__":
    event_data = json.loads(os.environ.get("EVENT_PAYLOAD", "{}"))
    cmd = os.environ.get("COMMAND", "Run Census")
    agent = AutonomousUnrealAgent()
    agent.run(event_data, cmd)

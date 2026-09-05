import os
import glob
import json
import subprocess

class ProjectCensusTool:
    """Discovers project structure, UE version, and existing Lyra modifications."""
    def execute(self) -> dict:
        census = {
            "uproject_file": None,
            "engine_version": None,
            "plugins": [],
            "game_features": []
        }
        
        # Locate .uproject
        uproject_files = glob.glob("*.uproject")
        if not uproject_files:
            return {"error": "No .uproject found. Not a valid Unreal project root."}
            
        census["uproject_file"] = uproject_files[0]
        
        # Parse Engine Version
        try:
            with open(census["uproject_file"], 'r') as f:
                data = json.load(f)
                census["engine_version"] = data.get("EngineAssociation")
                census["plugins"] = [p.get("Name") for p in data.get("Plugins", [])]
        except Exception as e:
            census["error"] = f"Failed to parse uproject: {str(e)}"
            
        # Discover Game Features
        gf_path = "Plugins/GameFeatures"
        if os.path.exists(gf_path):
            census["game_features"] = [d for d in os.listdir(gf_path) if os.path.isdir(os.path.join(gf_path, d))]
            
        return census

class GitOpsTool:
    """Handles branches, commits, and PRs autonomously."""
    def execute(self, action: str, branch_name: str = None, commit_msg: str = None):
        if action == "checkout_branch":
            subprocess.run(["git", "checkout", "-b", branch_name], check=True)
        elif action == "commit":
            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        elif action == "push":
            subprocess.run(["git", "push", "origin", branch_name], check=True)

class BuildCoordinatorTool:
    """Dispatches the Unreal Build Runner Action and awaits logs."""
    def execute(self, target: str):
        # Trigger the unreal-builder.yml workflow using GitHub CLI (gh)
        subprocess.run(["gh", "workflow", "run", "unreal-builder.yml", "-f", f"build_target={target}"], check=True)
        return {"status": "Build dispatched"}

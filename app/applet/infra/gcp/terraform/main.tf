provider "google" {
  project = var.project_id
  region  = var.region
}

# Create a Workload Identity Pool
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-actions-pool"
  display_name              = "GitHub Actions Pool"
  description               = "Identity pool for automated GitHub Actions agent"
}

# Create a Workload Identity Provider in that pool
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Actions Provider"
  
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }
  
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Create the Service Account for the Agent
resource "google_service_account" "agent_sa" {
  account_id   = "github-agent-sa"
  display_name = "GitHub Actions Autonomous Agent SA"
}

# Grant the Service Account Vertex AI User permissions
resource "google_project_iam_member" "vertex_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.agent_sa.email}"
}

# Allow the GitHub repository to impersonate the Service Account via WIF
resource "google_service_account_iam_binding" "workload_identity_impersonation" {
  service_account_id = google_service_account.agent_sa.name
  role               = "roles/iam.workloadIdentityUser"
  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repo}"
  ]
}

output "workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.github_provider.name
  description = "Set this as WORKLOAD_IDENTITY_PROVIDER in GitHub Secrets"
}

output "service_account_email" {
  value = google_service_account.agent_sa.email
  description = "Set this as SERVICE_ACCOUNT_EMAIL in GitHub Secrets"
}

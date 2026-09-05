variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "github_repo" {
  description = "The GitHub repository (e.g., username/repo)"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

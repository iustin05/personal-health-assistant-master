# Hetzner Cloud Provider
terraform {
  required_providers {
    hcloud = {
      source = "hetznercloud/hcloud"
      version = "~> 1.44.1"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# Variables
variable "hcloud_token" {
  description = "Hetzner Cloud API Token"
  sensitive = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  sensitive = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID"
}

variable "domain" {
  description = "Domain name with TLD"
}

variable "subdomain" {
  description = "Subdomain for the backend"
  default = "api"
}

variable "status_subdomain" {
  description = "Subdomain for the status page"
  default = "status"
}

provider "hcloud" {
  token = var.hcloud_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Create PocketBase server
resource "hcloud_server" "pocketbase" {
  name        = "pocketbase-server"
  image       = "ubuntu-22.04"
  server_type = "cax11"
  location    = "nbg1"  # Nuremberg
  
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker
              
              # Create directory for PocketBase
              mkdir -p /opt/pocketbase
              
              # Run PocketBase container
              docker run -d \
                --name pocketbase \
                --restart always \
                -p 80:8090 \
                -v /opt/pocketbase_data:/pb_data \
                -v /opt/pocketbase_hooks:/pb_hooks \
                -v /opt/pocketbase_migrations:/pb_migrations \
                ghcr.io/muchobien/pocketbase:latest
              EOF
}

# Create Uptime Kuma server
resource "hcloud_server" "uptime_kuma" {
  name        = "uptime-kuma-server"
  image       = "ubuntu-22.04"
  server_type = "cax11"
  location    = "nbg1"  # Nuremberg
  
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker
              
              # Run Uptime Kuma container
              docker run -d \
                --name uptime-kuma \
                --restart always \
                -p 80:3001 \
                -v uptime-kuma:/app/data \
                louislam/uptime-kuma:1
              EOF
}

# Create A record for PocketBase in Cloudflare
resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = var.subdomain
  value   = hcloud_server.pocketbase.ipv4_address
  type    = "A"
  proxied = true # Enable Cloudflare proxy
}

# Create A record for Uptime Kuma in Cloudflare
resource "cloudflare_record" "status" {
  zone_id = var.cloudflare_zone_id
  name    = var.status_subdomain
  value   = hcloud_server.uptime_kuma.ipv4_address
  type    = "A"
  proxied = true # Enable Cloudflare proxy
}

# Output values
output "pocketbase_ip" {
  value = hcloud_server.pocketbase.ipv4_address
}

output "uptime_kuma_ip" {
  value = hcloud_server.uptime_kuma.ipv4_address
}

output "api_url" {
  value = "${var.subdomain}.${var.domain}"
}

output "status_url" {
  value = "${var.status_subdomain}.${var.domain}"
}
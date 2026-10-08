import type { ConfigType } from "../types/config-fixer.types";

export interface ConfigPreset {
  id: string;
  name: string;
  type: ConfigType;
  description: string;
  configText: string;
}

export const CONFIG_PRESETS: ConfigPreset[] = [
  {
    id: "vulnerable-dockerfile",
    name: "Insecure Node Dockerfile",
    type: "dockerfile",
    description: "Runs as root, uses mutable :latest tag, and pulls unverified ADD targets.",
    configText: `FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vulnerabilities: Running as root user & exposed debug port
USER root
EXPOSE 3000 9229

CMD ["npm", "run", "dev"]`,
  },
  {
    id: "vulnerable-nginx",
    name: "Insecure Nginx Proxy",
    type: "nginx",
    description: "Directory listing enabled, outdated TLS protocols, and version disclosures.",
    configText: `server {
    listen 80;
    server_name example.com;

    # Vulnerability 1: Directory listing enabled
    autoindex on;

    # Vulnerability 2: Server information disclosure
    server_tokens on;

    # Vulnerability 3: Weak SSL configuration
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    location / {
        proxy_pass http://localhost:8080;
    }
}`,
  },
  {
    id: "vulnerable-env",
    name: "Exposed Production .env",
    type: "env",
    description: "Hardcoded production secrets, debug mode enabled, and weak parameters.",
    configText: `# Production Environment Config
PORT=3000
NODE_ENV=development
DEBUG=true

# Vulnerability: Hardcoded production credentials in version control
DATABASE_URL=postgres://admin:Password123!@db.production.internal:5432/app_db
JWT_SECRET=sk_live_99887766554433221100_super_secret_token
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`,
  },
];
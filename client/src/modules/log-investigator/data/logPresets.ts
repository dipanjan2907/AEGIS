import type { LogPreset } from "../types/log-investigator.types";

export const LOG_PRESETS: LogPreset[] = [
  {
    id: "nginx-web-attack",
    name: "Nginx Web Attack Log",
    description: "Traversal, SQL injection, and a scanner fingerprint.",
    format: "nginx_access",
    query: "Did any attacker gain access, or were these only blocked probes?",
    content: `203.0.113.41 - - [08/Oct/2026:10:14:02 +0000] "GET /../../etc/passwd HTTP/1.1" 403 153 "-" "Mozilla/5.0"
203.0.113.41 - - [08/Oct/2026:10:14:04 +0000] "GET /search?q=1%20UNION%20SELECT%20password%20FROM%20users HTTP/1.1" 403 153 "-" "Mozilla/5.0"
198.51.100.22 - - [08/Oct/2026:10:15:20 +0000] "GET / HTTP/1.1" 404 162 "-" "Nikto/2.1.6"
203.0.113.41 - - [08/Oct/2026:10:16:05 +0000] "GET /admin HTTP/1.1" 200 942 "-" "Mozilla/5.0"`,
  },
  {
    id: "auth-brute-force",
    name: "Auth Brute Force Log",
    description: "Repeated SSH authentication failures from one source.",
    format: "auth_syslog",
    query: "Which source generated the brute-force attempts, and was there a successful login?",
    content: `Oct  8 10:20:01 aegis-host sshd[1721]: Failed password for invalid user admin from 198.51.100.77 port 50101 ssh2
Oct  8 10:20:04 aegis-host sshd[1725]: Failed password for root from 198.51.100.77 port 50102 ssh2
Oct  8 10:20:09 aegis-host sshd[1730]: Failed password for deploy from 198.51.100.77 port 50103 ssh2
Oct  8 10:21:13 aegis-host sshd[1755]: Accepted publickey for operator from 192.0.2.24 port 50821 ssh2`,
  },
  {
    id: "api-exfiltration",
    name: "API Exfiltration Log",
    description: "API probing, auth failures, and a successful export request.",
    format: "express_json",
    query: "Did the suspicious client receive a successful response?",
    content: `{"timestamp":"2026-10-08T10:31:00.000Z","ip":"203.0.113.88","method":"GET","path":"/api/users?sort=1%20UNION%20SELECT%20email","statusCode":403,"userAgent":"curl/8.0"}
{"timestamp":"2026-10-08T10:31:07.000Z","ip":"203.0.113.88","method":"POST","path":"/api/login","statusCode":401,"userAgent":"python-requests/2.31"}
{"timestamp":"2026-10-08T10:31:11.000Z","ip":"203.0.113.88","method":"POST","path":"/api/login","statusCode":401,"userAgent":"python-requests/2.31"}
{"timestamp":"2026-10-08T10:31:14.000Z","ip":"203.0.113.88","method":"POST","path":"/api/login","statusCode":401,"userAgent":"python-requests/2.31"}
{"timestamp":"2026-10-08T10:31:22.000Z","ip":"203.0.113.88","method":"GET","path":"/api/export","statusCode":200,"userAgent":"python-requests/2.31"}`,
  },
];

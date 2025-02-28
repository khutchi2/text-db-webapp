# text-db-webapp
Slightly more complex K8s webapp template using nginx as a reverse proxy and to serve static files, a python/flask backend, and a database.

Essentially this is the Stepup Webapp with an updated architecture.

## Project Structure
flask-k8s-app/
│
├── app/
│   ├── app.py          # Flask API backend
│   ├── schema.sql      # Database schema
│   ├── requirements.txt
│   └── Dockerfile      # Flask app Dockerfile
│
├── nginx/
│   ├── Dockerfile      # Nginx Dockerfile
│   ├── nginx.conf      # Nginx configuration
│   └── html/           # Static frontend files
│       ├── index.html  # Main HTML page
│       ├── css/
│       │   └── styles.css
│       └── js/
│           └── app.js
│
└── k8s/
    └── k8s-manifests.yaml  # Kubernetes deployment files
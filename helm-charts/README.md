# NGINX SSL Test Helm Chart

Clean, production-ready Helm chart for deploying nginx with automatic SSL certificates via Let's Encrypt.

## 📁 Directory Structure

```
helm-charts/
├── letsencrypt-fixed-issuer.yaml    # Let's Encrypt ClusterIssuer configuration
└── nginx-ssl-test/                   # Main Helm chart
    ├── Chart.yaml                    # Chart metadata
    ├── values.yaml                   # Configuration values
    └── templates/
        ├── _helpers.tpl              # Template helpers
        ├── configmap.yaml            # Custom HTML page
        ├── deployment.yaml           # NGINX deployment
        ├── ingress.yaml              # Ingress with SSL
        ├── service.yaml              # Service definition
        ├── serviceaccount.yaml       # Service account
        ├── hpa.yaml                  # Auto-scaling (disabled by default)
        ├── NOTES.txt                 # Post-install instructions
        └── tests/
            └── test-connection.yaml  # Helm test
```

## 🚀 Quick Deploy

```bash
# Install Let's Encrypt ClusterIssuer
kubectl apply -f letsencrypt-fixed-issuer.yaml

# Install the nginx application
helm install nginx-ssl-test ./nginx-ssl-test --namespace nginx-ssl-test --create-namespace
```

## ✅ Features

- ✅ **Standard Ports**: HTTP (80) and HTTPS (443)
- ✅ **Let's Encrypt SSL**: Automatic certificate issuance and renewal
- ✅ **Custom Landing Page**: Beautiful branded page with tech stack showcase
- ✅ **Automatic Redirects**: HTTP → HTTPS security
- ✅ **Production Ready**: All components configured for production use

## 🌐 Current Configuration

- **Domain**: alerts.boysthings.top
- **SSL Issuer**: Let's Encrypt Production (R12)
- **Ingress Class**: nginx
- **Host Network**: Enabled (direct port binding)

## 🛠️ Management Commands

```bash
# Check status
helm status nginx-ssl-test -n nginx-ssl-test
kubectl get all,ingress,certificate -n nginx-ssl-test

# Upgrade
helm upgrade nginx-ssl-test ./nginx-ssl-test -n nginx-ssl-test

# Uninstall
helm uninstall nginx-ssl-test -n nginx-ssl-test
```

## 📝 Notes

- Certificate auto-renews every 90 days
- DNS must point to your server IP for Let's Encrypt validation
- NGINX ingress controller uses hostNetwork for standard ports
- Custom HTML page served from ConfigMap mount

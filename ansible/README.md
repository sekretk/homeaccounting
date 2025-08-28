# Ansible K3s Installation Playbook

This Ansible playbook automates the installation of K3s Kubernetes cluster on your VDS (Virtual Dedicated Server).

## Prerequisites

1. Ansible installed on your local machine
2. SSH access to your VDS with root privileges
3. SSH key-based authentication configured

## Setup Instructions

### 1. Configure Inventory

Edit `inventory/hosts.yml` and replace `YOUR_VDS_IP_ADDRESS` with your actual VDS IP address:

```yaml
k3s-master:
  ansible_host: 31.57.109.65  # YOUR_VDS_IP_ADDRESS -> Replace with your VDS IP
  ansible_user: root
```

### 2. Configure Variables

Edit the variables in `group_vars/k3s_cluster.yml` if needed:
- K3s version
- Network CIDR ranges
- Components to disable/enable

### 3. Set Secure Token

Edit `group_vars/vault.yml` and change the K3s token:

```bash
# Edit the vault file
ansible-vault edit group_vars/vault.yml
# Or encrypt the file after editing
ansible-vault encrypt group_vars/vault.yml
```

Generate a secure random token:
```bash
openssl rand -base64 32
```

### 4. Test Connection

Test SSH connectivity to your VDS:

```bash
ansible k3s_cluster -m ping
```

## Running the Playbook

### Install K3s

```bash
# Run the playbook
ansible-playbook playbooks/install-k3s.yml

# If using encrypted vault
ansible-playbook playbooks/install-k3s.yml --ask-vault-pass
```

### Verify Installation

After installation, verify the cluster:

```bash
# Use the downloaded kubeconfig
export KUBECONFIG=./kubeconfig-k3s-master.yaml
kubectl get nodes
kubectl get pods -A
```

## Advanced Configuration

### Adding Worker Nodes

Uncomment and configure worker nodes in `inventory/hosts.yml`:

```yaml
k3s_agents:
  hosts:
    k3s-worker-1:
      ansible_host: WORKER_IP_ADDRESS
      ansible_user: root
```

### Custom K3s Configuration

Modify `group_vars/k3s_cluster.yml` to customize:
- Network settings
- Disabled components
- Additional server/agent arguments

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   ```bash
   # Test SSH connection
   ssh root@YOUR_VDS_IP
   ```

2. **K3s Installation Failed**
   ```bash
   # Check installation logs on VDS
   journalctl -u k3s
   ```

3. **Kubeconfig Issues**
   ```bash
   # Manually copy kubeconfig
   scp root@YOUR_VDS_IP:/etc/rancher/k3s/k3s.yaml ~/.kube/config
   # Edit server IP in kubeconfig
   sed -i 's/127.0.0.1/YOUR_VDS_IP/g' ~/.kube/config
   ```

## File Structure

```
ansible/
├── ansible.cfg           # Ansible configuration
├── inventory/
│   └── hosts.yml        # Server inventory
├── group_vars/
│   ├── k3s_cluster.yml  # K3s configuration variables
│   └── vault.yml        # Encrypted sensitive variables
├── playbooks/
│   └── install-k3s.yml  # Main installation playbook
└── README.md            # This file
```

## Security Notes

1. Always use encrypted vault for sensitive data
2. Change the default K3s token
3. Consider using non-root user with sudo privileges
4. Configure firewall rules if needed
5. Keep K3s version updated

## Next Steps

After successful installation:
1. Install additional tools (Helm, kubectl plugins)
2. Deploy ingress controller (NGINX, Traefik)
3. Set up monitoring (Prometheus, Grafana)
4. Configure backup solutions

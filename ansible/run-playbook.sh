#!/bin/bash

# K3s Ansible Playbook Runner Script

set -e

PLAYBOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PLAYBOOK_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}K3s Ansible Playbook Runner${NC}"
echo "================================"

# Check if Ansible is installed
if ! command -v ansible-playbook &> /dev/null; then
    echo -e "${RED}Error: ansible-playbook command not found${NC}"
    echo "Please install Ansible first:"
    echo "pip3 install ansible"
    exit 1
fi

# Add Python bin to PATH if needed
if [[ ":$PATH:" != *":$HOME/Library/Python/3.9/bin:"* ]]; then
    echo -e "${YELLOW}Adding Python bin to PATH...${NC}"
    export PATH="$HOME/Library/Python/3.9/bin:$PATH"
fi

# Check if inventory file exists and is configured
if [ ! -f "inventory/hosts.yml" ]; then
    echo -e "${RED}Error: inventory/hosts.yml not found${NC}"
    exit 1
fi

if grep -q "YOUR_VDS_IP_ADDRESS" inventory/hosts.yml; then
    echo -e "${RED}Error: Please configure your VDS IP address in inventory/hosts.yml${NC}"
    echo "Replace 'YOUR_VDS_IP_ADDRESS' with your actual VDS IP"
    exit 1
fi

# Test connection
echo -e "${YELLOW}Testing connection to VDS...${NC}"
if ansible k3s_cluster -m ping; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    echo "Please check your SSH configuration and VDS connectivity"
    exit 1
fi

# Check if vault file is encrypted
echo -e "${YELLOW}Checking vault configuration...${NC}"
if grep -q "change-me-to-a-secure-random-token" group_vars/vault.yml; then
    echo -e "${YELLOW}Warning: Default K3s token detected in vault.yml${NC}"
    echo "Consider changing the token and encrypting the vault file:"
    echo "  ansible-vault encrypt group_vars/vault.yml"
fi

# Run the playbook
echo -e "${GREEN}Running K3s installation playbook...${NC}"
echo "================================"

if grep -q "\$ANSIBLE_VAULT" group_vars/vault.yml; then
    # Vault is encrypted, ask for password
    ansible-playbook playbooks/install-k3s.yml --ask-vault-pass
else
    # Vault is not encrypted
    ansible-playbook playbooks/install-k3s.yml
fi

echo -e "${GREEN}✓ Playbook execution completed${NC}"
echo ""
echo "Next steps:"
echo "1. Export KUBECONFIG: export KUBECONFIG=./kubeconfig-k3s-master.yaml"
echo "2. Test cluster: kubectl get nodes"
echo "3. View all pods: kubectl get pods -A"

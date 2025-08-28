#!/bin/bash

# TypeORM Model Generator Script
# Generates TypeORM entities from PostgreSQL database schema

set -e

# Default values
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASS="password"
DB_NAME="homeaccounting"
OUTPUT_DIR="shared/src/entities"

# Parse CLI arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -db|--database)
            DB_NAME="$2"
            shift 2
            ;;
        -h|--host)
            DB_HOST="$2"
            shift 2
            ;;
        -p|--port)
            DB_PORT="$2"
            shift 2
            ;;
        -u|--user)
            DB_USER="$2"
            shift 2
            ;;
        -w|--password)
            DB_PASS="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [-db database] [-h host] [-p port] [-u user] [-w password] [-o output]"
            exit 1
            ;;
    esac
done

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Generating TypeORM Entities${NC}"
echo "=================================="
echo "📊 Database: $DB_NAME"
echo "🏠 Host: $DB_HOST:$DB_PORT"
echo "👤 User: $DB_USER"
echo "📁 Output: $OUTPUT_DIR"
echo ""

echo -e "${YELLOW}🔍 Connecting to database...${NC}"
echo "(Connection will be tested by typeorm-model-generator)"
echo ""

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Backup existing entities if they exist
if [ -d "$OUTPUT_DIR" ] && [ "$(ls -A $OUTPUT_DIR 2>/dev/null)" ]; then
    echo -e "${YELLOW}📦 Backing up existing entities...${NC}"
    BACKUP_DIR="$OUTPUT_DIR.backup.$(date +%Y%m%d_%H%M%S)"
    cp -r "$OUTPUT_DIR" "$BACKUP_DIR"
    echo "✅ Backup created: $BACKUP_DIR"
    
    # Clean existing directory
    rm -rf "$OUTPUT_DIR"/*
fi

echo -e "${YELLOW}🏗️  Generating entities...${NC}"

# Run typeorm-model-generator with hardcoded parameters
npx typeorm-model-generator \
    --host "$DB_HOST" \
    --port "$DB_PORT" \
    --database "$DB_NAME" \
    --user "$DB_USER" \
    --pass "$DB_PASS" \
    --engine postgres \
    --output "$OUTPUT_DIR" \
    --case-entity pascal \
    --case-property camel \
    --case-file pascal \
    --index \
    --skipSchema \
    --generateConstructor \
    --strictMode "?" \
    --skipTables "migrations" \
    --lazy \
    --eol LF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Entities generated successfully!${NC}"
    
    # Clean up extra files and move entities to proper location
    if [ -d "$OUTPUT_DIR/entities" ]; then
        echo "📁 Organizing entity files..."
        
        # Move entities to root level with proper naming
        if [ -f "$OUTPUT_DIR/entities/Accounts.ts" ]; then
            mv "$OUTPUT_DIR/entities/Accounts.ts" "$OUTPUT_DIR/account.entity.ts"
            sed -i '' 's/export class Accounts/export class Account/g' "$OUTPUT_DIR/account.entity.ts"
            sed -i '' 's/import { Expenses }/import { Expense }/g' "$OUTPUT_DIR/account.entity.ts"
            sed -i '' 's/from "\.\/Expenses"/from ".\/expense.entity"/g' "$OUTPUT_DIR/account.entity.ts"
            sed -i '' 's/expenses) => expenses\.account/expense) => expense\.account/g' "$OUTPUT_DIR/account.entity.ts"
            sed -i '' 's/Promise<Expenses\[\]>/Promise<Expense[]>/g' "$OUTPUT_DIR/account.entity.ts"
            sed -i '' 's/Partial<Accounts>/Partial<Account>/g' "$OUTPUT_DIR/account.entity.ts"
            echo "   ✅ account.entity.ts (renamed and updated)"
        fi
        
        if [ -f "$OUTPUT_DIR/entities/Expenses.ts" ]; then
            mv "$OUTPUT_DIR/entities/Expenses.ts" "$OUTPUT_DIR/expense.entity.ts"
            sed -i '' 's/export class Expenses/export class Expense/g' "$OUTPUT_DIR/expense.entity.ts"
            sed -i '' 's/import { Accounts }/import { Account }/g' "$OUTPUT_DIR/expense.entity.ts"
            sed -i '' 's/from "\.\/Accounts"/from ".\/account.entity"/g' "$OUTPUT_DIR/expense.entity.ts"
            sed -i '' 's/(accounts) => accounts\.expenses/(account) => account\.expenses/g' "$OUTPUT_DIR/expense.entity.ts"
            sed -i '' 's/Promise<Accounts>/Promise<Account>/g' "$OUTPUT_DIR/expense.entity.ts"
            sed -i '' 's/Partial<Expenses>/Partial<Expense>/g' "$OUTPUT_DIR/expense.entity.ts"
            echo "   ✅ expense.entity.ts (renamed and updated)"
        fi
        
        # Clean up extra files
        rm -rf "$OUTPUT_DIR/entities" "$OUTPUT_DIR/ormconfig.json" "$OUTPUT_DIR/tsconfig.json"
        
        # Create index file
        cat > "$OUTPUT_DIR/index.ts" << 'EOF'
export * from './account.entity';
export * from './expense.entity';
EOF
        echo "   ✅ index.ts (created)"
    fi
    
    echo ""
    echo "🔧 Next steps:"
    echo "  1. Review generated entities in $OUTPUT_DIR"
    echo "  2. Update your backend imports if needed"
    echo "  3. Test your application: npm run start:backend"
    
else
    echo -e "${RED}❌ Entity generation failed!${NC}"
    
    # Restore backup if available
    if [ -d "$BACKUP_DIR" ]; then
        echo -e "${YELLOW}🔄 Restoring backup...${NC}"
        rm -rf "$OUTPUT_DIR"
        mv "$BACKUP_DIR" "$OUTPUT_DIR"
        echo "✅ Backup restored"
    fi
    
    exit 1
fi

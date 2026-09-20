# Automated Database Backup & Disaster Recovery Runbook

This document details automated database backup schedules, retention policies, emergency restore procedures, and point-in-time recovery for **The Education Space Academy ERP**.

---

## 1. Backup Schedule & Strategy

| Backup Type | Frequency | Retention Period | Storage Target |
|---|---|---|---|
| **Daily Automated Backup** | Every midnight @ 02:00 AM UTC | 30 Days | AWS S3 Encrypted Bucket (`s3://educationspace-backups/daily/`) |
| **Weekly Full Snapshot** | Every Sunday @ 03:00 AM UTC | 12 Months | AWS S3 Cold Glacier (`s3://educationspace-backups/weekly/`) |
| **Pre-Deployment Snapshot** | Before every system migration | 90 Days | Offsite Dedicated Server |

---

## 2. Automated PostgreSQL Backup Script

Create `/usr/local/bin/backup-erp-db.sh`:

```bash
#!/bin/bash
set -e

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/educationspace"
DB_NAME="educationspace_db"
DB_USER="erp_user"
S3_BUCKET="s3://educationspace-backups/daily"

mkdir -p $BACKUP_DIR

# 1. Create Compressed PostgreSQL Dump
echo "[$(date)] Starting database backup..."
pg_dump -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/erp_db_$TIMESTAMP.dump"

# 2. Upload to Encrypted Cloud Storage
echo "[$(date)] Syncing backup to S3..."
aws s3 cp "$BACKUP_DIR/erp_db_$TIMESTAMP.dump" "$S3_BUCKET/erp_db_$TIMESTAMP.dump" --sse AES256

# 3. Clean up local backups older than 7 days
find $BACKUP_DIR -type f -name "*.dump" -mtime +7 -delete

echo "[$(date)] Backup completed successfully!"
```

```bash
# Add to Crontab for Daily Execution
crontab -e
# 0 2 * * * /usr/local/bin/backup-erp-db.sh >> /var/log/erp-backup.log 2>&1
```

---

## 3. Disaster Recovery & Emergency Restore Procedure

In the event of database corruption or data loss, follow this step-by-step restoration workflow:

### Step 1: Stop Application Traffic
```bash
pm2 stop educationspace-erp
```

### Step 2: Retrieve Targeted Backup File
```bash
aws s3 cp s3://educationspace-backups/daily/erp_db_TARGET_TIMESTAMP.dump /var/backups/educationspace/restore.dump
```

### Step 3: Recreate Clean Database Scheme
```bash
sudo -u postgres dropdb educationspace_db
sudo -u postgres createdb -O erp_user educationspace_db
```

### Step 4: Execute Database Restore
```bash
pg_restore -U erp_user -d educationspace_db -v /var/backups/educationspace/restore.dump
```

### Step 5: Verify Data Integrity & Restart System
```bash
# Run Prisma Health Check
npx prisma db execute --script "SELECT count(*) FROM \"Student\";"

# Restart Application
pm2 restart educationspace-erp
```

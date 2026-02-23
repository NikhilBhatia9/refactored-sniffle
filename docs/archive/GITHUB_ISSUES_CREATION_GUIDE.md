# How to Create GitHub Issues from Templates

This guide helps you create the 38 GitHub issues from IMPLEMENTATION_ISSUES.md.

## Quick Method (Recommended)

### Option 1: Manual Creation (Best Control)

1. **Go to your repository**: https://github.com/NikhilBhatia9/refactored-sniffle
2. **Click "Issues" tab**
3. **Click "New Issue"** button
4. **For each issue in IMPLEMENTATION_ISSUES.md**:
   - Copy the issue title
   - Copy the entire description
   - Add the labels mentioned
   - Set milestone to "Alpha Oracle 2.0"
   - Click "Submit new issue"

### Option 2: Using GitHub CLI (Fastest)

If you have `gh` CLI installed:

```bash
# First, create labels
gh label create "migration" --color "0052CC" --description "Migration to TypeScript + Supabase"
gh label create "week-1" --color "1D76DB" 
gh label create "week-2" --color "0E8A16"
gh label create "week-3" --color "FFA500"
gh label create "week-4" --color "E99695"
gh label create "backend" --color "5319E7"
gh label create "frontend" --color "BFD4F2"
gh label create "database" --color "006B75"
gh label create "devops" --color "D4C5F9"
gh label create "setup" --color "C2E0C6"
gh label create "testing" --color "FBCA04"
gh label create "production" --color "D93F0B"
gh label create "security" --color "B60205"
gh label create "ui" --color "C5DEF5"
gh label create "api" --color "0075CA"
gh label create "performance" --color "FEF2C0"
gh label create "bugfix" --color "EE0701"
gh label create "enhancement" --color "84B6EB"
gh label create "documentation" --color "0075CA"
gh label create "critical" --color "B60205"

# Create milestone
gh milestone create "Alpha Oracle 2.0" --due-date "2024-03-18" --description "Migration to TypeScript + Supabase"

# Then create each issue (example for Issue #1)
gh issue create \
  --title "Create Supabase Projects (Production & Staging)" \
  --body "$(cat issue-1.md)" \
  --label "migration,week-1,database,setup" \
  --milestone "Alpha Oracle 2.0"
```

## Step-by-Step Manual Creation

### Step 1: Create Labels

Go to: `https://github.com/NikhilBhatia9/refactored-sniffle/labels`

Create these labels (click "New label"):

| Label | Color | Description |
|-------|-------|-------------|
| migration | 0052CC | Migration to TypeScript + Supabase |
| week-1 | 1D76DB | Week 1 tasks |
| week-2 | 0E8A16 | Week 2 tasks |
| week-3 | FFA500 | Week 3 tasks |
| week-4 | E99695 | Week 4 tasks |
| backend | 5319E7 | Backend development |
| frontend | BFD4F2 | Frontend development |
| database | 006B75 | Database work |
| devops | D4C5F9 | DevOps and deployment |
| setup | C2E0C6 | Setup and configuration |
| testing | FBCA04 | Testing tasks |
| production | D93F0B | Production deployment |
| security | B60205 | Security related |
| ui | C5DEF5 | UI/UX work |
| api | 0075CA | API development |
| performance | FEF2C0 | Performance optimization |
| bugfix | EE0701 | Bug fixes |
| enhancement | 84B6EB | Enhancements |
| documentation | 0075CA | Documentation |
| critical | B60205 | Critical priority |

### Step 2: Create Milestone

Go to: `https://github.com/NikhilBhatia9/refactored-sniffle/milestones`

Click "New milestone":
- **Title**: Alpha Oracle 2.0
- **Due date**: [4 weeks from today]
- **Description**: Migration to TypeScript + Supabase (Option A)

### Step 3: Create Issues

For each issue from IMPLEMENTATION_ISSUES.md:

#### Issue #1: Create Supabase Projects

1. Go to Issues → New Issue
2. **Title**: `Create Supabase Projects (Production & Staging)`
3. **Description**:
```markdown
Set up Supabase projects for both staging and production environments.

**Dependencies**: None  
**Estimated Time**: 2 hours

## Tasks

- [ ] Create Supabase account (if not exists)
- [ ] Create production Supabase project
  - Name: `alpha-oracle-prod`
  - Region: Select closest to users
  - Plan: Free tier initially
- [ ] Create staging Supabase project
  - Name: `alpha-oracle-staging`
  - Same region as production
  - Plan: Free tier
- [ ] Document project URLs and API keys
- [ ] Save credentials securely (use password manager/1Password)
- [ ] Create `.env.example` file with Supabase config placeholders

## Acceptance Criteria

- [ ] Both projects created and accessible
- [ ] API keys and URLs documented
- [ ] `.env.example` updated with Supabase variables

## Resources

- IMPLEMENTATION_GUIDE.md (Phase 1)
- https://supabase.com/docs/guides/getting-started
```

4. **Labels**: `migration`, `week-1`, `database`, `setup`
5. **Milestone**: Alpha Oracle 2.0
6. **Assignees**: Assign to appropriate team member
7. Click "Submit new issue"

**Repeat for all 38 issues** (copy/paste from IMPLEMENTATION_ISSUES.md)

### Step 4: Create Project Board (Optional)

1. Go to Projects → New Project
2. Choose "Board" template
3. Name it "Alpha Oracle 2.0 Migration"
4. Add all 38 issues to the board
5. Organize into columns:
   - **Backlog**: All issues
   - **Week 1**: Issues #1-10
   - **Week 2**: Issues #11-18
   - **Week 3**: Issues #19-26
   - **Week 4**: Issues #27-38
   - **In Progress**: Currently being worked on
   - **In Review**: Waiting for review
   - **Done**: Completed

## Quick Copy Template

Use this template for faster issue creation:

```markdown
[Copy issue title from IMPLEMENTATION_ISSUES.md]

[Copy full description from IMPLEMENTATION_ISSUES.md]

---

**Issue Number**: #[X]
**Week**: [1-4]
**Estimated Time**: [X hours]
**Dependencies**: [Issue numbers or "None"]
```

## Tips for Efficient Creation

1. **Open two browser tabs**:
   - Tab 1: IMPLEMENTATION_ISSUES.md on GitHub
   - Tab 2: New Issue page

2. **Use browser extensions**:
   - Clipboard manager for quick paste
   - Form filler for repeated fields

3. **Create in batches**:
   - Do Week 1 issues first (10 issues)
   - Then Week 2 (8 issues)
   - Then Week 3 (8 issues)
   - Finally Week 4 (12 issues)

4. **Review before submitting**:
   - Check labels are correct
   - Check milestone is set
   - Check dependencies are mentioned

## Automation Script (Advanced)

If you're comfortable with scripting, create individual markdown files for each issue:

```bash
# Create directory
mkdir -p .github/ISSUE_TEMPLATES

# Split IMPLEMENTATION_ISSUES.md into 38 files
# Then use gh CLI to create all at once
for i in {1..38}; do
  gh issue create \
    --body-file ".github/ISSUE_TEMPLATES/issue-$i.md" \
    --label "$(get_labels $i)" \
    --milestone "Alpha Oracle 2.0"
done
```

## Verification

After creating all issues:

- [ ] All 38 issues created
- [ ] All issues have correct labels
- [ ] All issues assigned to milestone
- [ ] Dependencies documented in each issue
- [ ] Project board set up (optional)
- [ ] Team members assigned

## Next Steps After Issue Creation

1. **Week 1 Planning**:
   - Assign Issues #1-10 to team members
   - Set up daily standups
   - Review dependencies

2. **Start Implementation**:
   - Begin with Issue #1
   - Update MIGRATION_CHECKLIST.md
   - Track progress in project board

3. **Communication**:
   - Share project board with team
   - Set up notifications
   - Schedule weekly reviews

---

**Ready to create the issues!** 🚀

Choose your method above and get started. The manual method takes about 2-3 hours but gives you full control. The CLI method is faster if you're comfortable with command line.

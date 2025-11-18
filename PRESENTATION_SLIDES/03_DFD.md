# SLIDE 3: DATA FLOW DIAGRAM (DFD)

## Level 0 DFD (Context Diagram)

```
External Entities:
- Candidate
- Recruiter  
- Admin

Central System: AI-Powered Job Portal

Data Flows:
Candidate → System: Resume, Job Applications, Profile Data
System → Candidate: Job Matches, Interview Schedules, Notifications

Recruiter → System: Job Postings, Interview Schedules, Status Updates
System → Recruiter: Applications, Match Scores, Analytics

Admin → System: User Management, System Settings
System → Admin: Audit Logs, System Reports
```

---

## Level 1 DFD (Main Processes)

### Process 1: User Authentication
**Input:** Login credentials
**Process:** Validate user, generate JWT token
**Output:** Access token, user role
**Data Store:** Users Database

### Process 2: Resume Processing
**Input:** Resume file (PDF/DOCX)
**Process:** Parse resume using NLP, extract information
**Output:** Structured resume data
**Data Store:** Resumes Database

### Process 3: Job Matching
**Input:** Resume data, Job requirements
**Process:** Semantic similarity calculation, skill matching
**Output:** Match scores, recommendations
**Data Store:** Jobs Database, Matches Database

### Process 4: Application Management
**Input:** Job application, Resume ID
**Process:** Create application, calculate match score
**Output:** Application confirmation, tracking info
**Data Store:** Applications Database

### Process 5: Interview Scheduling
**Input:** Application ID, Interview details
**Process:** Create interview, send notifications
**Output:** Interview confirmation
**Data Store:** Interviews Database

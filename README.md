🏛️ AUCHITYA — Justice-Tech Platform
Addressing Hackathon Problem Statement: PKPLG03 — Delays in Justice System
📌 Overview

Auchitya is a Justice-Tech platform built to solve:

[PKPLG03] “Delays in Justice System: Case backlogs cause prolonged trials. How can technology streamline case management, research, and dispute resolution?”

The platform reduces adjournments and streamlines readiness by providing:

Role-based dashboards (Judge, Lawyer, Staff)

Case readiness scoring

Lawyer & witness confirmation system

Document readiness tracking

Automated SMS notifications

Research-friendly case metadata

A clean, modern UI with shadcn/ui + Tailwind

🎯 Product Goals
Primary Goals

Reduce delay-causing adjournments

Ensure cases are ready before hearings

Enable judges to see readiness at a glance

Improve coordination between lawyers, staff, and witnesses

Secondary Goals

Improve document completeness

Increase lawyer accountability

Provide structured, searchable case data

⚙️ Core Features
🔐 Authentication & RBAC

Secure registration with:

Name, Email, Phone, Strong Password (12+ chars)

Role: Judge | Lawyer | Staff

OTP verification via Twilio SMS

JWT Access Token (15 min)

HttpOnly Refresh Token

Strict role-based route protection

📊 Case Readiness Scoring (CRS)
CRS = 40% Lawyer Confirmation
     + 30% Witness Confirmation
     + 30% Document Readiness

Score	Status
≥ 80	🟢 Ready
50–79	🟡 Partial
< 50	🔴 High Risk

API:

GET /cases/readiness/:id

📁 Document Readiness System

Court staff can track document completeness:

Affidavits

Evidence

ID proofs

Summons status

Other court-required documents

Readiness contributes to the CRS.

📞 Lawyer & Witness Confirmation System

Lawyer can Confirm / Decline the hearing

Witnesses receive attendance reminders

Staff can trigger SMS notifications

Impacts readiness scoring

✍️ Research & Case Insights (Non-AI)

Auto case categorization

Priority flags

Summaries based on stored metadata

Searchable case database

🧑‍⚖️ Role-Based Dashboards
1️⃣ Judge Dashboard

Case readiness table

Drag-and-drop cause-list builder

Case detail drawer:

Parties

Documents

Readiness breakdown

Assigned lawyer

High-risk case identification

2️⃣ Lawyer Dashboard

Reputation metrics:

Confirmation rate

No-shows

Response speed

Upcoming hearings

Confirmation workflow

Past hearings history

Document view

3️⃣ Court Staff Dashboard

Document readiness management

Witness info updates

Trigger reminders

Hearing schedule view

🗄️ Database Model (Neon + Drizzle)
shared.users

id, name, email, phone

password_hash

role

verified

shared.cases

case_number

title

category

court_type

lawyer_confirmation

witness_confirmation

document_status

readiness_score

hearing_date/time

shared.documents

case_id

checklist_item

is_ready

shared.confirmations

lawyer_id

case_id

status

lawyers.lawyer_metrics

confirmation_rate

no_shows

avg_response_time

📦 Mock Data (1,000 Cases)

On first backend startup:

Generate 1,000 realistic cases

Assign random lawyers

Future hearing dates

Random document readiness

Random confirmations

Pre-calculate CRS

Created in Neon PostgreSQL using Drizzle ORM.

🎨 UI/UX Guidelines
Using:

React (Vite)

shadcn/ui (mandatory)

TailwindCSS

React Query

React Router

Color Palette (must apply globally):
Element	Hex
Navbar	#1F3A5F
Sidebar	#FFFFFF
Primary Button	#1F3A5F
Secondary Button	#C9A227
Danger Button	#DC2626
Cards	#FFFFFF
Page Background	#F9FAFB
Text	#111827
Muted Text	#4B5563
🔧 Technology Stack
Frontend

React

TypeScript

TailwindCSS

shadcn/ui

React Query

Backend

Node.js + TypeScript

Express.js or Fastify

Drizzle ORM

Twilio SMS for OTP & reminders

JWT Auth

Database

Neon PostgreSQL

DevOps

Dockerfiles (backend + frontend)

docker-compose.yml

Environment config

🚀 Deployment Requirements
Layer	Platform
Frontend	Vercel
Backend	Railway / Render
Database	Neon PostgreSQL
📈 Success Metrics (KPIs)
KPI	Target
Adjournment reduction	30–50%
Document readiness	90%+
Lawyer confirmation rate	80%+
Case readiness improvement	40%+
Dashboard load time	< 2 seconds
⚠️ Risks & Mitigation
Risk	Mitigation
Lawyers ignoring updates	Auto SMS reminders
Incomplete documents	Mandatory checklist
Low staff adoption	Simple, minimal-training UI
Scaling issues	Efficient database queries + pagination
🛣️ Roadmap
Phase 1 (Hackathon)

OTP Auth (Twilio)

RBAC

3 Dashboards

Readiness Engine

Mock Data

Notifications

Cause List Builder

Phase 2 (Pilot)

Integration with eCourts

Advanced analytics

Lawyer ranking system

Phase 3 (Scale-Up)

AI-based:

Document extraction

Case summarization

Predictive adjournment modeling

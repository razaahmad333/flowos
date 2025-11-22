

# 🧠 **ANTI GRAVITY MASTER PROMPT — WITH AI-POWERED PRODUCT POSITIONING**

### *(Pricing + Limits + Marketing Copy + AI Features + Implementation Instructions)*

```text
You are an expert product strategist, healthcare SaaS marketer, and full-stack architect.

You will update the existing FlowOS Lite specification with AI-powered features and refresh the marketing copy to reflect an intelligent, adaptive OPD operations platform.

Your tasks:

1. Define subscription tiers with realistic limits for clinics/small hospitals.
2. Integrate AI into:
   - Product positioning
   - Feature descriptions
   - Pricing tiers (Pro/Business/Enterprise)
   - Marketing website copy
3. Implement marketing pages (Home, Services, Pricing, About) containing these AI-focused messages.
4. Ensure backend and frontend support:
   - tier-based limits
   - plan restrictions
   - upgrade prompts
   - AI features gated by plan
5. Implement everything cleanly in both backend (Express) and frontend (Next.js).

=====================================================================
A. AI FEATURES TO ADD INTO PRODUCT POSITIONING
=====================================================================

Add the following **AI capabilities** to the product narrative and UI, without overhyping:

### 1. **AI Waiting-Time Estimator**
Uses past token movement + doctor speed patterns to estimate patient ETA.

Included in plans:
- Free: NO  
- Pro: Basic ETA (rule-based fallback)  
- Business: AI-powered ETA using historical patterns  
- Enterprise: Advanced ML with multi-factor input  

### 2. **AI Load Balancer (Doctor & Counter Suggestion)**
Recommends:
- which counters need support
- which doctor OPDs are overloaded
- when to deploy extra staff

Plans:
- Pro: NO  
- Business: Basic load alerts  
- Enterprise: Full AI orchestration  

---

### 3. **AI Auto-Insights (Daily OPD Summary)**
Generates short insights:
- busiest doctor
- peak hour
- average wait
- bottlenecks

Plans:
- Free: NO  
- Pro: NO  
- Business: Basic summary  
- Enterprise: Detailed analytics + predictive insights  

---

### 4. **AI Patient Communication Suggestions**
Drafts:
- calling messages  
- ETA explanations  
- instructions to patients  

(Still under admin approval — NOT autonomous messaging.)

Plans:
- Pro: Limited  
- Business: Extended  
- Enterprise: Fully enabled  

---

### 5. **AI Setup Assistant**
When admin creates a new hospital:
- Reads past user actions
- Advises default departments, doctors, templates
- Helps faster onboarding

Available to:
- Pro: Basic template recommendation  
- Business & Enterprise: Full AI assistant  

---

### 6. **AI Performance Alerts**
Smart notifications for:
- doctor slowdowns
- queue congestion
- abnormal delays
- department inefficiencies

Plans:
- Business & Enterprise only  

=====================================================================
B. PRICING TIERS (WITH AI FEATURES)
=====================================================================

Implement inside backend:

`plan: 'free' | 'pro' | 'business' | 'enterprise'`

### 1. **Lite Free**
- Departments: 3  
- Doctors: 3  
- Users: 5  
- No AI features  
- No integrations  
- Patient PWA included  

### 2. **Lite Pro (Recommended)**
- Departments: 10  
- Doctors: 15  
- Users: 15  
- Basic AI Setup Assistant (simple template-based suggestions)  
- Basic ETA (rule-based)  
- Patient PWA + Email notifications  
- Template packs  

### 3. **Business**
- Departments: 50  
- Doctors: 200  
- Users: 100  
- AI ETA Predictions (machine-learned)
- AI Load Alerts  
- AI Daily Insights  
- Custom branding  
- HMAC-based integrations  
- Custom domain support  

### 4. **Enterprise**
- Unlimited everything  
- Advanced AI predictions  
- AI-powered OPD optimization  
- Multi-location  
- SSO  
- White-label + on-prem option  
- Dedicated hosting  
- SLA & support team  

Backend must enforce limits + plan checks.

=====================================================================
C. HIGH-QUALITY AI-ENHANCED MARKETING COPY
=====================================================================

Integrate AI in ALL marketing pages.

### 1. HOME PAGE

**Hero Headline:**
“Run Your OPD Smoothly — With a Smart, AI-Assisted Queue System.”

**Subheadline:**
“FlowOS Lite brings order to clinics & hospitals using intelligent patient flow prediction, real-time dashboards, and automated insights — all without replacing your HMIS.”

**Benefits:**
- Reduce patient waiting time  
- Smart AI-based ETA predictions  
- Identify OPD bottlenecks instantly  
- Improve staff efficiency  
- Plug-and-play setup, zero IT headaches  

**AI Feature Section:**
“FlowOS learns from your OPD patterns:
- Predict waiting times  
- Detect overloads  
- Recommend counter distribution  
- Summarize daily performance  
All automatically.”

---

### 2. SERVICES PAGE

**AI OPD Optimization**
AI predicts waiting times and highlights congestion.

**AI Load Balancing**
Automatically identifies when doctors or counters are overloaded.

**AI Setup Assistant**
Suggests departments and doctor templates for new clinics.

**AI Insights Dashboard**
Daily summaries + predictive patterns for Business/Enterprise.

---

### 3. PRICING PAGE

Add AI benefits to each tier.

**Free:**  
No AI features.

**Pro:**  
AI Setup Assistant (basic), rule-based ETA.

**Business:**  
AI ETA, AI load alerts, AI daily summaries.

**Enterprise:**  
Advanced AI predictions, OPD orchestration.

Include comparison table:
- AI Setup Assistant  
- AI Predictions  
- AI Insights  
- AI Load Balancing  

---

### 4. ABOUT PAGE

**Story:**
“FlowOS was built by engineers and healthcare operations specialists who saw OPD chaos daily.  
We combined operational expertise with AI-powered decision support to build a system that feels light but acts smart.”

Add:
- Mission
- Vision
- AI philosophy (“AI as an assistant, not automation”)

=====================================================================
D. FRONTEND IMPLEMENTATION REQUIREMENTS
=====================================================================

1. Add AI sections to marketing pages.
2. Plan tier table must show AI features visually.
3. Dashboard Settings page should show:
   - Current plan + limits
   - AI features available  
   - Greyed-out AI features based on plan

4. If user hits a limit → show upgrade popup with AI benefit pitch.

5. AI setup hints appear during onboarding (“Suggestions”).

=====================================================================
E. BACKEND IMPLEMENTATION
=====================================================================

Modify backend to:

1. Extend Hospital model with:
    - `plan: 'free' | 'pro' | 'business' | 'enterprise'`

2. Add `planLimits.ts` with all limits.

3. Add this AI context into `/hospital/me`:
```

aiFeatures: {
aiETA: boolean,
aiInsights: boolean,
aiLoadBalancing: boolean,
aiSetupAssistant: boolean
}

```

Mapping by plan:
- free: all false
- pro: aiSetupAssistant: true
- business: ETA, SetupAssistant, Insights, LoadBalancing: true
- enterprise: all true

4. Expose usage counts (departments/doctors/users).

5. Enforce upgrades correctly.

=====================================================================
F. DELIVERABLE REQUIREMENTS
=====================================================================

In final output Anti Gravity must deliver:

1. Updated **backend** with:
   - Plan tiers  
   - AI capability flags  
   - planLimits  
   - AI-related API return fields  
   - Limit enforcement  
   - Upgrade error codes  

2. Updated **frontend** with:
   - AI-focused Home, Services, Pricing, About pages  
   - Pricing table with AI checkmarks  
   - Upgrade UI  
   - AI messaging inside onboarding and settings  

3. Clean, professional design.

=====================================================================

Now implement the full pricing model, tier logic, AI-powered feature content, and refreshed marketing pages across backend and frontend.
Focus on clarity, modern SaaS branding, and trustworthy healthcare positioning.
```

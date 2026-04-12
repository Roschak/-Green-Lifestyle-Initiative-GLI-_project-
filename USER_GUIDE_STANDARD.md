# GLI Platform - User Guide
## Green Lifestyle Initiative | Complete User Documentation

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Features](#user-features)
4. [Admin Features](#admin-features)
5. [FAQ & Troubleshooting](#faq--troubleshooting)
6. [Tips & Best Practices](#tips--best-practices)
7. [Support](#support)
8. [Glossary](#glossary)

---

## Introduction

### What is GLI Platform?

**GLI (Green Lifestyle Initiative)** adalah platform web yang memudahkan Anda untuk melacak, berbagi, dan mendapatkan penghargaan atas aksi lingkungan nyata. Platform ini menggabungkan gamifikasi (poin, medal, level) dengan sistem verifikasi untuk memastikan setiap aksi ramah lingkungan adalah genuine dan berdampak.

### Key Features

- 🎯 **Action Tracking**: Lapor aksi hijau Anda dengan bukti foto
- 🏆 **Gamification**: Poin, medal, level, dan leaderboard
- 🎪 **Event Management**: Ikuti event lingkungan dan dapatkan medal
- 👥 **Community**: Lihat ranking komunitas dan berbagi pencapaian
- 📊 **Analytics**: Admin monitoring & statistics

### System Requirements

| Requirement | Details |
|------------|---------|
| **Browser** | Chrome, Firefox, Safari, Edge (latest version) |
| **Internet** | Min 1 Mbps connection |
| **Device** | Desktop, Tablet, or Smartphone |
| **Storage** | 50MB free space (for caching) |

### Supported Languages

- 🇮🇩 Indonesian (Bahasa Indonesia) - Primary
- 🇬🇧 English - Coming Soon v1.1

---

## Getting Started

### 1. Create Account

#### Option A: Email & Password

```
1. Visit https://gli-project-web.web.app
2. Click "Register" or "Daftar"
3. Enter:
   - Email address
   - Password (min 8 char, mix uppercase/lowercase/numbers/symbols)
   - Confirm password
4. Click "Register"
5. Verification email sent to your inbox
6. Verify email link → Account active ✅
```

#### Option B: Google OAuth (Recommended)

```
1. Visit https://gli-project-web.web.app
2. Click "Login dengan Google" / "Sign in with Google"
3. Select your Google account
4. Grant permissions
5. Account automatically created ✅
```

### 2. First Login

**After successful registration:**

```
Dashboard loads with:
├─ Welcome message
├─ Your profile summary
├─ Quick action buttons
├─ Recent activity feed
└─ Getting started tips
```

### 3. Complete Your Profile

| Field | Required | Details |
|-------|----------|---------|
| **Name** | Yes | Min 3 characters |
| **Email** | Yes | Already filled from registration |
| **Avatar** | No | Optional profile picture |
| **Phone** | No | For event notifications |

**How to update profile:**
```
1. Click avatar/profile icon (top right)
2. Select "Profil" / "Profile"
3. Click edit icon
4. Update information
5. Click "Simpan" / "Save"
6. Refresh to see changes ✅
```

### 4. Understand the Dashboard

**Dashboard shows:**

| Widget | Shows | Purpose |
|--------|-------|---------|
| **Poin** | Your total & monthly points | Track progress |
| **Level** | Current level (Newbie/Warrior/Champion) | Achievement status |
| **Medal** | Badges earned | Accomplishment summary |
| **Ranking** | Your position in leaderboard | Compare with others |
| **Aksi Pending** | Actions awaiting approval | Monitor submissions |
| **Recent Aksi** | Latest 5 actions | Quick reference |

---

## User Features

### Feature 1: Submit Green Action (Buat Aksi)

**Purpose:** Report environmental actions with photo evidence

**Access:**
```
Dashboard → "Buat Aksi" button
or
Sidebar → "Buat Aksi"
```

**Step-by-Step:**

```
Step 1: Open Form
├─ Form opens with following fields:
│  ├─ Action Type (dropdown)
│  ├─ Title
│  ├─ Description
│  ├─ Location
│  └─ Photo Upload

Step 2: Select Action Type
├─ Choose from 4 categories:
│  ├─ 💡 Hemat Energi (Save Energy)
│  ├─ 💧 Hemat Air (Save Water)
│  ├─ ♻️ Daur Ulang (Recycling)
│  └─ 🌲 Tanam Pohon (Plant Trees)

Step 3: Fill Details
├─ Title: "Hemat Energi Rumah Saya" (example)
├─ Description: Explain what you did
├─ Location: Where did you do it (optional)

Step 4: Upload Photo
├─ Click "Choose File"
├─ Select image from device
├─ Supported: JPG, PNG, JPEG
├─ Max size: 5MB
├─ Photo preview shows

Step 5: Submit
├─ Check terms & conditions
├─ Click "SUBMIT"
├─ Loading spinner shows
├─ Success message appears ✅
└─ Action now in "PENDING" status

Step 6: Wait for Approval
├─ Admin reviews action (1-2 hours typical)
├─ You receive notification when approved/rejected
├─ Poin added to account if approved
└─ Medal automatically awarded ✅
```

**Photo Requirements:**

| Criteria | Good ✅ | Bad ❌ |
|----------|--------|-------|
| **Clarity** | Clear, bright, sharp focus | Blur, dark, low res |
| **Content** | Shows actual action | Just result, no action visible |
| **Relevance** | Related to category | Unrelated/random |
| **Source** | Your own photo | From internet |
| **Size** | Under 5MB | Over 5MB |
| **Format** | JPG/PNG/JPEG | Other formats |

**Example Actions:**

```
HEMAT ENERGI:
- Photo of switching off lights
- Photo of solar panel installation
- Photo of LED bulbs replacement

HEMAT AIR:
- Photo of fixing water leak
- Photo of water-saving faucet
- Photo of rainwater harvesting setup

DAUR ULANG:
- Photo of trash separation
- Photo of compost pile
- Photo of recycled items being used

TANAM POHON:
- Photo of tree planting activity
- Photo of tree you planted/care for
- Photo of tree sapling you maintained
```

---

### Feature 2: View Action History (Riwayat Aksi)

**Purpose:** Track all your submitted actions and their status

**Access:**
```
Sidebar → "Riwayat"
or
Dashboard → Click on "Lihat Riwayat"
```

**What You'll See:**

| Column | Information |
|--------|-------------|
| **Tanggal** | When action was submitted |
| **Tipe Aksi** | Action category |
| **Judul** | Your action title |
| **Status** | Pending/Approved/Rejected |
| **Poin** | Points earned (if approved) |
| **Aksi** | View details button |

**Status Explanations:**

```
⏳ PENDING (Menunggu)
├─ Action submitted, awaiting admin review
├─ Typical duration: 1-2 hours
├─ You can submit more actions while waiting
└─ Notification sent when reviewed

✅ APPROVED (Disetujui)
├─ Admin verified your action
├─ Poin added to your account
├─ Medal automatically awarded
├─ Shows in leaderboard
└─ Poin shown in this row

❌ REJECTED (Ditolak)
├─ Admin found issues with action/photo
├─ Reason provided in details
├─ No poin awarded
├─ You can submit again with improvements
└─ Read feedback carefully
```

**How to View Details:**

```
1. Click "View" or pencil icon on action row
2. Detailed view opens showing:
   ├─ Photo (enlarged)
   ├─ Title & description
   ├─ Location
   ├─ Submission date
   ├─ Admin feedback (if available)
   ├─ Points awarded
   └─ Medal earned (if applicable)
3. Click "Back" to return to list
```

---

### Feature 3: View Leaderboard (Peringkat)

**Purpose:** See your ranking among other users

**Access:**
```
Sidebar → "Peringkat"
or
Dashboard → "Lihat Leaderboard"
```

**How It Works:**

```
Ranking System:
├─ Based on: MONTHLY POINTS
├─ Calculated: Sum of approved actions this month
├─ Display: Top 10 users
├─ Reset: Every month (1st of month)
└─ Visibility: Only users with poin > 0
```

**Leaderboard Table:**

| Rank | Name | Points | Medal | Level |
|------|------|--------|-------|-------|
| 🥇 1 | Ahmad | 500 | 3 | Eco-Champion |
| 🥈 2 | Siti | 450 | 2 | Eco-Warrior |
| 🥉 3 | Budi | 400 | 2 | Eco-Warrior |
| 4 | Citra | 350 | 2 | Eco-Warrior |
| 5 | Deni | 300 | 1 | Eco-Warrior |

**Your Position:**

```
If your rank is within top 10:
├─ Highlighted in green
├─ Shows your exact position
├─ Compare points with others
└─ Use as motivation

If your rank is beyond top 10:
├─ Says "You are ranked #X"
├─ Shows how many points until top 10
└─ Submit more actions to climb
```

---

### Feature 4: Collect Medals (Kumpulkan Medal)

**Purpose:** Earn badges for completing actions in each category

**Medal Types:**

| Type | Requirement | Icon |
|------|------------|------|
| **Pahlawan Energi** | 1+ approved "Hemat Energi" action | ⚡ |
| **Hemat Air** | 1+ approved "Hemat Air" action | 💧 |
| **Daur Ulang** | 1+ approved "Daur Ulang" action | ♻️ |
| **Penanam Pohon** | 1+ approved "Tanam Pohon" action | 🌲 |

**How to Earn:**

```
Process:
1. Submit action in a category
2. Admin approves action ✅
3. Medal automatically awarded
4. Medal appears in your profile
5. Shows on leaderboard
6. Can be earned multiple times if same action = 1 medal per category
```

**View Your Medals:**

```
1. Go to Profile
2. Scroll to "Koleksi Medal"
3. See all medals earned
4. Click medal to see:
   ├─ Medal name & description
   ├─ Date earned
   ├─ Related action
   └─ Points contribution
```

---

### Feature 5: Participate in Events (Ikuti Event)

**Purpose:** Join environmental events and earn medals

**Access:**
```
Sidebar → "Event"
or
Dashboard → "Event" section
```

**Browse Events:**

```
Step 1: View Event List
├─ Shows upcoming events
├─ Filter by status:
│  ├─ 🟢 Dibuka (Open for registration)
│  ├─ 🟡 Sedang Berlangsung (Ongoing)
│  └─ 🔴 Selesai (Finished)
└─ Search by name/location

Step 2: View Event Details
├─ Click event card to expand
├─ Shows:
│  ├─ Event title & description
│  ├─ Date & time
│  ├─ Location & address
│  ├─ Medal available
│  ├─ Participant count
│  ├─ Registration deadline
│  └─ Host contact (WhatsApp)

Step 3: Register for Event
├─ Click "Daftar" / "Register"
├─ Form appears:
│  ├─ Name (auto-filled)
│  ├─ Email (auto-filled)
│  ├─ Phone number (required)
│  └─ Are you GLI member? (Yes/No)
├─ Check confirmation box
├─ Click "Daftar" ✅
└─ WhatsApp link provided

Step 4: Join WhatsApp Group
├─ Click WhatsApp link
├─ Confirm to open WhatsApp
├─ Join group chat
├─ Follow host instructions
└─ Get event updates & reminders

Step 5: Attend Event
├─ Go to event location at scheduled time
├─ Participate in activities
├─ Follow host instructions
└─ Take photo as proof of participation

Step 6: Upload Proof
├─ After event, go back to app
├─ Find event in list
├─ Click "Upload Bukti" / "Upload Proof"
├─ Select your participation photo
├─ Add caption (optional)
├─ Click "Upload" ✅
└─ Awaits admin verification

Step 7: Get Medal
├─ Admin reviews proof
├─ If approved: Medal awarded ✅
├─ Notification sent to you
├─ Medal appears in profile
└─ Event completed!
```

**Event Types:**

| Type | Example | Medal |
|------|---------|-------|
| **Cleaning** | Beach cleanup, park cleaning | 🌱 Pembersih |
| **Seminar** | Environmental workshop | 📚 Edukator |
| **Tree Planting** | Mass planting activity | 🌲 Penanam |
| **Service** | Community environmental service | 💚 Hati Mulia |

---

### Feature 6: Edit Profile (Ubah Profil)

**Purpose:** Update personal information and photo

**Access:**
```
Click avatar (top right)
→ Select "Profil"
or
Sidebar → "Profil"
```

**Edit Name:**

```
1. In profile page, find "Nama" field
2. Click edit icon (✏️) next to name
3. Name field becomes editable
4. Clear old name
5. Type new name (min 3 characters)
6. Click "Simpan" / "Save"
7. Name updated ✅
8. Page refreshes automatically
```

**Upload Avatar:**

```
1. Hover over current avatar/photo
2. Upload icon appears (📷)
3. Click icon
4. File picker opens
5. Select image from device
6. Supported: JPG, PNG, JPEG
7. Max size: 5MB
8. Photo auto-resizes
9. Saves automatically ✅
```

**Photo Tips:**

```
✅ GOOD PROFILE PHOTO:
- Clear, well-lit face photo
- Neutral/smiling expression
- Simple background
- Professional appearance
- Recent photo

❌ AVOID:
- Blurry or dark photos
- Group photos
- Selfies at odd angles
- Completely different person
- Outdated photos
```

**Profile Information Shown:**

```
├─ Avatar (with upload option)
├─ Name (with edit option)
├─ Email (read-only)
├─ Phone (with edit option)
├─ Total Points (all-time)
├─ Monthly Points (current month)
├─ Current Level
├─ Ranking Position
├─ Total Actions Submitted
├─ Medal Collection
└─ Join Date
```

---

## Admin Features

### Admin 1: Dashboard Overview

**Access:** Login as admin → Dashboard automatically shows admin view

**Dashboard Components:**

```
Header Section:
├─ Welcome message: "Welcome Admin [Name]"
├─ Quick stats:
│  ├─ Total Users: XXX
│  ├─ Total Actions: XXX
│  ├─ Pending Actions: XX
│  └─ Events: XX

Traffic Chart (7 days):
├─ X-axis: Days (Mon-Sun)
├─ Y-axis: Activity count
├─ Shows trend line
├─ Filter options: Day/Week/Month/Year
└─ Insights: "Traffic up/down compared to last week"

Top 5 Performers:
├─ Rank 1-5 users with most points
├─ Shows: Name, Points, Medal count
├─ Indicator: Green if trending up
└─ Comparison with last month

Recent Actions (Last 10):
├─ Table with: User, Type, Status, Date
├─ Action buttons: View, Approve, Reject
├─ Status color coding
└─ Quick access to pending

Statistics Card:
├─ Approval Rate: XX%
├─ Rejection Rate: XX%
├─ Average Points/Action: XX
└─ User Retention: XX%
```

---

### Admin 2: Verify Actions (Moderasi)

**Purpose:** Review and approve/reject submitted actions

**Access:**
```
Sidebar → "Moderasi"
or
Dashboard → "Pending Actions" → "View All"
```

**Workflow:**

```
Step 1: Browse Pending Actions
├─ See list of all pending actions
├─ Sort by: Newest/Oldest/Pending longest
├─ Filter by:
│  ├─ User
│  ├─ Action type
│  └─ Date range
└─ Search function available

Step 2: Select Action to Review
├─ Click action row or "View Detail"
├─ Full action details open:
│  ├─ User info:
│  │  ├─ Name & profile
│  │  ├─ Email
│  │  ├─ Current points
│  │  └─ Previous actions
│  ├─ Action info:
│  │  ├─ Title & description
│  │  ├─ Type
│  │  ├─ Location
│  │  └─ Submission date
│  └─ Photo:
│     ├─ Large view
│     ├─ Zoomable
│     └─ Download option

Step 3: Review Photo
├─ Check if photo shows actual action
├─ Verify relevance to action type
├─ Check photo quality (clear, not fake)
├─ Consider user history
└─ Make decision: Approve or Reject

Step 4: If APPROVE
├─ Enter points (default: 50)
│  └─ Range: 10-100 (adjust based on quality)
├─ Add note (optional):
│  └─ e.g., "Great effort! Keep it up"
├─ Click "SETUJUI" / "Approve"
├─ Process happens:
│  ├─ Points added to user
│  ├─ Medal automatically awarded
│  ├─ Status changed to "APPROVED"
│  ├─ User notified
│  └─ Action removed from pending
└─ Return to pending list

Step 5: If REJECT
├─ Select rejection reason:
│  ├─ "Foto tidak jelas" (Photo not clear)
│  ├─ "Bukan aksi nyata" (Not a real action)
│  ├─ "Sudah pernah" (Duplicate)
│  ├─ "Melanggar kebijakan" (Policy violation)
│  └─ "Alasan lain" (Other)
├─ Add explanation (required):
│  └─ e.g., "The photo doesn't clearly show the energy saving action"
├─ Click "TOLAK" / "Reject"
├─ Process happens:
│  ├─ No points awarded
│  ├─ No medal given
│  ├─ Status changed to "REJECTED"
│  ├─ User receives feedback
│  ├─ User can resubmit
│  └─ Action archived
└─ Return to pending list
```

**Moderation Tips:**

```
✅ APPROVE WHEN:
- Photo clearly shows the action
- Related to claimed action type
- User appears to have done it
- Good quality photo
- No policy violations
- Reasonable effort level

❌ REJECT WHEN:
- Photo is blurry/unclear
- Doesn't show the action
- Wrong category
- Appears to be fake/internet photo
- Policy violation
- Spam submission
- Same photo reused

⏱️ TARGET:
- Review within 1-2 hours
- Don't let pending > 24 hours
- Maintain consistent standards
- Provide clear feedback
```

---

### Admin 3: Monitor Users (Monitoring)

**Purpose:** Track user activity and manage accounts

**Access:**
```
Sidebar → "Monitoring"
```

**User List:**

```
View:
├─ Table with columns:
│  ├─ User ID / Username
│  ├─ Email
│  ├─ Status (🟢 Online / 🔴 Offline)
│  ├─ Last Activity (timestamp)
│  ├─ Total Points
│  ├─ Level
│  └─ Actions (View / Delete / Message)
│
├─ Filter options:
│  ├─ By status (Online/Offline/All)
│  ├─ By level (Newbie/Warrior/Champion)
│  ├─ By points range
│  └─ Search by name/email
│
└─ Pagination:
   ├─ Show 10/25/50 per page
   └─ Total users: XXX
```

**View User Detail:**

```
Click on username to see:

Profile Section:
├─ Avatar
├─ Name
├─ Email
├─ Phone (if provided)
├─ Join date
├─ Last activity timestamp
└─ Current status (Online/Offline)

Statistics:
├─ Total Points (all-time)
├─ Monthly Points (current month)
├─ Level
├─ Ranking Position
├─ Total Actions:
│  ├─ Submitted: XX
│  ├─ Approved: XX
│  ├─ Rejected: XX
│  └─ Pending: XX
├─ Medal Count: XX
└─ Days Active: XX

Action History:
├─ Table showing last 20 actions
├─ Columns: Date | Type | Status | Points
├─ Filter by date range
└─ Export option (CSV)

Medal Collection:
├─ All medals earned
├─ Date earned for each
└─ Display as icons

Admin Actions:
├─ [Reset Monthly Points]
├─ [Add Points Manually]
├─ [Send Message]
└─ [Delete Account]
```

**Auto-Offline System:**

```
HOW IT WORKS:
├─ Every 5 minutes: System checks heartbeat
├─ Heartbeat = User activity
├─ If no activity > 10 minutes → Status = OFFLINE
├─ If activity detected → Status = ONLINE
└─ Shows real-time status

WHAT YOU SEE:
├─ 🟢 Green = Online (active < 10 min)
├─ 🔴 Red = Offline (idle > 10 min)
├─ Timestamp: "Last seen: 5 minutes ago"
└─ Used for notifications & UX
```

---

### Admin 4: Manage Events (Event Admin)

**Purpose:** Create and manage environmental events

**Access:**
```
Sidebar → "Event Admin"
```

**Create New Event:**

```
Step 1: Click [+ NEW EVENT]

Step 2: Fill Basic Information
├─ Title: Event name (e.g., "Beach Cleanup 2026")
├─ Description: Details about event
├─ Location: Where event takes place
├─ Address: Full address for navigation
└─ WhatsApp Link: Group chat link

Step 3: Set Dates
├─ Registration Start: When people can register
├─ Registration End: When registration closes
├─ Event Start: When event begins
├─ Event End: When event finishes
├─ Validation: Start date < End date (required)

Step 4: Set Medal
├─ Medal Name: Select from list
│  ├─ Pembersih (Cleaner)
│  ├─ Edukator (Educator)
│  ├─ Penanam (Planter)
│  └─ Hati Mulia (Kind Heart)
└─ Medal Icon: Auto-selected

Step 5: Create Thumbnail
├─ Option A: Upload Photo
│  ├─ Click "Choose File"
│  ├─ Select image
│  └─ Preview shows
│
└─ Option B: Text + Color
   ├─ Text: Event name or slogan
   ├─ Font Size: Slider 12-48px
   ├─ Background Color: Color picker
   ├─ Text Color: Color picker
   └─ Preview shows live

Step 6: Set Approval Mode
├─ [ ] Auto-approve registrations
│     (if checked → instant approval)
│
└─ [ ] Manual approval required
      (if checked → admin reviews each)

Step 7: Create Event
├─ Click [CREATE EVENT]
├─ Processing...
├─ Success message
└─ Event now visible to users ✅
```

**Manage Event:**

```
Event List:
├─ Shows all events
├─ Status indicators:
│  ├─ 📅 Upcoming (before start)
│  ├─ 🟢 Ongoing (during event)
│  └─ ✅ Ended (after event)
├─ Sort options
└─ Filter options

Click Event to Manage:

Registrations Tab:
├─ Table showing all registrations
├─ Columns: Name | Email | Phone | Status | Date
├─ Status: Registered / Attended / Absent
├─ Bulk actions:
│  ├─ Approve all
│  ├─ Mark as attended
│  └─ Send reminders
└─ Export list (CSV/Excel)

Attendance Tab:
├─ Shows proof photos from attendees
├─ Table: User | Photo | Date | Status
├─ Click photo to enlarge
├─ Actions per submission:
│  ├─ [Approve] → Award medal
│  └─ [Reject] → Reason required
└─ Bulk approve/reject

Leaderboard Tab:
├─ Ranking of event participants
├─ Based on: Attendance + points
├─ Export results
└─ Share options

Analytics Tab:
├─ Registration rate: XX%
├─ Attendance rate: XX%
├─ Medal distribution
└─ Participation chart

Edit Event:
├─ Click [Edit]
├─ Modify details
├─ Save changes
└─ Updates reflected live

Delete Event:
├─ Click [Delete]
├─ Confirm action
├─ Event removed ✅
└─ Registrations archived
```

---

## FAQ & Troubleshooting

### Questions About Accounts

**Q: How do I reset my password?**

A: Currently no self-service password reset. 
- Workaround: Use "Login dengan Google"
- Or email support@gli-project.com with request
- Coming in v1.1

**Q: I have 2 accounts by accident?**

A: This can happen if you registered with email AND Google with same email.
- Use only ONE account
- Email support@gli-project.com to merge accounts
- Admin will consolidate your data

**Q: How do I delete my account?**

A: 
1. Email support@gli-project.com
2. Subject: "Request Delete Account"
3. Include: Email, reason (optional)
4. Admin processes within 7 days
5. All data permanently deleted
6. Note: Cannot be undone

### Questions About Actions

**Q: Why was my action rejected?**

A: Common reasons:
- Photo not clear (blur, too dark, low resolution)
- Action not visible in photo
- Wrong category selected
- Duplicate submission
- Policy violation

Solution:
1. Read feedback in action history
2. Address the specific issue
3. Take a better photo
4. Resubmit ✅

**Q: How long does approval take?**

A: 
- Target: 1-2 hours during business hours
- Hours: 08:00-20:00 WIB (can be 24/7)
- If >24 hours, contact support
- Peak times might be slower

**Q: Can I edit an action after submitting?**

A: 
- No editing after submission
- If rejected: Get feedback → Resubmit new action
- If approved: Cannot change (to maintain integrity)

### Questions About Medals

**Q: Can I get the same medal twice?**

A: 
- No, each medal awarded once per category
- Example: 1 "Hemat Energi" medal only
- But you can submit unlimited actions
- Points accumulate, medals don't

**Q: Where can I see my medals?**

A: 
1. Profile → Scroll to "Koleksi Medal"
2. Click medal for details
3. Shows: Name, description, date earned, related action

**Q: What if I don't see my medal after approval?**

A: 
1. Refresh page (F5)
2. Logout and login
3. Check Profile again
4. If still missing, contact support
5. Check if action truly approved

### Questions About Points & Leaderboard

**Q: How are points calculated?**

A: 
- 1 Approved Action = Points (default 50)
- Admin can adjust: 10-100 points per action
- Based on quality of photo/action
- No points for rejected actions

**Q: Why am I not on the leaderboard?**

A: 
- You need poin > 0
- Requires 1+ approved action this month
- If you have no approved actions this month → not shown
- Submit action and wait for approval

**Q: When does leaderboard reset?**

A: 
- Monthly reset: 1st of each month
- Monthly points reset to 0
- Total points never reset
- Ranking resets when month changes

**Q: Can my ranking go down?**

A: 
- Ranking changes based on other users' actions
- If you don't submit but others do → rank goes down
- If you submit more → rank goes up
- Submit consistently to maintain high rank

### Questions About Events

**Q: How do I join an event?**

A: 
1. Sidebar → Event
2. Find event with 🟢 "Dibuka" status
3. Click event → "Daftar"
4. Fill form: name, email, phone, member status
5. Get WhatsApp link
6. Join WhatsApp group
7. Wait for event date

**Q: How do I know if I was accepted for event?**

A: 
- If auto-approved (instant): Accepted ✅
- If manual approval: Notification when approved
- Check event status in your profile
- Join WhatsApp group for communication

**Q: How do I upload my event attendance proof?**

A: 
1. After event date, open event
2. Click "Upload Bukti"
3. Select photo of you at event
4. Add caption (optional)
5. Click "Upload"
6. Wait for admin verification
7. Medal awarded when approved ✅

**Q: I registered but can't find upload button?**

A: 
- Button appears AFTER event date
- Check event dates in details
- Possible registration closed (check event)
- If button still missing, refresh or contact support

### Questions About Technical Issues

**Q: Website is slow or won't load?**

A: 
1. Check internet connection (min 1 Mbps)
2. Refresh page (F5 or Ctrl+R)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try different browser
5. Try incognito mode
6. Restart device

**Q: Photo won't upload?**

A: 
1. Check file size (max 5MB)
2. Use correct format (JPG, PNG, JPEG)
3. Check internet connection
4. Try smaller resolution image
5. Try different browser
6. Clear cache and try again

**Q: Can't login to account?**

A: 
1. Check email/password for typos
2. Ensure Caps Lock is OFF
3. Try copy-paste credentials
4. Clear browser cache
5. Try incognito mode
6. Try "Login dengan Google"
7. Check if account exists

---

## Tips & Best Practices

### For Maximum Points

```
✅ STRATEGY:
1. Submit consistently (aim 1+ daily)
2. Quality photos (clear, well-lit, shows action)
3. Diverse categories (all 4 types for all medals)
4. Join events (extra poin + medals)
5. Write good descriptions (helps admin understand)

📈 EXAMPLE TIMELINE:
Month 1:
- 20 actions submitted
- 18 approved (90% approval)
- 300 points earned
- 4 medals collected (one from each type)
- Rank: Top 10

Month 2:
- Continue consistency
- 25 actions submitted
- 22 approved
- 400+ points earned
- Rank: Top 5
```

### Photo Quality Tips

```
✅ GOOD PHOTO PRACTICES:
- Take during daylight
- Use natural lighting
- Focus on the action, not background
- Include yourself if possible (trust factor)
- Show both before/after if applicable
- Use smartphone camera (fine quality enough)
- Check focus before submitting

❌ AVOID:
- Dark/night photos
- Blurry shots
- Generic internet images
- Photos from others
- Extreme angles
- Photo effects/filters (keep natural)
- Watermarked images
```

### For Admin: Moderation

```
✅ BEST PRACTICES:
1. Review within 1-2 hours max
2. Be consistent (same standards for all)
3. Give clear feedback when rejecting
4. Encourage resubmission
5. Don't be too strict or too lenient
6. Check user history
7. Prevent fraud/cheating
8. Maintain community trust

⏱️ TARGET:
- Response time: 1-2 hours
- Approval rate: 75-85% (reasonable bar)
- Rejection rate: 15-25% (maintain quality)
- Quality > Quantity
```

---

## Support

### Getting Help

**For Technical Issues:**
```
Email: support@gli-project.com
Response time: Within 24 business hours
Include: 
- Describe problem clearly
- Screenshots if applicable
- Browser & device info
- Steps to reproduce
```

**For Account Issues:**
```
Email: support@gli-project.com
Subject: [ACCOUNT ISSUE] Your issue description

Include:
- Account email
- What went wrong
- When it happened
- Any error messages
```

**For Bug Reports:**
```
Email: support@gli-project.com
Subject: [BUG REPORT] Feature name

Include:
- What you were doing
- Expected vs actual result
- Screenshots
- Device/browser info
- Reproducible steps
```

**For Feedback & Suggestions:**
```
Email: support@gli-project.com
Subject: [FEEDBACK] Your suggestion

We value your input for improvements!
```

### Community Support

**WhatsApp Group:**
```
Join GLI community WhatsApp
- Tips & tricks sharing
- Event announcements
- Support from community
- Admin available during business hours
```

**FAQ Online:**
```
Check GitHub wiki for:
- Common issues
- How-to guides
- Latest updates
- Release notes
```

---

## Glossary

### Action / Aksi
Environmental activity reported with photo proof. Examples: saving energy, water, recycling, planting trees.

### Medal
Digital badge/achievement earned for completing actions in a category. 4 types: Energi, Air, Ulang, Pohon.

### Poin / Points
Numeric reward for approved actions. Used to calculate ranking. Range: 10-100 per action. Monthly and total variations.

### Level
User achievement tier based on total points:
- Eco-Newbie (0-50 poin)
- Eco-Warrior (51-150 poin)
- Eco-Champion (150+ poin)

### Leaderboard / Peringkat
Ranking of users based on monthly points. Top 10 displayed. Resets monthly.

### Event
Community environmental activity organized by admin or users. Has registration period, event date, attendance tracking.

### Medal (Event)
Special badge earned by attending/completing events. Different from action medals.

### Moderation / Moderasi
Process of admin reviewing submitted actions. Approve (award poin + medal) or reject (provide feedback).

### Pending
Status of submitted action awaiting admin review.

### Approved / Disetujui
Action verified by admin. Poin awarded, medal given, visible on leaderboard.

### Rejected / Ditolak
Action found lacking by admin. No poin awarded. User can resubmit.

### Heartbeat
System check (every 5 min) for user activity. Determines online/offline status.

### Monthly Points
Points earned current month. Used for leaderboard ranking. Resets monthly.

### Total Points
Lifetime points. Never resets. Used for level calculation.

### Admin
Special user role with moderation, monitoring, event creation capabilities.

### Gamification
System of points, levels, medals, leaderboards to encourage engagement.

---

## Additional Resources

### Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | Jan 2026 | Initial launch |
| 1.1 | Apr 2026 | Event system, mentoring (coming) |
| 2.0 | Q3 2026 | Mobile app, advanced features (planned) |

### Coming Features (v1.1)

- 💬 Mentoring chat system
- 🔄 Password reset self-service
- 📱 Mobile app version
- 🌐 English language support
- 🏆 Achievement badges

### Contact

**Official Email:** support@gli-project.com  
**GitHub:** [GLI Project](https://github.com/ragah-dirotama/gli-project)  
**Platform URL:** https://gli-project-web.web.app

---

**Document Version:** 2.0  
**Last Updated:** April 2026  
**Status:** Production Ready ✅

---

**Mari Bersama Ciptakan Aksi Nyata untuk Lingkungan Hijau! 🌱**

*Green Lifestyle Initiative | Making Environmental Action Easy & Rewarding*

# Admission Management System - Project Plan
**Timeline:** January 9 - April 25, 2025 (14 weeks)  
**Developer:** Solo student project with learning focus  
**Commitment:** 5-6 hours/week (10 productive weeks, 4 compromised weeks)

---

## PROJECT OVERVIEW

### Problem Being Solved
Replace manual Google Sheets-based admission process for college with a web-based system that:
- Collects student applications and documents digitally
- Enables admin/verifier workflow for application review
- Provides status tracking for students
- Generates statistics and seat confirmation letters

### Target Users & Scale
- **500 students** - Submit applications and documents
- **2-5 admins** - Oversee process, assign verifiers, generate reports
- **10-20 verifiers** - Review assigned applications, add remarks
- **5-10 accounts staff** - Verify fee receipts

### Success Criteria
1. **Primary:** Functional system demonstrable to college administration
2. **Secondary:** Good grade on minor project (evaluated on features, not code quality)
3. **Tertiary:** End-to-end learning experience for resume/interviews

---

## TECHNOLOGY STACK

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **shadcn/ui** for components (accessible, pre-built)
- **React Hook Form + Zod** for form validation
- **Recharts** for analytics visualization

### Backend
- **Next.js API Routes** (no separate Express server)
- **Prisma ORM** for database abstraction
- **NextAuth.js v5** for authentication

### Database & Storage
- **PostgreSQL** (hosted on Supabase free tier)
- **Supabase Storage** for document uploads

### Hosting
- **Vercel** (free tier for Next.js apps)

### Additional Libraries
- **react-pdf** or **puppeteer** for PDF generation
- **Resend** or **Nodemailer** for email notifications

---

## CRITICAL DATES & CONSTRAINTS

### Exam Blackout Periods
- **Week 5 (Feb 6-12):** Pre-midterm week - 5 random quizzes - REDUCED CAPACITY (3-4 hours)
- **Week 6 (Feb 13-21):** Mid-semester exams - COMPLETE BLACKOUT (0 hours)
- **Week 13 (Apr 8-14):** Pre-finals week - 5 random quizzes - EMERGENCY ONLY (2 hours max)
- **Week 14 (Apr 15-25):** End-semester exams - COMPLETE BLACKOUT (0 hours)

### Productive Windows
- **Weeks 1-4:** Full sprint (6 hours/week)
- **Weeks 7-12:** Full sprint (6 hours/week)
- **Total productive weeks:** 10 weeks

---

## DATA COLLECTION REQUIREMENTS

### Student Information Fields
**Basic Details:**
- Name, Date of Birth, Contact Number
- Guardian Name, Guardian Number, Guardian Email
- Candidate Aadhar Number, Religion, Caste Category
- Branch Allotted, Permanent Address, State, Blood Group
- Seat Allotment Source (JOSSA/CSAB)

**Documents Required:**
1. Passport size photo
2. Provisional admission letter (JOSSA/CSAB)
3. Class X marksheet
4. Class XII/Intermediate marksheet
5. JEE rank card/admit card
6. Caste certificate
7. Medical certificate
8. Institute fee payment receipt (SBI collect)
9. Hostel fee payment receipt (SBI collect)
10. Undertaking (student + parents)
11. Class XII performance proof (if below minimum criteria)
12. Aadhar card

**Remarks Field:**
- Text field for student comments/notes

### Analytics Requirements
**Statistics to Generate:**
1. Branch-wise Distribution (sanctioned intake, admitted, vacant, fill rate %)
2. Gender-wise Distribution per branch
3. State-wise Distribution (state, male, female, total)
4. PWD Candidates Distribution (PWD/non-PWD, female, male, total)
5. Category-wise Distribution (category, female, male, total)
6. Category-wise Opening & Closing Rank by branch (General, General-EWS, OBC-NCL, SC, ST)

---

## PHASE-BY-PHASE BREAKDOWN

### PHASE 1: FOUNDATION & CORE TECH (Weeks 1-4)
**Goal:** Master hard technical concepts before mid-sems

### PHASE 1.5: MID-SEM SURVIVAL (Weeks 5-6)
**Goal:** Light features + exam preparation

### PHASE 2: WORKFLOWS & FUNCTIONALITY (Weeks 7-10)
**Goal:** Complete business logic for all user roles

### PHASE 3: ANALYTICS & DEMO PREP (Weeks 11-12)
**Goal:** Statistics dashboard + polish for demonstration

### PHASE 4: FINALS BUFFER (Weeks 13-14)
**Goal:** Emergency bug fixes only, focus on exams

---

## WEEK-BY-WEEK DETAILED PLAN

### **WEEK 1 (Jan 9-15): Dev Environment + Auth Foundation**
**Time Investment:** 6 hours  
**Status:** In Progress

#### Deliverables
- [.] Next.js 14 project setup with TypeScript
- [.] Tailwind CSS + shadcn/ui configured
- [.] Supabase account connected to Prisma
- [.] Basic User schema (id, email, password, role)
- [ ] Login and signup pages (UI only)
- [.] GitHub repository initialized

#### Tasks Breakdown
**Day 1 (1.5 hours):**
- Create Next.js project with TypeScript, Tailwind, App Router
- Install shadcn/ui and initialize with default theme
- Install Prisma, next-auth, bcryptjs

**Day 2-3 (3 hours):**
- Get Supabase PostgreSQL connection string
- Configure Prisma schema with minimal User and StudentProfile models
- Run first migration (`prisma migrate dev --name init`)
- Test database connection with simple query

**Day 4-5 (2.5 hours):**
- Install shadcn components (button, input, form, card)
- Create `/login` and `/signup` page layouts
- Basic form UI (functionality comes later)

**Day 6-7 (2 hours):**
- Configure NextAuth.js with credentials provider
- Set up password hashing with bcryptjs
- Connect NextAuth to Prisma User model
- Test signup → login → protected dashboard flow

#### Learning Focus
- Next.js App Router file structure
- Prisma schema design basics
- Authentication flow (session management)
- Environment variables and security

#### Expected Challenges
- Prisma schema relations
- NextAuth configuration errors
- Supabase connection string format

#### Success Criteria
✅ User can register with email/password  
✅ User can login and see protected dashboard  
✅ Session persists across page refreshes  
✅ Code pushed to GitHub

---

### **WEEK 2 (Jan 16-22): Student Registration Form**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Complete database schema for student applications
- [ ] Multi-step registration form with validation
- [ ] File upload system for documents
- [ ] Student dashboard showing own application

#### Tasks Breakdown
**Day 1-2 (2 hours):**
- Expand Prisma schema: StudentProfile with all fields (name, DOB, contact, guardian, aadhar, branch, etc.)
- Create Document model for file uploads
- Create Application model for status tracking
- Run migration

**Day 3-4 (2.5 hours):**
- Install react-hook-form and zod
- Build multi-step form component (Basic Info → Documents → Review)
- Implement client-side validation with zod schemas
- Form state management

**Day 5-6 (1.5 hours):**
- Set up Supabase Storage bucket for documents
- Implement file upload functionality
- Connect form submission to database
- Basic student dashboard showing submitted data

#### Learning Focus
- Complex form handling with react-hook-form
- File upload and storage management
- Database relations (User → StudentProfile → Documents)
- Form validation patterns

#### Expected Challenges
- Multi-step form state management
- File upload progress tracking
- Validation error handling
- Large form performance

#### Success Criteria
✅ Student can fill complete registration form  
✅ Documents upload successfully to storage  
✅ Form data saves to database  
✅ Student can view their submitted application

---

### **WEEK 3 (Jan 23-29): Admin Dashboard Basics**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Role-based access control (RBAC) middleware
- [ ] Admin dashboard showing all applications
- [ ] Application detail view for admins
- [ ] Basic filtering and search

#### Tasks Breakdown
**Day 1-2 (2 hours):**
- Implement RBAC middleware for route protection
- Create role-based redirects after login
- Admin-only route protection
- Update User model with role enum (STUDENT, ADMIN, VERIFIER, ACCOUNTS)

**Day 3-4 (2.5 hours):**
- Build admin dashboard layout
- Create applications table component with shadcn Table
- Implement Prisma query to fetch all applications
- Add basic pagination

**Day 5-6 (1.5 hours):**
- Create application detail page
- Display student info and uploaded documents
- Add document preview functionality
- Basic search/filter by name or status

#### Learning Focus
- Role-based authorization patterns
- Complex Prisma queries with relations
- Data table components
- Server-side vs client-side filtering

#### Expected Challenges
- RBAC implementation complexity
- Prisma query optimization for large datasets
- Document preview in browser
- State synchronization between list and detail views

#### Success Criteria
✅ Admins see list of all applications  
✅ Clicking application shows full details  
✅ Documents are viewable from admin panel  
✅ Students cannot access admin routes

---

### **WEEK 4 (Jan 30 - Feb 5): Verifier Assignment & Status Flow**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Admin can assign verifiers to applications
- [ ] Verifier dashboard showing assigned applications
- [ ] Status update system (pending → in-review → verified → rejected)
- [ ] Application assignment tracking

#### Tasks Breakdown
**Day 1-2 (2.5 hours):**
- Create Assignment model (applicationId, verifierId, assignedAt)
- Create API route for assigning verifiers
- Admin UI: dropdown to select verifier and assign
- Update application status on assignment

**Day 3-4 (2 hours):**
- Build verifier dashboard
- Query applications assigned to logged-in verifier
- Display assigned applications in table format
- Show assignment date and current status

**Day 5-6 (1.5 hours):**
- Create status update component
- API route for updating application status
- Add status badge with color coding
- Verifier can mark application as reviewed/verified/rejected

#### Learning Focus
- Many-to-many relationships in Prisma
- User assignment logic
- State management for status updates
- Optimistic UI updates

#### Expected Challenges
- Assignment workflow complexity
- Preventing duplicate assignments
- Status transition validation (can't go from verified → pending)
- Real-time status synchronization

#### Success Criteria
✅ Admin assigns verifier → Verifier sees application  
✅ Verifier can update application status  
✅ Status changes reflect immediately  
✅ Assignment history is tracked

---

### **WEEK 5 (Feb 6-12): Remarks System (LIGHT WEEK)**
**Time Investment:** 3-4 hours (Pre-midterm quizzes)

#### Deliverables
- [ ] Remarks database model
- [ ] Verifiers can add text remarks
- [ ] Students can view remarks on dashboard
- [ ] Basic remark history

#### Tasks Breakdown
**Day 1-2 (2 hours):**
- Create Remark model (applicationId, authorId, text, createdAt)
- API route for creating remarks
- Verifier UI: text area + submit button

**Day 3-4 (1.5 hours):**
- Display remarks on student dashboard
- Show remark author and timestamp
- Basic formatting for remark text
- List all remarks chronologically

#### Learning Focus
- Simple CRUD operations
- Timestamp handling
- User attribution for actions

#### Expected Challenges
- None major - intentionally simple feature for exam week

#### Success Criteria
✅ Verifier adds remark → Student sees it  
✅ Multiple remarks are tracked  
✅ Remarks show who wrote them and when

---

### **WEEK 6 (Feb 13-21): MID-SEM BLACKOUT**
**Time Investment:** 0 hours

#### NO PROJECT WORK
- Focus entirely on exams
- Do not open code editor
- Come back fresh Week 7

---

### **WEEK 7 (Feb 22-28): Student Reupload & Document Management**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Students can see which documents need correction
- [ ] Document reupload functionality
- [ ] Document version control
- [ ] Document approval/rejection by verifiers

#### Tasks Breakdown
**Day 1-2 (2.5 hours):**
- Add status field to Document model (pending, approved, rejected)
- Update document schema to track versions
- Create API route for document status updates
- Verifier UI: approve/reject individual documents

**Day 3-4 (2 hours):**
- Student dashboard: highlight rejected documents
- Implement reupload functionality
- Keep old document version in storage
- Update document record with new file

**Day 5-6 (1.5 hours):**
- Document history view
- Show all versions of each document
- Timestamp and status for each version
- Prevent deletion of historical versions

#### Learning Focus
- File versioning strategies
- Conditional UI rendering
- Storage cleanup considerations
- Audit trail implementation

#### Expected Challenges
- File versioning without bloating storage
- UI/UX for showing which documents need reuploading
- Ensuring old versions remain accessible

#### Success Criteria
✅ Verifier rejects document → Student sees notification  
✅ Student can reupload only rejected documents  
✅ Old versions are preserved  
✅ Verifier sees new upload for review

---

### **WEEK 8 (Mar 1-7): Accounts Staff Interface**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Accounts role implementation
- [ ] Accounts dashboard (fee documents only)
- [ ] Fee verification workflow
- [ ] Fee status tracking

#### Tasks Breakdown
**Day 1-2 (2 hours):**
- Add ACCOUNTS role to User enum
- Create fee-specific document filtering
- Accounts dashboard showing only fee receipts
- Query optimization for fee documents

**Day 3-4 (2.5 hours):**
- Create FeeVerification model (applicationId, verified, verifiedBy, verifiedAt)
- API route for fee verification
- Accounts UI: approve/reject fee receipts
- Status badges for fee verification

**Day 5-6 (1.5 hours):**
- Add fee status to application overview
- Admin can see fee verification status
- Integration with overall application status
- Prevent final confirmation without fee verification

#### Learning Focus
- Role-specific data filtering
- Parallel workflow management
- Dependent status logic

#### Expected Challenges
- Coordinating verifier + accounts workflows
- Ensuring both checks complete before confirmation
- Dashboard permission boundaries

#### Success Criteria
✅ Accounts staff see only fee documents  
✅ Can approve/reject fee receipts independently  
✅ Fee status tracked separately from application status  
✅ Admin sees both verification statuses

---

### **WEEK 9 (Mar 8-14): Confirmation Letter Generation**
**Time Investment:** 6 hours

#### Deliverables
- [ ] PDF generation system
- [ ] Seat confirmation letter template
- [ ] Admin can trigger letter generation
- [ ] Students can download letter from dashboard

#### Tasks Breakdown
**Day 1-3 (3 hours):**
- Install and configure react-pdf (or puppeteer)
- Design letter template (college letterhead, student details)
- Create PDF generation API route
- Test PDF generation with sample data

**Day 4-5 (2 hours):**
- Add "Generate Letter" button on admin panel
- Letter generation triggered only after full verification
- Store generated PDF in Supabase Storage
- Update application with letter URL

**Day 6-7 (1 hour):**
- Add download button on student dashboard
- Only show if letter is generated
- Track letter generation timestamp
- Add regeneration option for admins

#### Learning Focus
- PDF generation in Node.js
- Template systems
- Conditional rendering based on status
- File serving from storage

#### Expected Challenges
- PDF styling and layout
- Generating dynamic content
- Large file handling
- Storage permissions

#### Success Criteria
✅ Admin generates letter for verified application  
✅ PDF contains all student information  
✅ Student can download letter  
✅ Letter looks professional and formatted correctly

---

### **WEEK 10 (Mar 15-21): Email Notifications & Polish**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Email notification system
- [ ] Status change notifications
- [ ] Loading states throughout app
- [ ] Error handling improvements
- [ ] Basic responsive design

#### Tasks Breakdown
**Day 1-2 (2 hours):**
- Set up email service (Resend or Nodemailer)
- Create email templates for different events
- Trigger emails on status changes
- Test email delivery

**Day 3-4 (2 hours):**
- Add loading spinners for async operations
- Implement error boundaries
- Toast notifications for user actions
- Form validation error displays

**Day 5-6 (2 hours):**
- Mobile responsive design fixes
- Test on different screen sizes
- Improve navigation and layout
- Accessibility improvements (ARIA labels)

#### Learning Focus
- Email integration in Next.js
- Error handling patterns
- Loading states and UX
- Responsive design principles

#### Expected Challenges
- Email deliverability
- Rate limiting for emails
- Managing loading states across components
- Mobile layout issues

#### Success Criteria
✅ Users receive emails on key actions  
✅ All actions show loading feedback  
✅ Errors display user-friendly messages  
✅ App works on mobile devices

---

### **WEEK 11 (Mar 22-28): Statistics & Charts**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Database aggregation queries for all 6 statistics
- [ ] Chart components with Recharts
- [ ] Admin analytics dashboard
- [ ] Export statistics to CSV

#### Tasks Breakdown
**Day 1-2 (2.5 hours):**
- Write Prisma aggregation queries:
  - Branch-wise distribution
  - Gender-wise per branch
  - State-wise distribution
  - PWD candidates
  - Category-wise distribution
  - Opening/closing ranks by category

**Day 3-4 (2 hours):**
- Install and configure Recharts
- Create reusable chart components
- Bar charts for distributions
- Tables for detailed breakdowns

**Day 5-6 (1.5 hours):**
- Build analytics dashboard page
- Layout all 6 statistics
- Add refresh button for live updates
- CSV export functionality

#### Learning Focus
- Complex SQL aggregations
- Data visualization best practices
- Performance optimization for analytics
- Export functionality

#### Expected Challenges
- Complex nested queries
- Chart configuration and styling
- Handling edge cases (no data, zeros)
- Performance with large datasets

#### Success Criteria
✅ All 6 statistics display correctly  
✅ Charts are readable and accurate  
✅ Data updates when refreshed  
✅ Statistics can be exported

---

### **WEEK 12 (Mar 29 - Apr 7): Demo Preparation & Documentation**
**Time Investment:** 6 hours

#### Deliverables
- [ ] Seed database with realistic dummy data
- [ ] Demo script for presentation
- [ ] README documentation
- [ ] Demo video recording
- [ ] UI polish and bug fixes

#### Tasks Breakdown
**Day 1-2 (2 hours):**
- Create seed script with 50-100 fake applications
- Include all document types
- Mix of different statuses and roles
- Realistic names, dates, branches

**Day 3-4 (2 hours):**
- Write demo script covering:
  - Student registration flow
  - Admin assigning verifiers
  - Verifier reviewing and remarking
  - Accounts fee verification
  - Letter generation
  - Analytics dashboard
- Practice demo timing (10-15 minutes)

**Day 5-6 (2 hours):**
- Write comprehensive README
- Record demo video as backup
- Final UI polish (colors, spacing, consistency)
- Fix any remaining bugs
- Test complete workflow end-to-end

#### Learning Focus
- Database seeding best practices
- Technical presentation skills
- Documentation writing
- QA testing

#### Expected Challenges
- Creating realistic dummy data
- Timing demo presentation
- Finding and fixing edge case bugs
- Polishing UI consistently

#### Success Criteria
✅ Database has diverse sample data  
✅ Demo flows smoothly without errors  
✅ README explains setup and features  
✅ Video backup exists for demonstration  
✅ UI looks professional and consistent

---

### **WEEK 13 (Apr 8-14): EMERGENCY ONLY**
**Time Investment:** 2 hours maximum (Pre-finals quizzes)

#### Goal
- Only critical bug fixes if demo breaks
- Otherwise: study for finals
- No new features under any circumstances

#### Allowed Activities
- Fix breaking bugs
- Patch security issues
- Update deployment if Vercel breaks

#### Forbidden Activities
- Adding new features
- Refactoring code
- UI improvements
- "Quick enhancements"

---

### **WEEK 14 (Apr 15-25): END-SEM BLACKOUT**
**Time Investment:** 0 hours

#### NO PROJECT WORK
- Focus entirely on final exams
- Project is done at this point
- No touching code during finals

---

## VERSION 2 FEATURES (Post-Submission)
If project succeeds and time permits after exams:

### Live Updates
- WebSocket integration for real-time status changes
- Live notification system
- Real-time analytics updates

### Chat Rooms
- Common student chatroom
- State-wise student chatrooms
- Student-verifier private chat for application queries
- Admin announcements broadcast channel

### Enhanced Analytics
- Trend analysis over time
- Predictive analytics for seat filling
- Custom report generation
- Data export in multiple formats

### Mobile App
- React Native or PWA conversion
- Push notifications
- Offline document viewing

---

## WEEKLY CHECK-IN TEMPLATE

```
WEEK [X] CHECK-IN:

✅ COMPLETED:
- [List actual finished deliverables]

🚧 IN PROGRESS:
- [Partially done items]

❌ BLOCKED ON:
- [Specific technical issues]
- [What already tried to fix it]

📚 LEARNED:
- [One key technical concept mastered]

⏱️ TIME SPENT: [Actual hours]

⏭️ NEXT WEEK:
- [Top 3 priorities for next week]

💭 NOTES:
- [Any concerns, questions, or insights]
```

---

## RISK MITIGATION STRATEGIES

### Time Slippage
- If a week slips by 1-2 days: compress next week
- If a week completely fails: cut analytics complexity
- If multiple weeks slip: drop email notifications and CSV export

### Technical Blockers
- Maximum 1 hour stuck before asking for help
- Keep a "blockers log" with what was tried
- Have backup approaches for critical features

### Scope Creep Prevention
- No new features after Week 8
- All "nice to have" ideas go to Version 2 list
- Focus on core workflow completion

### Exam Period Protection
- Weeks 5-6 and 13-14 are sacred
- Build buffer into earlier weeks
- Accept "good enough" over "perfect"

---

## SUCCESS METRICS

### Minimum Viable Product (Must Have)
- ✅ Students can register and upload documents
- ✅ Admins can view and assign applications
- ✅ Verifiers can review and add remarks
- ✅ Status tracking works end-to-end
- ✅ Basic dashboard for each role

### Good Product (Should Have)
- ✅ All above +
- ✅ Document reupload functionality
- ✅ Accounts staff fee verification
- ✅ Email notifications
- ✅ Seat confirmation letter generation

### Great Product (Nice to Have)
- ✅ All above +
- ✅ Complete analytics dashboard with charts
- ✅ Responsive mobile design
- ✅ CSV export
- ✅ Professional UI polish

### Excellent Product (Stretch Goals)
- ✅ All above +
- ✅ Demo video
- ✅ Comprehensive documentation
- ✅ Institute adoption recommendation

---

## LEARNING OBJECTIVES TRACKER

### Technical Skills to Master
- [ ] Next.js App Router and API routes
- [ ] TypeScript for full-stack development
- [ ] Prisma ORM and database design
- [ ] NextAuth.js authentication
- [ ] File upload and storage management
- [ ] Role-based access control
- [ ] PDF generation
- [ ] Email integration
- [ ] Data visualization with charts
- [ ] Responsive design principles

### Soft Skills to Develop
- [ ] Project planning and time management
- [ ] Technical documentation writing
- [ ] Demo presentation skills
- [ ] Problem-solving under constraints
- [ ] Stakeholder communication (college admin)

### Resume Talking Points
- [ ] "Built end-to-end admission management system"
- [ ] "Implemented role-based authentication for 500+ users"
- [ ] "Designed and optimized PostgreSQL database schema"
- [ ] "Created analytics dashboard with 6 statistical visualizations"
- [ ] "Deployed production-ready app on Vercel"

---

## CONTACT & ESCALATION

### When to Ask for Help
- Stuck on same issue for >1 hour
- Unclear about technical approach
- Need architecture decision guidance
- Facing time management crisis

### What to Include When Asking
1. Specific error message or behavior
2. What you've already tried (with code snippets)
3. What you expected to happen
4. Relevant code context
5. Your current understanding of the problem

### Emergency Situations
- Project blocked with <1 week to deadline
- Critical bug in production demo
- Major scope concern
- External dependency failure (Supabase down, etc.)

---

## PROJECT METADATA

**GitHub Repository:** [To be created Week 1]  
**Deployment URL:** [To be deployed Week 10]  
**Project Start Date:** January 9, 2025  
**Project Demo Date:** ~April 7, 2025  
**Submission Deadline:** April 25, 2025

**Last Updated:** January 10, 2025  
**Version:** 1.0  
**Status:** Week 1 In Progress
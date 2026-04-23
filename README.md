📄 Invoice Management App
🚀 Overview
This is a full-stack Invoice Management Application built with React, based on the provided Figma design. The app allows users to manage invoices efficiently with full CRUD functionality, status tracking, filtering, and theme customization.

✨ Features
Create, read, update, and delete invoices

Save invoices as Draft

Mark invoices as Paid

Filter invoices by status (All, Draft, Pending, Paid)

Light/Dark mode toggle (persisted across sessions)

Fully responsive design (mobile, tablet, desktop)

Form validation with error handling

Hover and interactive states

Confirmation modal for deletion

Persistent data storage

🛠️ Tech Stack
Frontend: React 

State Management: React Context / useState

Styling: CSS / Styled Components / Tailwind

⚙️ Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/invoice-app.git
cd invoice-app
2. Install dependencies
npm install
3. Run the development server
npm run dev
4. Open in browser
http://localhost:5173
🧱 Architecture
The application follows a component-based architecture:

src/
│
├── components/
│   ├── InvoiceForm.jsx
│   ├── InvoiceItem.jsx
│   ├── StatusBadge.jsx
│   ├── Filter.jsx
│   ├── Modal.jsx
│
├── pages/
│   ├── InvoiceList.jsx
│   ├── InvoiceDetail.jsx
│
├── context/
│   ├── ThemeContext.jsx
│   ├── InvoiceContext.jsx
│
├── utils/
│   ├── validation.js
│   ├── storage.js
│
└── App.jsx
Key Design Decisions:
Context API used for global state (invoices + theme)

LocalStorage used for persistence

Separation of concerns between UI, logic, and state

⚖️ Trade-offs
1. LocalStorage vs Backend
✅ Faster to implement

❌ No cross-device sync

❌ No real multi-user support

Chosen for speed and simplicity within assignment constraints.

2. No Authentication
✅ Matches Figma design exactly

✅ Simpler user flow

❌ No user-specific data

3. Client-side State Management
✅ Lightweight (no Redux needed)

❌ Can become harder to scale

♿ Accessibility Notes
Semantic HTML elements used (<button>, <form>, <label>)

All inputs properly labeled

Modal:

Traps focus

Closes with ESC

Keyboard navigable

Sufficient color contrast for both light and dark themes (WCAG AA)

Interactive elements have visible focus and hover states

🚀 Improvements (Future Work)
Add authentication (user accounts)

Connect to a real backend (e.g., Supabase / Node.js)

Add pagination for large datasets

Export invoices as PDF

Add search functionality

Improve performance with memoization

📦 Deployment
Live URL: (add your Vercel/Netlify link here)

GitHub Repo: (https://github.com/zion-robotics/invoice-master-pro)

📝 Notes
App is pre-seeded with sample invoices for better demo experience

Data persists across reload using supabase

Designed to closely match the provided Figma UI

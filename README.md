# FreshFlow | Markdown Approval Console 🛒

**Course:** MCA413-1 Full Stack Development  
**Assessment:** CIA-1B (Problem Solving & Prototyping)  
**Developer:** Yashraj Kumar (1MCA B)

---

## 🚀 Project Overview
This repository contains the interactive front-end prototype for FreshFlow. It addresses a critical logistics problem in retail: **supermarket food waste**. 

Instead of letting perishable items expire and taking a 100% loss, this prototype provides store managers with a dynamic "Markdown Approval Console" to review expiring stock, apply custom discounts, and liquidate inventory before it goes bad.

## 🧠 CIA-1B Technical Implementation
This prototype was engineered to meet strict enterprise and academic standards, shifting from a monolithic layout to a modular architecture:

* **Modular Codebase:** Clean separation of concerns using isolated `style.css` and vanilla JavaScript files (`markdown-approval.js`, `api-demos.js`).
* **Client-Side Validation:** Form submission is strictly gated. The manager *must* leave a justification note (5+ chars) to approve a markdown, complete with shake animations and inline error handling.
* **Event-Driven UI:** Features real-time math calculations via the markdown slider and zero-reload array filtering (All / Critical / Pending / Approved).
* **HTML5 Native APIs:** Integrated the Web Notifications API to trigger system-level alerts upon markdown approval, alongside Geolocation, Canvas, and Drag & Drop modules.
* **Premium UI/UX:** Built with Tailwind CSS utilizing responsive grid layouts and deep glassmorphism styling.

## 🌐 Live Prototype
> **[Click here to view the live Vercel deployment](https://fresh-flow-cia-1-b.vercel.app/)** *(Note: Evaluator can launch straight into the platform to test the workflow and JS validation).*

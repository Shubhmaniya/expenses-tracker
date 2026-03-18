# ExpenseTracker Setup & Run Instructions

This professional Expense Tracker application is now fully configured for local development.

## 🛠 Prerequisites
- **Node.js**: v18 or later (v22 recommended)
- **Git**: (Optional, for version control)

## 🚀 Quick Start
If you just want to run the app immediately, use the automation script I created:
1. Open **File Explorer** and go to `D:\projects\expence_tracker`
2. Right-click `FIX_AND_RUN.bat` and select **"Run as Administrator"**
3. Open **http://localhost:3000** in your browser.

---

## 📖 Manual Steps (How I fixed it)

For your information, here is how the project is now structured:

### 1. Project Directory
The project lives in `D:\projects\expence_tracker`. 
I have created a directory junction so that your VS Code workspace (`expence-tracker` with a hyphen) correctly points to your actual folder (`expence_tracker` with an underscore).

### 2. Database (SQLite)
I switched the database from a remote PostgreSQL (which was unreachable) to a **local SQLite** database for reliability.
- **File**: `prisma/dev.db`
- **Configuration**: Managed via `.env` and `prisma/schema.prisma`.

### 3. Basic Commands
Once your terminal is in the project folder, you can use these commands:

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npx prisma db push` | Syncs your database with the schema |
| `npx prisma db seed` | Populates the database with initial categories |
| `npm run build` | Creates a production-ready build |

## ✅ Verification
- **Login/Register**: Fully functional. You can create an account and log in immediately.
- **Charts**: Interactive charts will populate once you add your first expense.
- **Export**: You can export your data as CSV or PDF from the Reports page.

Enjoy tracking your expenses!

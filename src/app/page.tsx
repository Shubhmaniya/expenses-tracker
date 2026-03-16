import DashboardStats from "@/components/DashboardStats";
import SpendingChart from "@/components/SpendingChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import RecentTransactions from "@/components/RecentTransactions";
import DashboardHeader from "@/components/DashboardHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Info } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  let expenses: any[] = [];
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalSavings = 0;
  
  if (session?.user && (session.user as any).id) {
    const userId = (session.user as any).id;
    expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" }
    });
  }

  // Calculate totals
  expenses.forEach(e => {
     if (e.category.name === "Income") {
        totalIncome += e.amount;
     } else if (e.category.name === "Savings") {
        totalSavings += e.amount;
     } else {
        totalExpenses += e.amount;
     }
  });

  const totalBalance = totalIncome - totalExpenses - totalSavings;

  // Recent transactions mapping
  const recentTransactions = expenses.slice(0, 5).map(e => ({
    id: e.id,
    amount: e.amount,
    description: e.description || e.merchant || "Expense",
    categoryName: e.category.name,
    date: new Date(e.date).toISOString().split('T')[0]
  }));

  // Category breakdown
  const categoryMap = new Map();
  expenses.forEach(e => {
    if (e.category.name !== "Income" && e.category.name !== "Savings") {
      const current = categoryMap.get(e.category.name) || { value: 0, color: e.category.color };
      categoryMap.set(e.category.name, { value: current.value + e.amount, color: e.category.color });
    }
  });
  
  const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    value: data.value,
    color: data.color || "#3B82F6"
  }));

  // Spending chart
  const monthlyMap = new Map();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Create a simple chronological data map
  [...expenses].reverse().forEach(e => {
    if (e.category.name !== "Income" && e.category.name !== "Savings") {
      const date = new Date(e.date);
      const monthStr = months[date.getMonth()];
      monthlyMap.set(monthStr, (monthlyMap.get(monthStr) || 0) + e.amount);
    }
  });
  
  const spendingData = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
    month,
    amount
  }));

  const hasExpenses = expenses.length > 0;

  return (
    <div className="space-y-8 pb-10">
      <DashboardHeader />

      {!hasExpenses && session?.user && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900">Welcome to Expense Tracker!</h3>
          <p className="text-blue-700 max-w-md">
            You don't have any default expenses or income. Start by adding a new transaction using the button above, and your personalized dashboard will appear here!
          </p>
        </div>
      )}

      <DashboardStats 
        totalBalance={totalBalance} 
        totalIncome={totalIncome} 
        totalExpenses={totalExpenses} 
        totalSavings={totalSavings} 
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <SpendingChart data={spendingData} />
        <RecentTransactions transactions={recentTransactions} />
        <CategoryBreakdown data={categoryData} />
      </div>
    </div>
  );
}

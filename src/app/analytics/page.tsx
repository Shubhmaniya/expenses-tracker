"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts"
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react"

const monthlyTrend = [
  { month: "Jan", income: 45000, expenses: 32000 },
  { month: "Feb", income: 42000, expenses: 35000 },
  { month: "Mar", income: 48000, expenses: 31000 },
  { month: "Apr", income: 51000, expenses: 38000 },
  { month: "May", income: 49000, expenses: 34000 },
  { month: "Jun", income: 55000, expenses: 36000 },
]

const categorySpending = [
  { category: "Housing", amount: 15000 },
  { category: "Food", amount: 8000 },
  { category: "Transportation", amount: 4500 },
  { category: "Entertainment", amount: 3200 },
  { category: "Shopping", amount: 2800 },
  { category: "Other", amount: 1500 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Deep dive into your spending habits and financial health.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground shadow-xl shadow-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium opacity-80">Savings Rate</p>
              <Info className="w-4 h-4 opacity-50" />
            </div>
            <h3 className="text-3xl font-bold mt-2">34.5%</h3>
            <p className="text-xs mt-2 flex items-center gap-1 opacity-80">
              <ArrowUpRight className="w-3 h-3" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Highest Category</p>
              <Info className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <h3 className="text-3xl font-bold mt-2 text-rose-500">Housing</h3>
            <p className="text-xs text-muted-foreground mt-2">
              42% of total monthly spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
              <Info className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <h3 className="text-3xl font-bold mt-2 text-blue-500">₹1,145.30</h3>
            <p className="text-xs text-rose-500 mt-2 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3" />
              15% higher than usual
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySpending} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="category" 
                    type="category" 
                    stroke="#64748B" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    width={100}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

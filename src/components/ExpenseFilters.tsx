"use client"

import { Search, Filter } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

interface ExpenseFiltersProps {
  categories: { id: string; name: string }[]
}

export default function ExpenseFilters({ categories }: ExpenseFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("query") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams(search, category)
    }, 400)
    return () => clearTimeout(timer)
  }, [search, category])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value
    setCategory(newCat)
    // The effect will handle the push
  }

  const updateParams = (q: string, cat: string) => {
    const params = new URLSearchParams()
    if (q) params.set("query", q)
    if (cat) params.set("category", cat)
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="md:col-span-2 lg:col-span-3">
      <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by merchant or description..." 
            className="w-full bg-transparent border-none focus:ring-0 pl-10 pr-4 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-[1px] h-8 bg-border hidden md:block" />
        <div className="flex items-center gap-2 px-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

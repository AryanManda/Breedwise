import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, Network } from "lucide-react";
import type { Animal } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-64" />
          <Skeleton className="h-5 sm:h-6 w-64 sm:w-96" />
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const totalAnimals = animals?.length || 0;
  const maleCount = animals?.filter((a) => a.sex === "Male").length || 0;
  const femaleCount = animals?.filter((a) => a.sex === "Female").length || 0;

  const animalsWithParents = animals?.filter((a) => a.sireId || a.damId).length || 0;

  const uniqueSpecies = animals?.length
    ? new Set(animals.map((a) => a.species)).size
    : 0;

  const sexDistribution = [
    { name: "Male", value: maleCount, color: "hsl(var(--chart-3))" },
    { name: "Female", value: femaleCount, color: "hsl(var(--chart-2))" },
  ];

  const herdDistribution = animals?.length
    ? Object.entries(
        animals.reduce((acc, a) => {
          acc[a.species] = (acc[a.species] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    : [];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Key metrics and analytics for your breeding program
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card data-testid="card-total-animals">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-animals">
              {totalAnimals}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {maleCount} males, {femaleCount} females
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-lineage-tracked">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lineage Tracked
            </CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-lineage-tracked">
              {animalsWithParents}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {animalsWithParents
                ? `${((animalsWithParents / totalAnimals) * 100).toFixed(0)}% with parent records`
                : "No lineage data yet"}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-breeding-potential" className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Breeding Potential
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-breeding-pairs">
              {Math.min(maleCount, femaleCount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {uniqueSpecies} unique species
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Male/Female Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            {sexDistribution.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <PieChart>
                  <Pie
                    data={sexDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sexDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Herd Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {herdDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart data={herdDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    className="text-xs"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

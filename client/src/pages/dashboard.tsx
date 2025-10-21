import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, Activity, FileTree } from "lucide-react";
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
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
  
  const avgWeight =
    animals?.length
      ? (
          animals.reduce((sum, a) => sum + parseFloat(a.weight), 0) /
          animals.length
        ).toFixed(1)
      : "0.0";

  const animalsWithParents = animals?.filter((a) => a.sireId || a.damId).length || 0;

  const uniqueBreeds = animals?.length
    ? new Set(animals.map((a) => a.breed)).size
    : 0;

  const ageDistribution = animals?.length
    ? Object.entries(
        animals.reduce((acc, a) => {
          const ageGroup =
            a.age < 2 ? "0-1" : a.age < 5 ? "2-4" : a.age < 10 ? "5-9" : "10+";
          acc[ageGroup] = (acc[ageGroup] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value }))
    : [];

  const sexDistribution = [
    { name: "Male", value: maleCount, color: "hsl(var(--chart-3))" },
    { name: "Female", value: femaleCount, color: "hsl(var(--chart-2))" },
  ];

  const breedDistribution = animals?.length
    ? Object.entries(
        animals.reduce((acc, a) => {
          acc[a.breed] = (acc[a.breed] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Key metrics and analytics for your breeding program
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <Card data-testid="card-avg-weight">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Weight
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold font-mono"
              data-testid="text-avg-weight"
            >
              {avgWeight} lbs
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average across herd</p>
          </CardContent>
        </Card>

        <Card data-testid="card-lineage-tracked">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lineage Tracked
            </CardTitle>
            <FileTree className="h-4 w-4 text-muted-foreground" />
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

        <Card data-testid="card-breeding-potential">
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
              {uniqueBreeds} unique breeds
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {ageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.375rem",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Male/Female Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            {sexDistribution.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sexDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Breed Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {breedDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={breedDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.375rem",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

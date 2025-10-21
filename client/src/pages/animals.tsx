import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Animal } from "@shared/schema";
import { AnimalForm } from "@/components/animal-form";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [deletingAnimal, setDeletingAnimal] = useState<Animal | null>(null);
  const { toast } = useToast();

  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/animals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "Animal deleted",
        description: "The animal has been removed from your records.",
      });
      setDeletingAnimal(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete animal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredAnimals = animals?.filter((animal) =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-1";
    if (score >= 60) return "text-chart-2";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Animal Management</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Track and manage your breeding stock
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-animal">
              <Plus className="h-4 w-4 mr-2" />
              Add Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Animal</DialogTitle>
              <DialogDescription>
                Enter the details of the animal you want to add to your breeding program.
              </DialogDescription>
            </DialogHeader>
            <AnimalForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          data-testid="input-search-animals"
        />
      </div>

      {filteredAnimals && filteredAnimals.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No animals found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first animal to the breeding program"}
              </p>
            </div>
            {!searchTerm && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Animal
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Genetic Score</TableHead>
                <TableHead>Horn Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnimals?.map((animal) => (
                <TableRow key={animal.id} data-testid={`row-animal-${animal.id}`}>
                  <TableCell className="font-medium" data-testid={`text-name-${animal.id}`}>
                    {animal.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={animal.sex === "Male" ? "default" : "secondary"}>
                      {animal.sex}
                    </Badge>
                  </TableCell>
                  <TableCell>{animal.age} yrs</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>
                    <span
                      className={`font-mono font-semibold ${getScoreColor(
                        parseFloat(animal.geneticScore)
                      )}`}
                    >
                      {animal.geneticScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    {animal.hornSize ? `${animal.hornSize}"` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={editingAnimal?.id === animal.id}
                        onOpenChange={(open) => !open && setEditingAnimal(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingAnimal(animal)}
                            data-testid={`button-edit-${animal.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Animal</DialogTitle>
                            <DialogDescription>
                              Update the animal's information.
                            </DialogDescription>
                          </DialogHeader>
                          <AnimalForm
                            animal={editingAnimal}
                            onSuccess={() => setEditingAnimal(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingAnimal(animal)}
                        data-testid={`button-delete-${animal.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <AlertDialog
        open={!!deletingAnimal}
        onOpenChange={(open) => !open && setDeletingAnimal(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingAnimal?.name} from your breeding program.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingAnimal && deleteMutation.mutate(deletingAnimal.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

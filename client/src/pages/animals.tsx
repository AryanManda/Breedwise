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
    animal.species.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Animal Management</h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-1">
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
          <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Add New Animal</DialogTitle>
              <DialogDescription>
                Enter the details of the animal you want to add to your breeding program.
              </DialogDescription>
            </DialogHeader>
            <AnimalForm onSuccess={() => {
              setIsAddDialogOpen(false);
              setSearchTerm("");
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or species..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          autoComplete="off"
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
        <>
          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Horn Size</TableHead>
                  <TableHead>Health Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnimals?.map((animal) => (
                  <TableRow key={animal.id} data-testid={`row-animal-${animal.id}`}>
                    <TableCell className="font-medium" data-testid={`text-name-${animal.id}`}>
                      {animal.name}
                    </TableCell>
                    <TableCell>{animal.species}</TableCell>
                    <TableCell>
                      <Badge variant={animal.sex === "Male" ? "default" : "secondary"}>
                        {animal.sex}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {animal.hornSize ? `${animal.hornSize}"` : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {animal.healthNotes || "—"}
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
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Animal</DialogTitle>
                              <DialogDescription>
                                Update the animal's information.
                              </DialogDescription>
                            </DialogHeader>
                            <AnimalForm
                              animal={editingAnimal}
                              onSuccess={() => {
                                setEditingAnimal(null);
                                setSearchTerm("");
                              }}
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredAnimals?.map((animal) => (
              <Card key={animal.id} className="hover-elevate" data-testid={`row-animal-${animal.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate" data-testid={`text-name-${animal.id}`}>
                        {animal.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={animal.sex === "Male" ? "default" : "secondary"}>
                          {animal.sex}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{animal.species}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
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
                            className="h-9 w-9"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto mx-4">
                          <DialogHeader>
                            <DialogTitle>Edit Animal</DialogTitle>
                            <DialogDescription>
                              Update the animal's information.
                            </DialogDescription>
                          </DialogHeader>
                          <AnimalForm
                            animal={editingAnimal}
                            onSuccess={() => {
                              setEditingAnimal(null);
                              setSearchTerm("");
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingAnimal(animal)}
                        data-testid={`button-delete-${animal.id}`}
                        className="h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {animal.hornSize && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Horn Size:</span>
                        <span className="font-medium">{animal.hornSize}"</span>
                      </div>
                    )}
                    {animal.healthNotes && (
                      <div>
                        <span className="text-muted-foreground">Health Notes:</span>
                        <p className="mt-1 text-foreground">{animal.healthNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
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

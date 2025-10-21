import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertAnimalSchema, type InsertAnimal, type Animal } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AnimalFormProps {
  animal?: Animal | null;
  onSuccess?: () => void;
}

export function AnimalForm({ animal, onSuccess }: AnimalFormProps) {
  const { toast } = useToast();
  const isEditing = !!animal;

  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const form = useForm<InsertAnimal>({
    resolver: zodResolver(insertAnimalSchema),
    defaultValues: animal
      ? {
          name: animal.name,
          species: animal.species,
          sex: animal.sex as "Male" | "Female",
          healthNotes: animal.healthNotes || undefined,
          hornSize: animal.hornSize ? parseFloat(animal.hornSize) : undefined,
          sireId: animal.sireId || undefined,
          damId: animal.damId || undefined,
        }
      : {
          name: "",
          species: "",
          sex: "Male",
          healthNotes: undefined,
          hornSize: undefined,
          sireId: undefined,
          damId: undefined,
        },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAnimal) => {
      const response = await apiRequest("POST", "/api/animals", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "Animal added",
        description: "The animal has been successfully added to your breeding program.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add animal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertAnimal) => {
      const response = await apiRequest("PUT", `/api/animals/${animal!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "Animal updated",
        description: "The animal information has been successfully updated.",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update animal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAnimal) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const males = animals?.filter((a) => a.sex === "Male" && a.id !== animal?.id) || [];
  const females = animals?.filter((a) => a.sex === "Female" && a.id !== animal?.id) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Thunder"
                    {...field}
                    data-testid="input-animal-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Species</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Cattle"
                    {...field}
                    data-testid="input-animal-species"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-animal-sex">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="healthNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Notes/Status</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Optional health notes"
                    {...field}
                    value={field.value || ""}
                    data-testid="input-animal-health-notes"
                  />
                </FormControl>
                <FormDescription>Optional health status or notes</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hornSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horn Size (inches)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Optional"
                    step="0.01"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    data-testid="input-animal-horn-size"
                  />
                </FormControl>
                <FormDescription>Optional measurement</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sireId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sire (Father)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} 
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-animal-sire">
                      <SelectValue placeholder="Select sire (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {males.map((male) => (
                      <SelectItem key={male.id} value={male.id}>
                        {male.name} ({male.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Optional parent tracking</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="damId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dam (Mother)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} 
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-animal-dam">
                      <SelectValue placeholder="Select dam (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {females.map((female) => (
                      <SelectItem key={female.id} value={female.id}>
                        {female.name} ({female.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Optional parent tracking</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isPending}
            data-testid="button-save-animal"
          >
            {isPending ? "Saving..." : isEditing ? "Update Animal" : "Add Animal"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

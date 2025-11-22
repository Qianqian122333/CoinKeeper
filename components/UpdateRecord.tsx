"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { editRecord } from "@/app/actions/editRecord";

interface ExpenseRecord {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: string;
}

interface UpdateRecordProps {
  record: ExpenseRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Category options
const CATEGORIES = [
  { label: "Food & Drinks", value: "food" },
  { label: "Transportation", value: "transport" },
  { label: "Housing", value: "housing" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Bills & Utilities", value: "bills" },
  { label: "Other", value: "other" },
] as const;

// Form validation Schema
const formSchema = z.object({
  text: z.string().min(1, {
    message: "Description must be at least 1 character.",
  }),

  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    message: "Please select an expense category.",
  }),

  amount: z.number().min(0.01, {
    message: "Amount must be greater than 0.",
  }),
});

type EditFormValues = z.infer<typeof formSchema>;

const UpdateRecord = ({ record, open, onOpenChange }: UpdateRecordProps) => {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: record.text,
      category: record.category as
        | "food"
        | "transport"
        | "housing"
        | "entertainment"
        | "bills"
        | "other",
      amount: record.amount,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Submit handler
  async function onSubmit(values: EditFormValues) {
    try {
      const result = await editRecord({
        id: record.id,
        ...values,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Record updated successfully!");
        onOpenChange(false);
      }
    } catch (err) {
      console.error("Error updating record:", err);
      toast.error("Update failed, please try again");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Expense Record</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Expense Description */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter item or service name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expense Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expense category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (£)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="10"
                      min="1"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        if (rawValue === "") {
                          field.onChange(0);
                        } else {
                          const intValue = parseInt(rawValue, 10);
                          field.onChange(isNaN(intValue) ? 0 : intValue);
                        }
                      }}
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRecord;

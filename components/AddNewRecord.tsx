"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast"; // 假设您使用 react-hot-toast 进行反馈

// 导入我们定义的提交逻辑函数（无论是 Server Action 还是客户端 API 客户端）

// 假设这些是您已导入的 Shadcn UI 组件
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addExpenseRecord } from "@/app/actions/addExpenseRecord";

// --- Category Options ---
const CATEGORIES = [
  { label: "Food & Drinks", value: "food" },
  { label: "Transportation", value: "transport" },
  { label: "Housing", value: "housing" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Bills & Utilities", value: "bills" },
  { label: "Other", value: "other" },
] as const;

// --- Form Validation Schema (Zod) ---
const formSchema = z.object({
  // Keep field names consistent with your Server Action expectations: 'text', 'amount', 'category', 'date'
  text: z.string().min(1, {
    message: "Description must be at least 1 character.",
  }),

  date: z.date({
    message: "Please select an expense date.",
  }),

  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    message: "Please select an expense category.",
  }),

  amount: z.number().positive({
    message: "Amount must be greater than 0.",
  }).refine((val) => {
    // Check if it has at most 2 decimal places
    return /^\d+(\.\d{1,2})?$/.test(val.toString());
  }, {
    message: "Amount can have at most 2 decimal places.",
  }),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

const AddNewRecord = () => {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      category: undefined, // 改为 undefined，强制用户选择
      amount: 0,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // 提交处理函数
  async function onSubmit(values: ExpenseFormValues) {
    try {
      // 1. 格式化数据，特别是日期，以便 Action 层处理
      const dataToSubmit = {
        ...values,
        date: format(values.date, "yyyy-MM-dd"), // 转换为 YYYY-MM-DD 字符串
      };

      // 2. 调用 Action/API 函数
      const result = await addExpenseRecord(dataToSubmit);

      // 3. Handle result and feedback
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Expense record saved successfully!");
        reset({
          text: "",
          category: undefined,
          amount: 0,
          date: undefined,
        }); // Explicitly reset all fields
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error(
        "Submission failed, please check your network connection or try again later."
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Field 1: Expense Description (text) --- */}
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

            {/* --- Field 2: Expense Date (date) - Calendar Picker --- */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expense Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Field 3: Category (category) - Dropdown Menu --- */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value || "empty"}
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

            {/* --- Field 4: Amount (amount) - Number Input --- */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (£)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="10.00"
                      min="0.01"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        if (rawValue === "") {
                          field.onChange(undefined);
                        } else {
                          const floatValue = parseFloat(rawValue);
                          field.onChange(
                            isNaN(floatValue) || floatValue <= 0
                              ? undefined
                              : floatValue
                          );
                        }
                      }}
                      value={
                        field.value === undefined || field.value === 0
                          ? ""
                          : field.value
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the exact amount of this expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Submit Button --- */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Record"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddNewRecord;

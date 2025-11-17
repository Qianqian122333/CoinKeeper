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

// --- 分类选项 (保持不变) ---
const CATEGORIES = [
  { label: "食品饮料", value: "food" },
  { label: "交通出行", value: "transport" },
  { label: "住房租金", value: "housing" },
  { label: "娱乐休闲", value: "entertainment" },
  { label: "账单/费用", value: "bills" },
  { label: "其他", value: "other" },
] as const;

// --- 表单验证 Schema (Zod) ---
const formSchema = z.object({
  // 保持字段名与您的 Server Action 期望的键名一致，这里是 'text', 'amount', 'category', 'date'
  text: z.string().min(1, {
    message: "描述至少需要 1 个字符。",
  }),

  date: z.date({
    message: "请选择一个支出日期。",
  }),

  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    message: "请选择一个支出类别。",
  }),

  amount: z.number().min(0.01, {
    message: "金额必须大于 0。",
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

      // 3. 处理结果和反馈
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("支出记录保存成功！");
        reset({
          text: "",
          category: undefined,
          amount: 0,
          date: undefined,
        }); // 明确重置所有字段
      }
    } catch (err) {
      console.error("提交过程中发生错误:", err);
      toast.error("提交失败，请检查网络连接或稍后重试。");
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">添加新的支出记录</h2>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* --- 字段 1: 支出描述 (text) --- */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>支出描述</FormLabel>
                <FormControl>
                  <Input placeholder="输入商品或服务的名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- 字段 2: 支出日期 (date) - 日历选择器 --- */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>支出日期</FormLabel>
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
                          <span>选择日期</span>
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

          {/* --- 字段 3: 类别 (category) - 下拉菜单 --- */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>支出类别</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  key={field.value || "empty"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择支出类别" />
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

          {/* --- 字段 4: 金额 (amount) - 数字输入 --- */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>金额 (¥)</FormLabel>
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
                        field.onChange(undefined);
                      } else {
                        const intValue = parseInt(rawValue, 10);
                        field.onChange(
                          isNaN(intValue) || intValue < 1 ? undefined : intValue
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
                <FormDescription>输入本次支出的准确金额。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- 提交按钮 --- */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存记录"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewRecord;

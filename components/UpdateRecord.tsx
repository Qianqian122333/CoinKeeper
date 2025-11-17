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

// 分类选项
const CATEGORIES = [
  { label: "食品饮料", value: "food" },
  { label: "交通出行", value: "transport" },
  { label: "住房租金", value: "housing" },
  { label: "娱乐休闲", value: "entertainment" },
  { label: "账单/费用", value: "bills" },
  { label: "其他", value: "other" },
] as const;

// 表单验证 Schema
const formSchema = z.object({
  text: z.string().min(1, {
    message: "描述至少需要 1 个字符。",
  }),

  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    message: "请选择一个支出类别。",
  }),

  amount: z.number().min(0.01, {
    message: "金额必须大于 0。",
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

  // 提交处理函数
  async function onSubmit(values: EditFormValues) {
    try {
      const result = await editRecord({
        id: record.id,
        ...values,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("记录更新成功！");
        onOpenChange(false);
      }
    } catch (err) {
      console.error("更新记录时出错:", err);
      toast.error("更新失败，请重试");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑支出记录</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 支出描述 */}
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

            {/* 支出类别 */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>支出类别</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
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

            {/* 金额 */}
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

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "保存更改"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRecord;

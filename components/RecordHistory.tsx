"use client";

import { use, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteRecord } from "@/app/actions/deleteRecord";
import { toast } from "react-hot-toast";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface ExpenseRecord {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: string;
}

interface RecordHistoryProps {
  recordsPromise: Promise<{
    records?: ExpenseRecord[];
    error?: string;
  }>;
}

// 类别选项
const CATEGORIES = [
  { label: "全部类别", value: "all" },
  { label: "食品饮料", value: "food" },
  { label: "交通出行", value: "transport" },
  { label: "住房租金", value: "housing" },
  { label: "娱乐休闲", value: "entertainment" },
  { label: "账单/费用", value: "bills" },
  { label: "其他", value: "other" },
];

// 类别中文映射
const CATEGORY_LABELS: { [key: string]: string } = {
  food: "食品饮料",
  transport: "交通出行",
  housing: "住房租金",
  entertainment: "娱乐休闲",
  bills: "账单/费用",
  other: "其他",
};

// 类别颜色映射（与饼图颜色保持一致）
const CATEGORY_COLORS: { [key: string]: string } = {
  food: "#0088FE", // 蓝色
  transport: "#00C49F", // 绿色
  housing: "#FFBB28", // 黄色
  entertainment: "#FF8042", // 橙色
  bills: "#8884D8", // 紫色
  other: "#82CA9D", // 薄荷绿
};

const ITEMS_PER_PAGE = 5;

const RecordHistory = ({ recordsPromise }: RecordHistoryProps) => {
  const result = use(recordsPromise);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (result.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>支出记录</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const allRecords = result.records || [];

  // 生成可用的月份选项（从记录中提取）
  const availableMonths = Array.from(
    new Set(
      allRecords.map((record) => {
        const date = new Date(record.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a)); // 降序排列，最新的月份在前

  // 根据类别和月份筛选记录
  const filteredRecords = allRecords.filter((record) => {
    const matchCategory =
      selectedCategory === "all" || record.category === selectedCategory;

    const recordMonth = (() => {
      const date = new Date(record.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    })();
    const matchMonth = selectedMonth === "all" || recordMonth === selectedMonth;

    return matchCategory && matchMonth;
  });

  // 计算分页
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    setCurrentPage(1);
  };

  // 格式化月份显示
  const formatMonthLabel = (monthValue: string) => {
    const [year, month] = monthValue.split("-");
    return `${year}年${parseInt(month)}月`;
  };

  // 删除记录
  const handleDelete = async (recordId: string) => {
    if (!confirm("确定要删除这条记录吗？")) {
      return;
    }

    setDeletingId(recordId);
    try {
      const result = await deleteRecord(recordId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("记录已删除");
      }
    } catch (error) {
      console.error("删除记录时出错:", error);
      toast.error("删除失败，请重试");
    } finally {
      setDeletingId(null);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (allRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>支出记录</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">暂无记录</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <CardTitle>支出记录</CardTitle>
          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="选择月份" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部月份</SelectItem>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonthLabel(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          共 {filteredRecords.length} 条记录
        </p>
      </CardHeader>
      <CardContent>
        {currentRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">该类别暂无记录</p>
        ) : (
          <>
            <div className="space-y-4">
              {currentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{record.text}</h3>
                      <span
                        className="text-xs px-2 py-1 rounded text-white font-medium"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[record.category] || "#82CA9D",
                        }}
                      >
                        {CATEGORY_LABELS[record.category] || record.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(record.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-lg font-semibold ${
                        record.amount < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      ¥{Math.abs(record.amount).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                      disabled={deletingId === record.id}
                      className="hover:bg-red-50 hover:text-red-500"
                    >
                      {deletingId === record.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页控制 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  上一页
                </Button>
                <span className="text-sm text-gray-600">
                  第 {currentPage} / {totalPages} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  下一页
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordHistory;

"use client";

import { use } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseRecord {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: string;
}

interface ChartData {
  name: string;
  value: number;
  count: number;
  [key: string]: string | number;
}

// 类别中文映射
const CATEGORY_LABELS: { [key: string]: string } = {
  food: "食品饮料",
  transport: "交通出行",
  housing: "住房租金",
  entertainment: "娱乐休闲",
  bills: "账单/费用",
  other: "其他",
};

// 类别颜色映射（固定每个类别的颜色）
const CATEGORY_COLORS: { [key: string]: string } = {
  food: "#0088FE", // 蓝色
  transport: "#00C49F", // 绿色
  housing: "#FFBB28", // 黄色
  entertainment: "#FF8042", // 橙色
  bills: "#8884D8", // 紫色
  other: "#82CA9D", // 薄荷绿
};

interface RecordChartProps {
  recordsPromise: Promise<{
    records?: ExpenseRecord[];
    error?: string;
  }>;
}

const RecordChart = ({ recordsPromise }: RecordChartProps) => {
  const result = use(recordsPromise);

  if (result.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>支出分析</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-red-500">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const records = result.records || [];

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>支出分析</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-gray-500">暂无数据</p>
        </CardContent>
      </Card>
    );
  }

  // 按类别分组并计算总金额
  const categoryData: {
    [key: string]: { total: number; count: number };
  } = {};

  records.forEach((record: ExpenseRecord) => {
    const category = record.category || "other";
    if (!categoryData[category]) {
      categoryData[category] = { total: 0, count: 0 };
    }
    categoryData[category].total += Math.abs(record.amount);
    categoryData[category].count += 1;
  });

  // 转换为图表数据格式
  const chartData: ChartData[] = Object.entries(categoryData).map(
    ([category, info]) => ({
      name: CATEGORY_LABELS[category] || category,
      value: info.total,
      count: info.count,
      category: category, // 保存原始类别用于颜色映射
    })
  );

  // 计算总金额
  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>支出分析</CardTitle>
        <p className="text-sm text-gray-600">
          总支出: ¥{totalAmount.toFixed(2)}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category] || "#82CA9D"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `¥${value.toFixed(2)}`,
                name,
              ]}
              labelFormatter={(label: string) => `类别: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RecordChart;

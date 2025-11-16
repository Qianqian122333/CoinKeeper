"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface ExpenseRecord {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: string;
}

export async function getRecords(): Promise<{
  records?: ExpenseRecord[];
  error?: string;
}> {
  // 获取当前登录用户
  const { userId } = await auth();

  if (!userId) {
    return { error: "用户未登录或未找到。" };
  }

  try {
    // 获取当前用户的所有记录，按日期降序排列
    const dbRecords = await db.record.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    // 转换为客户端需要的格式
    const records: ExpenseRecord[] = dbRecords.map((record) => ({
      id: record.id,
      text: record.text,
      amount: record.amount,
      category: record.category,
      date: record.date.toISOString(),
    }));

    return { records };
  } catch (error) {
    console.error("Error fetching records:", error);
    return { error: "从数据库获取记录时出错。" };
  }
}

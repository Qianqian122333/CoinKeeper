// 文件名: src/actions/addExpenseRecord.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// 定义从客户端接收的数据结构
interface ExpensePayload {
  text: string;
  amount: number;
  category: string;
  date: string; // 客户端已格式化为 YYYY-MM-DD 字符串
}

// 定义返回结果结构
interface RecordResult {
  data?: ExpensePayload;
  error?: string;
}

/**
 * 添加新的支出记录到数据库。
 * @param payload 客户端提交的已验证和格式化好的数据。
 */
export async function addExpenseRecord(
  payload: ExpensePayload
): Promise<RecordResult> {
  // 客户端已验证必填字段，但服务器端应该始终再次检查
  if (!payload.text || !payload.amount || !payload.category || !payload.date) {
    return { error: "数据不完整，缺少必填字段。" };
  }

  const { text, amount, category } = payload;
  let date: string;

  // --- 日期转换（服务器端安全处理）---
  try {
    // 客户端传来的是 YYYY-MM-DD 字符串。将其转换为 UTC 中午的 ISO 日期。
    const inputDate = payload.date;
    const [year, month, day] = inputDate.split("-");
    const dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
    );
    date = dateObj.toISOString();
  } catch (error) {
    console.error("Invalid date format from client:", error);
    return { error: "日期格式无效。" };
  }

  // --- 用户认证 ---
  const { userId } = await auth();

  if (!userId) {
    return { error: "用户未登录或未找到。" };
  }

  // --- 数据库操作 ---
  try {
    const createdRecord = await db.record.create({
      data: {
        text,
        amount,
        category,
        date, // 使用服务器端转换的 ISO 日期
        userId,
      },
      // 选择返回的字段，以匹配 RecordResult 接口
      select: {
        text: true,
        amount: true,
        category: true,
        date: true,
      },
    });

    // 将数据库返回的 Date 对象转换回 string 格式（或保持 Date 对象，取决于您的需求）
    const recordData: ExpensePayload = {
      text: createdRecord.text,
      amount: createdRecord.amount,
      category: createdRecord.category,
      // 假设 db.record.create 返回的 date 已经是 Date 对象
      date: createdRecord.date?.toISOString() || date,
    };

    // 重新验证首页路径，更新数据列表
    revalidatePath("/");

    return { data: recordData };
  } catch (error) {
    console.error("Error adding expense record:", error);
    return {
      error: "添加支出记录时发生意外错误，请重试。",
    };
  }
}

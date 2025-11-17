"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface EditRecordData {
  id: string;
  text: string;
  amount: number;
  category: string;
}

export async function editRecord(data: EditRecordData) {
  try {
    // 1. 验证用户身份
    const { userId } = await auth();
    if (!userId) {
      return { error: "未授权，请先登录" };
    }

    // 2. 验证必填字段
    if (!data.id || !data.text || !data.category || data.amount <= 0) {
      return { error: "请填写所有必填字段" };
    }

    // 3. 查找记录并验证所有权
    const existingRecord = await db.record.findUnique({
      where: { id: data.id },
      select: { userId: true },
    });

    if (!existingRecord) {
      return { error: "记录不存在" };
    }

    if (existingRecord.userId !== userId) {
      return { error: "无权编辑此记录" };
    }

    // 4. 更新记录
    const updatedRecord = await db.record.update({
      where: { id: data.id },
      data: {
        text: data.text,
        amount: data.amount,
        category: data.category,
      },
      select: {
        id: true,
        text: true,
        amount: true,
        category: true,
        date: true,
      },
    });

    // 5. 重新验证路径以刷新数据
    revalidatePath("/");

    return { success: true, record: updatedRecord };
  } catch (error) {
    console.error("编辑记录时出错:", error);
    return { error: "编辑失败，请重试" };
  }
}

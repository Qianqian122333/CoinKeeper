"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteRecord(
  recordId: string
): Promise<{ success?: boolean; error?: string }> {
  // 获取当前登录用户
  const { userId } = await auth();

  if (!userId) {
    return { error: "用户未登录或未找到。" };
  }

  if (!recordId) {
    return { error: "记录ID不能为空。" };
  }

  try {
    // 先查询记录是否存在且属于当前用户
    const record = await db.record.findUnique({
      where: { id: recordId },
      select: { userId: true },
    });

    if (!record) {
      return { error: "记录不存在。" };
    }

    if (record.userId !== userId) {
      return { error: "无权删除此记录。" };
    }

    // 删除记录
    await db.record.delete({
      where: { id: recordId },
    });

    // 重新验证首页路径，更新数据列表
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting record:", error);
    return { error: "删除记录时发生错误。" };
  }
}

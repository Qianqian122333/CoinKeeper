import AddNewRecord from "@/components/AddNewRecord";
import Guest from "@/components/Guest";
import RecordChart from "@/components/RecordChart";
import RecordHistory from "@/components/RecordHistory";
import { currentUser } from "@clerk/nextjs/server";
import { getRecords } from "@/app/actions/getRecord";
import Welcome from "@/components/Welcome";

const HomePage = async () => {
  const user = await currentUser();
  if (!user) return <Guest />;

  // 创建 Promise 传递给客户端组件
  const recordsPromise = getRecords();

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 桌面端: 左右布局，移动端: 垂直堆叠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:grid-rows-1">
        {/* 左侧列 */}
        <div className="space-y-6">
          <Welcome />
          <AddNewRecord />
        </div>

        {/* 右侧列 - 支出分析 */}
        <RecordChart recordsPromise={recordsPromise} />
      </div>

      {/* 底部全宽 */}
      <div className="mt-6">
        <RecordHistory recordsPromise={recordsPromise} />
      </div>
    </main>
  );
};

export default HomePage;

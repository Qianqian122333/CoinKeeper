import AddNewRecord from "@/components/AddNewRecord";
import AIInsights from "@/components/AIInsights";
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
    <main>
      <Welcome />
      <AddNewRecord />
      <RecordChart recordsPromise={recordsPromise} />
      <AIInsights />
      <RecordHistory recordsPromise={recordsPromise} />
    </main>
  );
};

export default HomePage;

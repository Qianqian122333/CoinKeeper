import AddNewRecord from "@/components/AddNewRecord";
import AIInsights from "@/components/AIInsights";
import ExpenseStates from "@/components/ExpenseStates";
import Guest from "@/components/Guest";
import RecordChart from "@/components/RecordChart";
import RecordHistory from "@/components/RecordHistory";
import { currentUser } from "@clerk/nextjs/server";

const HomePage = async () => {
  const user = await currentUser();
  if (!user) return <Guest />;
  return (
    <main>
      <div className="text-green-500">welcome back {user.firstName}!</div>
      <AddNewRecord />
      <RecordChart />
      <ExpenseStates />
      <AIInsights />
      <RecordHistory />
    </main>
  );
};

export default HomePage;

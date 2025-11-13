import { currentUser } from "@clerk/nextjs/server";

const HomePage = async () => {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;
  return <div>HomePage</div>;
};

export default HomePage;

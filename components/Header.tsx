import checkUser from "@/lib/checkUser";
import { SignedIn, SignInButton, UserButton, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
const Header = () => {
  const user = checkUser();
  console.log(`current user: ${user}`);
  return (
    <nav className="flex justify-between px-5 h-14 items-center border-b border-amber-500">
      <div>
        <Link
          href="/"
          className="
          text-xl font-bold tracking-wider 
          bg-clip-text text-transparent 
          bg-[linear-gradient(145deg,#FFD700_0%,#FFC107_10%,#FF8C00_35%,#CC5500_70%,#FFC107_85%,#FFD700_100%)]
          
        "
        >
          CoinKeeper
        </Link>
      </div>
      <div className="flex gap-4">
        <div className="cursor-pointer">
          <ModeToggle />
        </div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button asChild className="cursor-pointer">
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Header;

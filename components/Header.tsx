import checkUser from "@/lib/checkUser";
import { SignedIn, SignInButton, UserButton, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  const user = checkUser();
  console.log(`current user: ${user}`);

  return (
    <nav className="flex justify-between px-5 h-14 items-center border-b border-amber-500">
      <div>
        <Link href="/">CoinKeeper</Link>
      </div>

      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </nav>
  );
};

export default Header;

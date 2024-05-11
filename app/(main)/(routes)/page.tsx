import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="">
      Home Page!
      <br />
      <UserButton afterSignOutUrl="/" /><br/>
      <ModeToggle />
    </div>
  );
}

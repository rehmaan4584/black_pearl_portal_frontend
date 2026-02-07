import { Moon, Sun } from "lucide-react";
import { Breadcrumb } from "./ui/breadcrumb";
export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <Breadcrumb />
        </div>

        <div>
          <Moon />
        </div>
      </div>
    </header>
  );
}

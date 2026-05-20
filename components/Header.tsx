import { Moon, Sun } from "lucide-react";
import { Breadcrumb } from "./ui/breadcrumb";
export default function Header() {
  return (
    <header className="glass sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
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

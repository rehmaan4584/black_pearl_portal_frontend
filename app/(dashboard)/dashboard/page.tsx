import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
      <div className="flex items-center justify-center min-h-full px-4 rounded-lg">
        <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg border-2 shadow-lg">
          <CardHeader className="text-center space-y-4 p-6 md:p-10">
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Welcome to Black Pearl Clothing Brand
            </CardTitle>
            <CardDescription className="text-sm md:text-base lg:text-lg">
              Use Dashboard To Manage Your Store
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
  );
}

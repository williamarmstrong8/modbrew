import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="border-0 bg-white/80 backdrop-blur-sm max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="text-6xl">☕</div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800">Page Not Found</h1>
              <p className="text-slate-600">
                Looks like this page got lost in the coffee beans. Let's get you back on track!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;


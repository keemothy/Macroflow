"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { supabase } from "@/utils/supabase/client";

// shadcn card components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  // checking user session (if logged in then redirect to dashboard, o/w redirect to /login)
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  // handle login w/ google OAUTH

  const handleLogin = () => {
    window.location.href = "/api/google";
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?')`,
      }}
    >
      <Card className="w-full max-w-sm shadow-lg border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-orange-600">
            Macroflow
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full py-6 text-base font-medium"
            onClick={handleLogin}
          >
            <img
              className="mr-2 h-5 w-5"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png"
              alt="Google"
            />
            Sign in here with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

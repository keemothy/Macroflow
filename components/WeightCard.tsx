"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scale, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function WeightCard() {
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    async function getTodayWeight() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("weight_logs")
        .select("weight")
        .eq("log_date", new Date().toISOString().split("T")[0])
        .maybeSingle();

      if (data) setWeight(data.weight.toString());
      setLoading(false);
    }
    getTodayWeight();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("weight_logs").upsert({
        user_id: user.id,
        weight: parseFloat(weight),
        log_date: new Date().toISOString().split("T")[0],
      });

      if (!error) {
        setSavedStatus(true);
        setTimeout(() => setSavedStatus(false), 2000);
      }
    }
    setSaving(false);
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-sm font-bold text-slate-800">
            Today's Weight
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-10 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.0"
                className="bg-white border-blue-100 focus:ring-blue-500 font-bold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                lbs
              </span>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className={`transition-all ${savedStatus ? "bg-green-500 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : savedStatus ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

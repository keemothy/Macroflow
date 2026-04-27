"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// shadcdn components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);

  // form for logging user health data and put into supabase
  const [formData, setFormData] = useState({
    gender: "",
    feet: "",
    inches: "",
    age: "",
    current_weight: "",
    target_weight: "",
    activity_level: "",
  });

  // get user health data
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFormData({
          gender: data.gender || "",
          feet: data.feet?.toString() || "",
          inches: data.inches?.toString() || "",
          age: data.age?.toString() || "",
          current_weight: data.current_weight?.toString() || "",
          target_weight: data.target_weight?.toString() || "",
          activity_level: data.activity_level?.toString() || "",
        });
      }
    };
    fetchProfile();
  }, []);

  // func for changing user health inputs
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // func for saving health metrics to supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // metrics calculations for BMI and calorie intake
    const weightKg = parseFloat(formData.current_weight) * 0.453592;
    const heightCm =
      parseInt(formData.feet) * 30.48 + parseInt(formData.inches) * 2.54;
    const age = parseInt(formData.age);
    const activity = parseFloat(formData.activity_level);

    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr = formData.gender === "male" ? bmr + 5 : bmr - 161;

    const tdee = Math.round(bmr * activity);

    // save data to supabase
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      gender: formData.gender,
      feet: parseInt(formData.feet),
      inches: parseInt(formData.inches),
      age: age,
      current_weight: parseFloat(formData.current_weight),
      target_weight: parseFloat(formData.target_weight),
      activity_level: activity,
      target_calories: tdee,
      updated_at: new Date(),
    });

    setLoading(false);
    if (!error) {
      alert(`Your daily calorie intake is ${tdee} calories.`);
    } else {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Health Profile</CardTitle>
          <CardDescription>
            Please enter your details to calculate your macro targets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(val) => handleChange("gender", val)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feet">Height (Feet)</Label>
                <Input
                  id="feet"
                  type="number"
                  value={formData.feet}
                  onChange={(e) => handleChange("feet", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inches">Height (Inches)</Label>
                <Input
                  id="inches"
                  type="number"
                  value={formData.inches}
                  onChange={(e) => handleChange("inches", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-weight">Current Weight (lbs)</Label>
                <Input
                  id="current-weight"
                  type="number"
                  value={formData.current_weight}
                  onChange={(e) =>
                    handleChange("current_weight", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-weight">Target Weight (lbs)</Label>
                <Input
                  id="target-weight"
                  type="number"
                  value={formData.target_weight}
                  onChange={(e) =>
                    handleChange("target_weight", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select
                value={formData.activity_level}
                onValueChange={(val) => handleChange("activity_level", val)}
              >
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">
                    Sedentary (Little to no exercise)
                  </SelectItem>
                  <SelectItem value="1.375">
                    Lightly Active (1-3 days/week)
                  </SelectItem>
                  <SelectItem value="1.55">
                    Moderately Active (3-5 days/week)
                  </SelectItem>
                  <SelectItem value="1.725">
                    Very Active (6-7 days/week)
                  </SelectItem>
                  <SelectItem value="1.9">
                    Extra Active (Physical job/Training)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setFormData({
                gender: "",
                feet: "",
                inches: "",
                age: "",
                current_weight: "",
                target_weight: "",
                activity_level: "",
              })
            }
          >
            Reset
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Calculate Macros"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

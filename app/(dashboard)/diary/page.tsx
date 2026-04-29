"use client";

import React, { useState, useEffect, useCallback } from "react";

// shadcn components; use card, and tabs
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusCircle, Utensils, Search, Loader2, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { supabase } from "@/utils/supabase/client";

interface FoodLog {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meal_type: string;
  day_of_week: string;
  image_url?: string;
  [key: string]: any;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["Breakfast", "Lunch", "Dinner", "Other"];

export default function DiaryPage() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [activeMeal, setActiveMeal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loggedFoods, setLoggedFoods] = useState<FoodLog[]>([]);

  const fetchLoggedFoods = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoggedFoods([]);
      return;
    }

    const { data, error } = await supabase
      .from("food_logs")
      .select("*")
      .eq("day_of_week", selectedDay)
      .eq("user_id", user.id);

    if (!error) {
      setLoggedFoods((data as FoodLog[]) || []);
    }
  }, [selectedDay]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/food/search?query=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const addFoodToLog = async (item: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { error } = await supabase.from("food_logs").insert({
      user_id: user.id,
      food_name: item.label,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
      carbs: item.carbs,
      image_url: item.image,
      meal_type: activeMeal?.toLowerCase(),
      day_of_week: selectedDay,
    });

    if (error) {
      console.error("DB INSERT ERROR:", error);
    } else {
      setSearchQuery("");
      setSearchResults([]);
      fetchLoggedFoods();
    }
  };

  const deleteFoodLog = async (id: string) => {
    const { error } = await supabase.from("food_logs").delete().eq("id", id);
    if (!error) fetchLoggedFoods();
  };

  useEffect(() => {
    fetchLoggedFoods();
  }, [fetchLoggedFoods]);

  const getFoodsByMeal = (meal: string) =>
    loggedFoods.filter((f) => f.meal_type === meal.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
      <div className="flex justify-center mb-8">
        <Tabs
          value={selectedDay}
          onValueChange={setSelectedDay}
          className="w-full"
        >
          <TabsList className="grid grid-cols-7 w-full h-12 bg-slate-100 p-1">
            {DAYS.map((day) => (
              <TabsTrigger key={day} value={day} className="rounded-md">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Calories", key: "calories", unit: "kcal" },
          { label: "Protein", key: "protein", unit: "g" },
          { label: "Carbs", key: "carbs", unit: "g" },
          { label: "Fats", key: "fat", unit: "g" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 bg-white rounded-2xl border shadow-sm"
          >
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold">
              {loggedFoods.reduce(
                (acc, curr) => acc + (Number(curr[stat.key]) || 0),
                0,
              )}
              <span className="text-xs font-normal text-slate-400 ml-1">
                {stat.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {MEALS.map((meal) => (
          <Card
            key={meal}
            className="border-none shadow-sm bg-white overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between py-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Utensils className="w-4 h-4 text-blue-600" />
                </div>
                <CardTitle className="text-md font-bold">{meal}</CardTitle>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 font-semibold"
                    onClick={() => setActiveMeal(meal)}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Food
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add to {meal}</DialogTitle>
                    <DialogDescription className="sr-only">
                      Search for food items to add to your {meal} log.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Search (e.g. Chicken)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {searchResults.map((item: any, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 border rounded-xl hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.label}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold">
                              {item.label}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.calories} kcal
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => addFoodToLog(item)}
                        >
                          +
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent className="pt-4">
              {getFoodsByMeal(meal).length > 0 ? (
                <div className="space-y-3">
                  {getFoodsByMeal(meal).map((food) => (
                    <div
                      key={food.id}
                      className="group flex justify-between items-center text-sm border-b pb-2 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {food.food_name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {food.calories} kcal • P: {food.protein}g • C:{" "}
                          {food.carbs}g • F: {food.fat}g
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteFoodLog(food.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic py-2">
                  Start logging your meals!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

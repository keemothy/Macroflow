import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;

  try {
    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`,
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Edamam responded with ${response.status}: ${errorBody}`);
      throw new Error(`Edamam Error ${response.status}`);
    }

    const data = await response.json();

    const simplifiedResults = data.hints.map((hint: any) => ({
      foodId: hint.food.foodId,
      label: hint.food.label,
      calories: Math.round(hint.food.nutrients.ENERC_KCAL),
      protein: Math.round(hint.food.nutrients.PROCNT),
      fat: Math.round(hint.food.nutrients.FAT),
      carbs: Math.round(hint.food.nutrients.CHOCDF),
      image: hint.food.image,
    }));

    return NextResponse.json(simplifiedResults);
  } catch (error: any) {
    console.error("DEBUG - Edamam Error:", error.message);
    return NextResponse.json(
      {
        error: "Edamam Fetch Failed",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

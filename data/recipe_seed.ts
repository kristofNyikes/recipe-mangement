import { RecipeSeed } from "@/app/types";

export const recipes: RecipeSeed[] = [
  {
    title: "Classic Spaghetti Carbonara",
    description: "Creamy Italian pasta with eggs, cheese, and crispy pancetta.",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    ingredients: [
      {
        name: "Spaghetti",
        amount: 400,
        unit: "G",
      },
      {
        name: "Pancetta",
        amount: 150,
        unit: "G",
      },
      {
        name: "Eggs",
        amount: 3,
        unit: "PIECE",
      },
      {
        name: "Parmesan Cheese",
        amount: 100,
        unit: "G",
      },
      {
        name: "Black Pepper",
        amount: 1,
        unit: "TSP",
      },
      {
        name: "Salt",
        amount: 0.5,
        unit: "TSP",
      },
      {
        name: "Olive Oil",
        amount: 30,
        unit: "ML",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        text: "Bring a large pot of salted water to a boil and cook spaghetti according to package directions until al dente.",
      },
      {
        stepNumber: 2,
        text: "While pasta cooks, dice pancetta and fry in a skillet with olive oil over medium heat until crispy (about 5-7 minutes).",
      },
      {
        stepNumber: 3,
        text: "In a bowl, whisk together eggs, grated Parmesan, black pepper, and salt until smooth.",
      },
      {
        stepNumber: 4,
        text: "Drain spaghetti, reserving 1/2 cup of pasta water. Immediately add hot pasta to the skillet with pancetta.",
      },
      {
        stepNumber: 5,
        text: "Remove from heat and quickly pour in the egg mixture, tossing vigorously to create a creamy sauce. Add pasta water if needed to loosen.",
      },
      {
        stepNumber: 6,
        text: "Serve immediately with extra Parmesan on top.",
      },
    ],
  },
  {
    title: "Vegan Sweet Potato & Black Bean Chili",
    description:
      "Hearty, plant-based chili with smoky flavors and lots of protein.",
    prepTime: 15,
    cookTime: 35,
    servings: 6,
    ingredients: [
      {
        name: "Sweet Potatoes",
        amount: 800,
        unit: "G",
      },
      {
        name: "Black Beans",
        amount: 400,
        unit: "G",
      },
      {
        name: "Diced Tomatoes",
        amount: 400,
        unit: "G",
      },
      {
        name: "Onion",
        amount: 1,
        unit: "PIECE",
      },
      {
        name: "Garlic",
        amount: 4,
        unit: "PIECE",
      },
      {
        name: "Chili Powder",
        amount: 2,
        unit: "TBSP",
      },
      {
        name: "Cumin",
        amount: 1,
        unit: "TBSP",
      },
      {
        name: "Olive Oil",
        amount: 30,
        unit: "ML",
      },
      {
        name: "Vegetable Broth",
        amount: 500,
        unit: "ML",
      },
      {
        name: "Salt",
        amount: 1,
        unit: "TSP",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        text: "Peel and dice sweet potatoes into 2cm cubes. Dice onion and mince garlic.",
      },
      {
        stepNumber: 2,
        text: "Heat olive oil in a large pot over medium heat. Sauté onion until translucent (about 5 minutes).",
      },
      {
        stepNumber: 3,
        text: "Add garlic, chili powder, and cumin. Cook for 1 minute until fragrant.",
      },
      {
        stepNumber: 4,
        text: "Add sweet potatoes, black beans, diced tomatoes, and vegetable broth. Stir to combine.",
      },
      {
        stepNumber: 5,
        text: "Bring to a boil, then reduce heat and simmer for 25-30 minutes until sweet potatoes are tender.",
      },
      {
        stepNumber: 6,
        text: "Season with salt and pepper to taste. Serve hot with rice or tortilla chips.",
      },
    ],
  },
  {
    title: "Greek Lemon Herb Salmon",
    description:
      "Oven-baked salmon fillets with fresh herbs, lemon, and garlic.",
    prepTime: 10,
    cookTime: 18,
    servings: 2,
    ingredients: [
      {
        name: "Salmon Fillets",
        amount: 600,
        unit: "G",
      },
      {
        name: "Lemon",
        amount: 2,
        unit: "PIECE",
      },
      {
        name: "Olive Oil",
        amount: 45,
        unit: "ML",
      },
      {
        name: "Garlic",
        amount: 3,
        unit: "PIECE",
      },
      {
        name: "Fresh Oregano",
        amount: 10,
        unit: "G",
      },
      {
        name: "Fresh Dill",
        amount: 10,
        unit: "G",
      },
      {
        name: "Salt",
        amount: 1,
        unit: "TSP",
      },
      {
        name: "Black Pepper",
        amount: 0.5,
        unit: "TSP",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        text: "Preheat oven to 200°C (400°F). Line a baking sheet with parchment paper.",
      },
      {
        stepNumber: 2,
        text: "Zest and juice one lemon. Slice the second lemon into thin rounds.",
      },
      {
        stepNumber: 3,
        text: "In a small bowl, mix olive oil, lemon zest, lemon juice, minced garlic, chopped oregano, dill, salt, and pepper.",
      },
      {
        stepNumber: 4,
        text: "Place salmon fillets on the baking sheet and brush generously with the herb mixture.",
      },
      {
        stepNumber: 5,
        text: "Top each fillet with lemon slices and bake for 15-18 minutes, until salmon flakes easily with a fork.",
      },
      {
        stepNumber: 6,
        text: "Garnish with extra fresh herbs and serve with roasted vegetables.",
      },
    ],
  },
  {
    title: "Moroccan Chickpea & Vegetable Tagine",
    description:
      "Aromatic North African stew with warm spices, chickpeas, and root vegetables.",
    prepTime: 20,
    cookTime: 40,
    servings: 5,
    ingredients: [
      {
        name: "Chickpeas",
        amount: 500,
        unit: "G",
      },
      {
        name: "Carrots",
        amount: 300,
        unit: "G",
      },
      {
        name: "Zucchini",
        amount: 250,
        unit: "G",
      },
      {
        name: "Onion",
        amount: 2,
        unit: "PIECE",
      },
      {
        name: "Garlic",
        amount: 5,
        unit: "PIECE",
      },
      {
        name: "Cumin",
        amount: 2,
        unit: "TSP",
      },
      {
        name: "Coriander",
        amount: 1.5,
        unit: "TSP",
      },
      {
        name: "Cinnamon",
        amount: 0.5,
        unit: "TSP",
      },
      {
        name: "Ginger",
        amount: 1,
        unit: "TSP",
      },
      {
        name: "Canned Tomatoes",
        amount: 400,
        unit: "G",
      },
      {
        name: "Vegetable Broth",
        amount: 300,
        unit: "ML",
      },
      {
        name: "Olive Oil",
        amount: 40,
        unit: "ML",
      },
      {
        name: "Dried Apricots",
        amount: 100,
        unit: "G",
      },
      {
        name: "Salt",
        amount: 1,
        unit: "TSP",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        text: "Dice onion, mince garlic, peel and slice carrots into rounds, and chop zucchini into chunks.",
      },
      {
        stepNumber: 2,
        text: "Heat olive oil in a large heavy-bottomed pot or tagine over medium heat. Sauté onion until soft (6-8 minutes).",
      },
      {
        stepNumber: 3,
        text: "Add garlic, cumin, coriander, cinnamon, and ginger. Cook for 2 minutes until aromatic.",
      },
      {
        stepNumber: 4,
        text: "Add carrots, zucchini, chickpeas, canned tomatoes, vegetable broth, and diced apricots. Stir well.",
      },
      {
        stepNumber: 5,
        text: "Bring to a simmer, cover, and cook for 30-35 minutes until vegetables are tender and flavors meld.",
      },
      {
        stepNumber: 6,
        text: "Season with salt and pepper to taste.",
      },
      {
        stepNumber: 7,
        text: "Serve hot over couscous or with crusty bread, garnished with fresh cilantro.",
      },
    ],
  },
  {
    title: "Triple Chocolate Brownies",
    description:
      "Ultra-fudgy brownies with three types of chocolate for the ultimate indulgence.",
    prepTime: 20,
    cookTime: 30,
    servings: 12,
    ingredients: [
      {
        name: "Dark Chocolate",
        amount: 200,
        unit: "G",
      },
      {
        name: "Butter",
        amount: 150,
        unit: "G",
      },
      {
        name: "Sugar",
        amount: 250,
        unit: "G",
      },
      {
        name: "Brown Sugar",
        amount: 100,
        unit: "G",
      },
      {
        name: "Eggs",
        amount: 4,
        unit: "PIECE",
      },
      {
        name: "Flour",
        amount: 120,
        unit: "G",
      },
      {
        name: "Cocoa Powder",
        amount: 40,
        unit: "G",
      },
      {
        name: "Milk Chocolate Chips",
        amount: 150,
        unit: "G",
      },
      {
        name: "White Chocolate Chips",
        amount: 100,
        unit: "G",
      },
      {
        name: "Salt",
        amount: 0.5,
        unit: "TSP",
      },
      {
        name: "Vanilla Extract",
        amount: 1,
        unit: "TSP",
      },
    ],
    steps: [
      {
        stepNumber: 1,
        text: "Preheat oven to 175°C (350°F). Grease and line a 20x20cm baking pan with parchment paper.",
      },
      {
        stepNumber: 2,
        text: "Melt dark chocolate and butter together in a heatproof bowl over simmering water (double boiler method). Stir until smooth and remove from heat.",
      },
      {
        stepNumber: 3,
        text: "In a large bowl, whisk together sugar, brown sugar, and eggs until pale and fluffy (about 3-4 minutes).",
      },
      {
        stepNumber: 4,
        text: "Pour the melted chocolate mixture into the egg mixture and fold gently with a spatula until combined.",
      },
      {
        stepNumber: 5,
        text: "Sift in flour, cocoa powder, and salt. Fold until just combined (do not overmix).",
      },
      {
        stepNumber: 6,
        text: "Fold in milk chocolate chips and white chocolate chips, reserving a few for topping.",
      },
      {
        stepNumber: 7,
        text: "Pour the batter into the prepared pan, smooth the top, and sprinkle reserved chocolate chips on top.",
      },
      {
        stepNumber: 8,
        text: "Bake for 28-32 minutes. The brownies should have a crackly top and a slight wobble in the center.",
      },
      {
        stepNumber: 9,
        text: "Allow to cool completely in the pan before cutting into 12 squares.",
      },
    ],
  },
];

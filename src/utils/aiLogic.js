export const getAISuggestions = (weather) => {
    if (!weather) return null;

    const { main, wind, weather: weatherDetails } = weather;
    const temp = main.temp;
    const condition = weatherDetails[0].main.toLowerCase(); // Rain, Clear, Clouds, Snow, Drizzle, Thunderstorm
    const windSpeed = wind.speed;
    const humidity = main.humidity;

    const suggestions = {
        clothing: [],
        activities: [],
        travel: "",
        mood: ""
    };

    // Clothing Logic
    if (temp < 5) {
        suggestions.clothing.push("Heavy winter coat", "Gloves", "Scarf", "Thermal wear");
    } else if (temp < 15) {
        suggestions.clothing.push("Jacket or Hoodie", "Jeans", "Layered clothing");
    } else if (temp < 25) {
        suggestions.clothing.push("T-shirt", "Light trousers", "Comfortable shoes");
    } else {
        suggestions.clothing.push("Shorts", "Tank top", "Breathable fabrics", "Sunglasses", "Hat");
    }

    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) {
        suggestions.clothing.push("Umbrella", "Raincoat", "Waterproof shoes");
    } else if (condition.includes("snow")) {
        suggestions.clothing.push("Snow boots", "Waterproof gear");
    }

    // Activities Logic
    if (condition.includes("rain") || condition.includes("snow") || condition.includes("thunderstorm")) {
        suggestions.activities.push("Read a book", "Watch movies", "Indoor gaming", "Cook a new recipe", "Visit a museum");
        suggestions.mood = "Cozy & Relaxed";
    } else if (condition.includes("clear") && temp > 15 && temp < 30) {
        suggestions.activities.push("Hiking", "Picnic", "Cycling", "Outdoor photography", "Gardening");
        suggestions.mood = "Energetic & Happy";
    } else if (condition.includes("clouds")) {
        suggestions.activities.push("Walking", "Light jogging", "Photography", "Coffee shop visit");
        suggestions.mood = "Calm & Reflective";
    } else if (temp > 30) {
        suggestions.activities.push("Swimming", "Beach visit", "Stay hydrated", "Indoor mall shopping");
        suggestions.mood = "Chill & Cool";
    } else {
        suggestions.activities.push("Yoga", "Meditation", "Review your goals");
        suggestions.mood = "Balanced";
    }

    // Travel Logic
    if (condition.includes("thunderstorm") || condition.includes("snow") || windSpeed > 20) {
        suggestions.travel = "⚠️ Poor driving conditions. Stay home if possible.";
    } else if (condition.includes("rain") || condition.includes("mist") || condition.includes("fog")) {
        suggestions.travel = "🚗 Drive carefully. Wet/slippery roads or low visibility.";
    } else if (temp > 35) {
        suggestions.travel = "🚗 Check tire pressure and engine coolant before long drives.";
    } else {
        suggestions.travel = "✅ Excellent conditions for travel.";
    }

    return suggestions;
};

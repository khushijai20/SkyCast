export const getAISuggestions = (weather) => {
    if (!weather) return null;

    const { main, wind, weather: weatherDetails } = weather;
    const temp = main.temp;
    const condition = weatherDetails[0].main.toLowerCase();
    const windSpeed = wind.speed;

    let gear = "";
    if (temp < 10) gear = "Heavy winter coat, thermal wear, and gloves are highly recommended.";
    else if (temp < 20) gear = "A light jacket or hoodie with jeans would be perfect for this weather.";
    else if (temp < 30) gear = "Shorts and breathable cotton t-shirts will keep you comfortable.";
    else gear = "Extremely hot! Wear loose light-colored clothing, a hat, and plenty of sunscreen.";

    if (condition.includes("rain") || condition.includes("drizzle")) gear += " Don't forget an umbrella!";

    let activity = "";
    if (condition.includes("rain") || condition.includes("storm")) activity = "Perfect time for indoor activities like reading, gaming, or a cozy movie marathon.";
    else if (condition.includes("clear") && temp > 15 && temp < 32) activity = "Ideal for outdoor sports, a park picnic, or a refreshing evening walk.";
    else if (temp > 32) activity = "Stay cool! A trip to the swimming pool or a visit to an indoor mall is recommended.";
    else activity = "A good day for a light jog or a visit to your favorite local coffee shop.";

    let travel = "";
    if (condition.includes("storm") || windSpeed > 15) travel = "High alerts! Avoid long drives due to potential visibility issues and strong winds.";
    else if (condition.includes("rain") || condition.includes("mist")) travel = "Roads might be slippery. Drive cautiously and maintain a safe following distance.";
    else travel = "skies look favorable! Perfect conditions for a road trip or visiting nearby attractions.";

    let lifestyle = "";
    if (main.humidity > 80) lifestyle = "High humidity might feel sticky. Keep your skin hydrated and stay in well-ventilated areas.";
    else if (temp < 5) lifestyle = "Cold weather! A warm cup of hot chocolate or soup will help maintain your body heat.";
    else lifestyle = "The weather seems balanced. A great time to catch up on garden work or balcony relaxation.";

    return [
        {
            title: "What to Wear",
            description: gear
        },
        {
            title: "Recommended Activity",
            description: activity
        },
        {
            title: "Travel Conditions",
            description: travel
        },
        {
            title: "Lifestyle Tip",
            description: lifestyle
        }
    ];
};

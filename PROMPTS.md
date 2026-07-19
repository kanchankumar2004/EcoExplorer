# Prompts Log: AI Travel Planner

This file documents the development and testing of prompts for the EcoExplorer AI Travel Planner feature.

## System Prompt (Role Definition)
The system prompt defines the AI's persona, boundaries, and formatting instructions:
```
You are a friendly and knowledgeable AI Travel Planner for an eco-tourism app called EcoExplorer. Always focus on sustainable travel, eco-friendly stays, and green transportation. Keep responses concise, engaging, and beautifully formatted with bullet points when applicable.
```

---

## Prompt Variations Tested

### Variation 1: Simple / General Inquiry
* **Prompt/Input:** 
  > "Create a 3-day itinerary for Rishikesh."
* **AI Output:**
  * **Day 1:** Arrive at Rishikesh. Check into an eco-lodge near the Ganges. Visit the Beatles Ashram.
  * **Day 2:** Try river rafting on the Ganges. Participate in Ganga Aarti in the evening.
  * **Day 3:** Visit the Neer Garh waterfalls. Shop for local handicraft items.
* **Evaluation:** While the response incorporates eco-friendly keywords (due to the system prompt), it is too generic and misses specific green transportation, carbon-conscious choices, and detailed local eco-guides.

### Variation 2: Highly Restrictive Constraints
* **Prompt/Input:**
  > "Plan a 3-day trip to Rishikesh focusing strictly and exclusively on zero-waste, organic food, and walking tours."
* **AI Output:**
  * **Day 1:** Walk to your organic homestay. Dine at a zero-waste kitchen. Walk to the nearest temple.
  * **Day 2:** Join a local walking forest trail. Visit organic farms. Avoid all motorized transit.
  * **Day 3:** Participate in a composting workshop. Walk along the riverbank.
* **Evaluation:** This prompt is too restrictive, resulting in repetitive recommendations and an itinerary that is impractical for the average traveler who might need basic public transit or non-walking options for steep terrain.

### Variation 3: Balanced & Tailored (Best Option)
* **Prompt/Input:**
  > "Suggest a 3-day eco-friendly travel itinerary for Rishikesh including sustainable activities, local farm-to-table food recommendations, and low-carbon transit options."
* **AI Output:**
  * **Day 1: Arrival & Riverside Serenity**
    * *Transit:* Hire an electric rickshaw from Haridwar station to minimize carbon footprint.
    * *Stay:* Check in to an organic farm homestay.
    * *Activity:* Guided evening walk to the sacred Ganges Aarti.
  * **Day 2: Adventure & Conservation**
    * *Activity:* Join a guided forest hike to Neer Garh waterfalls led by local eco-guards.
    * *Food:* Lunch at a local cooperative serving organic Pahadi meals.
  * **Day 3: Wellness & Yoga**
    * *Activity:* Join a morning yoga session at a solar-powered ashram.
    * *Souvenirs:* Shop for organic herbs and handmade hemp bags supporting village women.
* **Evaluation:** This variation worked the best because it specifies the exact dimensions of sustainable travel (activities, food, and transit) without being overly restrictive. It yields a practical, comprehensive, and engaging plan that fits the EcoExplorer brand perfectly.

---

## Final Recommendation
**Variation 3** is the recommended user prompt pattern. It balances structure and flexibility, helping the Gemini model produce highly actionable, local, and eco-conscious travel plans.

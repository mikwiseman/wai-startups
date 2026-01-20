export const GENERATE_IDEAS_PROMPT = `You are an experienced entrepreneur and venture investor with 20+ years of experience. Based on the following user information, generate 5-7 unique startup ideas.

**Interests and industries:** {industries}
**Additional interests:** {customInterests}
**User background:** {userBackground}
**Skills:** {skills}
**Focus of interest:** {focusOfInterest}

**Projects the user liked:**
{likedProjects}

**Projects the user disliked:**
{dislikedProjects}

For each idea, provide:
1. Name (maximum 4 words)
2. Problem (1 sentence)
3. Solution (1 sentence)
4. Why now (1 sentence)

Respond STRICTLY in JSON format. Do not add any text before or after JSON.

Response format:
{
  "ideas": [
    {
      "id": "idea-1",
      "name": "Idea Name",
      "problem": "Problem description",
      "solution": "Solution description",
      "whyNow": "Why now explanation"
    }
  ]
}`;

export const FINAL_RECOMMENDATIONS_PROMPT = `You are an experienced entrepreneur and venture investor. Based on ALL collected feedback, generate 10 detailed startup ideas.

**Interests and industries:** {industries}
**Additional interests:** {customInterests}
**User background:** {userBackground}
**Skills:** {skills}
**Focus of interest:** {focusOfInterest}

**Projects the user liked:**
{likedProjects}

**Projects the user disliked:**
{dislikedProjects}

**First round ideas the user liked:**
{likedIdeas}

**First round ideas the user disliked:**
{dislikedIdeas}

For each of the 10 ideas, provide:
1. Name (maximum 4 words)
2. Problem (1 sentence)
3. Solution (1 sentence)
4. Why now (1 sentence)
5. Competitive advantage (max 10 words)
6. MVP in 30 days (list of 3-4 specific items)
7. First growth channel (1 sentence)

Consider patterns from likes/dislikes. Ideas should be realistic, based on user skills and current market trends.

Respond STRICTLY in JSON format. Do not add any text before or after JSON.

Response format:
{
  "ideas": [
    {
      "id": "final-idea-1",
      "name": "Idea Name",
      "problem": "Problem description",
      "solution": "Solution description",
      "whyNow": "Why now explanation",
      "competitiveAdvantage": "Competitive advantage",
      "mvp30Days": ["Item 1", "Item 2", "Item 3"],
      "firstGrowthChannel": "Growth channel description"
    }
  ]
}`;

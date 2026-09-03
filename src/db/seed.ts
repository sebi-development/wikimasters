import db, { sql } from "@/db/index";
import { seed } from "drizzle-seed";
import { articles, usersSync } from "@/db/schema";

async function main() {
  try {
    console.log("🌱 Starting DB seed...");

    console.log("🧹 Truncating articles table and restarting identity...");
    await sql.query("TRUNCATE TABLE articles RESTART IDENTITY CASCADE;");

    console.log("🔎 Querying existing users...");
    let users = await db
      .select({ id: usersSync.id })
      .from(usersSync)
      .orderBy(usersSync.id);

    if (users.length === 0) {
      console.log("👤 No users found, inserting default seed user...");
      await db.insert(usersSync).values({
        id: "seed-user-001",
        name: "Seed User",
        email: "seed@example.com",
      });
      users = [{ id: "seed-user-001" }];
    }

    const defaultAuthorId = users[0].id;
    const ids = users.map((user) => user.id);

    console.log("🍩 Using drizzle-seed to restore original data...");
    await seed(db, { articles }, { seed: 1337 }).refine((funcs) => ({
      articles: {
        count: 25,
        columns: {
          authorId: funcs.valuesFromArray({
            values: ids,
            isUnique: false,
          }),
          content: funcs.valuesFromArray({
            values: [
              "*Sometimes I think the best way to debug JavaScript is to pretend the bug is shy.*\nI whisper `console.log` into its ear and if it doesn't blush I add more `console.log`.\nIf it still won't blush, I rename the file and call it \"ancient wisdom.md\" and hope for the best.",
              "**If a website loads slowly in the forest and no one's there to notice, is it still a performance problem?**\nI like to leave a `TODO: optimize` comment so future me has something to feel guilty about.\nOne day we'll invent a framework that fixes itself, and then we'll all feel obsolete and oddly relieved.",
              "Sometimes I imagine AI as a polite librarian that keeps rearranging your code into mysterious haikus.\nIt writes tests, then writes more tests for the tests, then asks me where it left my keys.\nI rewarded it with a coffee emoji and it returned my `null` reference with a sonnet.",
              'I like to think of CSS as a quiet conspiracy between `div`s and `float`.\nWhen they get together they whisper, "let\'s be unpredictable today," and the layout obliges.\nIf you catch them plotting, throw a `grid` at them and walk away slowly.',
              "There is nothing more spiritual than finally getting `npm install` to finish without errors.\nFor a moment you stand at the terminal and gaze into the dependency graph like it's a small, compliant cosmos.\nThen some transitive package updates and the quiet cosmos becomes chaos again.",
              '*A good commit message is like a fortune cookie: concise, mysterious, and slightly optimistic.*\nI once wrote "fix stuff" and the repo forgave me because the tests passed.\nAt the release party we all toasted with empty energy drink cans and the CI kept humming like a lullaby.',
              'When AI suggests a refactor, I nod like a Jedi and say "use the Force."\nThen I open the PR and watch the humans argue about semicolons.\nIf the argument ends in a 2–1 vote and a bike-shedding session, progress has been made.',
              'The best time to deploy is always after you\'ve gone home, fed your plants, and forgotten that you deployed.\nIf something goes wrong, call it a "surprise feature" and add it to the changelog under `enhancement`.\nEventually your users will love it, or you\'ll rename it to "beta until further notice."',
              "I entered a room once and the whiteboard asked for my opinion on the architecture.\nI drew a smiley face and wrote `microservices` under it because the smiley was clearly decoupled.\nThe next sprint we replaced the smiley with a service and everything worked *but* the coffee machine stopped responding.",
              "If code is poetry, then React is free verse and TypeScript is the editor who insists on footnotes.\nI like writing components that are tiny, honest, and slightly apologetic.\nWhen they render, they clap politely and the browser pretends it wasn't moved to tears.",
            ],
            isUnique: false,
          }),
          title: funcs.loremIpsum({
            sentencesCount: 1,
          }),
          imageUrl: funcs.default({ defaultValue: null }),
          published: funcs.default({ defaultValue: true }),
        },
        updatedAt: funcs.timestamp(),
        createdAt: funcs.timestamp(),
        slug: funcs.string({
          isUnique: true,
        }),
      },
    }));

    console.log(`✅ Restored 25 original article(s) into the database\n`);

    try {
      await sql.query(
        `SELECT setval(pg_get_serial_sequence('articles','id'), COALESCE((SELECT MAX(id) FROM articles), 1), true);`,
      );
      console.log("✅ Sequence synced after drizzle-seed");
    } catch (err) {
      console.warn("⚠️ Failed to sync articles sequence after drizzle-seed:", err);
    }

    console.log("📝 Inserting real news seed articles...");

    const seedArticles = [
      {
        title: "Everything We Learned From the New GTA 6 Trailer & Why the Hype is Real! 🚗💨",
        slug: `gta-6-gameplay-trailer-${Date.now()}-1`,
        content: `
# Return to Vice City: The Next Generation of Open World Gaming

Rockstar Games has finally dropped the latest gameplay look for **Grand Theft Auto VI**, and to say the internet is exploding would be an absolute understatement! As a lifelong fan of the franchise, seeing Leonida rendered with this level of detail is a dream come true.

---

## 🔑 Key Release Details & News

* **Setting:** The fictional state of **Leonida** (based on Florida), featuring an expanded, modern-day **Vice City**.
* **Dual Protagonists:** Meet **Lucia** (the franchise's first female protagonist since 1999) and her partner-in-crime **Jason**, bringing a *Bonnie and Clyde* dynamic to the story.
* **Target Platforms:** PlayStation 5 and Xbox Series X/S at launch.
* **Engine Improvements:** Powered by the latest iteration of RAGE, featuring real-time water physics, dense crowd simulation, and unprecedented volumetric clouds.

---

## 🤯 Fun Facts & Mind-Blowing Details

1. **Social Media Satire:** The trailer heavily features an in-game TikTok/Instagram-style social network, poking fun at real-world viral Florida incidents (including Florida Man shenanigans and alligator intrusions!).
2. **Unmatched NPC Density:** Beaches and city streets are populated with hundreds of unique NPCs with realistic AI routines, day-night schedules, and dynamic responses.
3. **Vehicle & Customization Depth:** Interior vehicle physics, mirror reflection rendering, and deep car customization look set to rival dedicated racing simulators.

---

> *"Leonida isn't just bigger; it feels alive in a way no game world has ever achieved."*

### Why I'm Beyond Excited

The attention to detail is just insane — from NPC tan lines to realistic hair movement and atmospheric weather effects. Rockstar is setting a whole new benchmark for open-world games once again. Mark your calendars, because this is going to be history in the making!
        `.trim(),
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        published: true,
        isAnonymous: true,
        authorId: defaultAuthorId,
        summary: "An overview of the groundbreaking GTA VI gameplay trailer, highlighting Vice City's return, dual protagonists Lucia and Jason, and fun trivia about NPC density and social media satire.",
      },
      {
        title: "Meta's Aggressive AI-Driven Layoffs Backfire as Technical Debt and Glitches Mount",
        slug: `meta-ai-layoffs-backfire-${Date.now()}-2`,
        content: `
# The Cost of Replacing Human Expertise with Automation

Over the past year, **Meta** implemented aggressive headcount reductions in critical engineering, content moderation, and operational teams, pledging to replace large portions of routine workflows with automated Large Language Model (LLM) agents and generative AI infrastructure.

Recent internal leaks and industry reports reveal that the strategy has encountered severe friction, leading to unexpected operational bottlenecks and degraded system reliability.

---

## 📉 Where the Strategy Went Wrong

### 1. Codebase Degradation & Regressions
Automated code generation tools introduced subtle logic bugs across core platforms (Instagram, Threads, and Meta Ads). Without senior staff engineers who held domain context for legacy backend services, resolving critical regressions took twice as long.

### 2. Moderation & Ad Review Breakdown
Replacing human moderation teams with automated AI filters led to widespread false positives. Innocent advertiser accounts faced erroneous suspensions, while sophisticated spam operations bypassed the automated checks.

### 3. Re-Hiring at a Premium
Reports confirm that Meta has quietly had to open contract positions and reach out to previously laid-off senior engineers to restore critical infrastructure oversight—often at higher contracting rates.

---

## 💡 Key Takeaways for Tech Executives

* **AI is an Augmentation Tool, Not a Full Replacement:** LLMs excel at drafting and boilerplating, but lack system-level context, strategic reasoning, and accountability.
* **Domain Knowledge Loss:** When senior talent leaves, institutional knowledge leaves with them, creating hidden technical debt that automated systems cannot diagnose.
* **The Cost of Friction:** Downtime and customer frustration from AI errors quickly erode any short-term savings achieved through headcount reduction.
        `.trim(),
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        published: true,
        isAnonymous: false,
        authorId: defaultAuthorId,
        summary: "Meta's effort to replace engineering and operational roles with AI automated agents backfires, causing increased technical debt, moderation breakdowns, and quiet rehiring.",
      },
    ];

    for (const articleData of seedArticles) {
      await db.insert(articles).values(articleData);
    }

    console.log(`✅ Inserted ${seedArticles.length} new seed article(s) into the database\n`);

    try {
      await sql.query(
        `SELECT setval(pg_get_serial_sequence('articles','id'), COALESCE((SELECT MAX(id) FROM articles), 1), true);`,
      );
      console.log("✅ Sequence synced after seeding");
    } catch (err) {
      console.warn("⚠️ Failed to sync articles sequence after seeding:", err);
    }
  } catch (err) {
    console.error("💥 Seed failed:", err);
    process.exit(1);
  }
}

void main();
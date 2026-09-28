// N°1 Academy course content (English; Spanish and Portuguese in lessons.es.ts / lessons.pt.ts,
// which must keep the same modules, lessons and order). Module titles and time estimates live in
// messages/*.json under academy.modules.items; this file holds the lessons.
// Quiz questions live in quizzes.ts. Correct answers are never stored in this repo —
// they live only in the Supabase table quiz_answer_key (see supabase/schema.sql).
//
// Lesson bodies use a small markdown subset rendered by components/academy/LessonBody.tsx:
//   ## Heading, paragraphs, "- " bullets, "1. " numbered lists, "> " callouts, **bold**.

import { course as courseEs } from './lessons.es';
import { course as coursePt } from './lessons.pt';

export type Lesson = {
  slug: string;
  title: string;
  minutes: number;
  body: string;
};

export type CourseModule = {
  number: string;
  summary: string;
  lessons: Lesson[];
  exercise: { title: string; body: string };
};

export const course: CourseModule[] = [
  {
    number: '01',
    summary:
      'What modern AI really is, where it fits in a marketing funnel, and how to use it without putting your brand or your customers at risk.',
    lessons: [
      {
        slug: 'what-ai-actually-is',
        title: 'What AI Actually Is (and Isn’t)',
        minutes: 35,
        body: `
Most of the AI tools marketers use today are built on **large language models** (LLMs) — systems trained on huge amounts of text to predict the most likely next word. ChatGPT, Claude and Gemini are all examples. Image and video tools work on a similar idea, trained on pictures and footage instead of text.

That one idea explains almost everything about how these tools behave. They are extremely good at producing text that *sounds* right. They do not "know" facts the way a database does, and they do not check their own work unless you ask them to.

## Generative vs. predictive AI

- **Generative AI** creates something new: a caption, an email, an image, a video script.
- **Predictive AI** scores or forecasts: which lead is most likely to buy, which customer might cancel, which ad will get the lowest cost per click.

You have probably used predictive AI for years without calling it that — ad platforms like Meta and Google use it to decide who sees your ads. What changed recently is generative AI becoming cheap, fast and available to everyone.

## What AI is good at

- Turning rough notes into a clean first draft
- Rewriting one piece of content for a different audience, length or platform
- Summarizing long documents, reviews, call transcripts or survey answers
- Brainstorming angles, hooks, subject lines and ad variations
- Spotting patterns in data you give it

## Where AI fails

- **Hallucinations:** it can state false information — fake statistics, made-up quotes, sources that don't exist — with total confidence.
- **Stale knowledge:** unless a tool can search the web, it only knows what was in its training data.
- **Generic output:** with a vague request you get vague, average content that sounds like everyone else.
- **No judgment about your business:** it doesn't know your margins, your customers, or what your brand would never say — unless you tell it.

> The rule for this whole course: AI drafts, a human decides. Treat every output as a first draft from a fast, talented intern who has never met your customers.
`,
      },
      {
        slug: 'ai-across-the-funnel',
        title: 'Where AI Fits in the Marketing Funnel',
        minutes: 40,
        body: `
The fastest way to waste time with AI is to start with the tool ("what can I do with ChatGPT?"). The fastest way to get results is to start with the funnel ("where are we losing time or customers?").

## The funnel, stage by stage

- **Awareness** — people discovering you. AI helps produce more content variations, test more ad creatives, and repurpose one video into many clips.
- **Consideration** — people comparing options. AI helps write clearer service pages, FAQs and comparison content, and answer common questions instantly with a website chat assistant.
- **Conversion** — people deciding to buy or book. AI helps respond to leads in minutes instead of hours, personalize follow-up emails, and qualify leads before a sales call.
- **Retention** — keeping customers. AI helps summarize reviews and support tickets, draft win-back emails, and flag customers who have gone quiet.

## Speed-to-lead: the easiest win

For most service businesses the biggest leak is slow follow-up. A lead fills in a form, waits a day, and books with a competitor. An AI-assisted workflow can:

1. Receive the form submission
2. Send an instant, personalized confirmation
3. Summarize the lead's request for your team
4. Alert the right person by email or text

None of that replaces a salesperson. It makes sure the salesperson starts the conversation while the lead is still interested.

## Keep a human in the loop

Decide in advance which steps AI can do alone and which need approval. A good starting rule:

- **AI alone:** internal summaries, first drafts, tagging and sorting
- **Human approval:** anything a customer will read, anything involving money, anything that could embarrass the brand

> Pick one stage of your funnel that is clearly leaking and focus there first. One working system beats ten half-finished experiments.
`,
      },
      {
        slug: 'using-ai-responsibly',
        title: 'Using AI Responsibly',
        minutes: 35,
        body: `
AI makes it easy to move fast — including in the wrong direction. A few ground rules protect your customers, your brand and your business.

## Protect customer data

- Don't paste customers' personal details (names, phone numbers, addresses, payment info, health information) into AI tools unless the tool is approved for that data and your privacy policy allows it.
- Check each tool's data settings. Many business plans let you turn off training on your data; free consumer plans often don't.
- When you analyze data with AI, remove or replace identifying details first.

## Be honest with your audience

- Never use AI to create fake reviews or testimonials, or fake "customers" in ads. Regulators such as the U.S. Federal Trade Commission treat fake reviews as deceptive, and platforms remove them.
- Don't present AI-generated images as real results — especially before-and-after photos, product photos, or photos of your team.
- If a chat assistant answers customers, make it clear they're talking to an automated assistant and give them an easy way to reach a person.

## Check facts and rights

- Verify every statistic, claim and quote before you publish. If you can't find the original source, cut it.
- Be careful with images and music that imitate a specific artist, brand or real person.
- Industries like healthcare, finance, legal and real estate have extra advertising rules. AI doesn't know them — you have to.

## Protect the brand

Write down what your brand never says or does (for example: no pressure tactics, no slang, no competitor bashing) and include that in your instructions to AI. We'll turn this into a proper brand voice guide in Module 03.

> Before anything AI-assisted goes live, ask: Is it true? Is it fair to the customer? Would I be comfortable if they knew how it was made?
`,
      },
    ],
    exercise: {
      title: 'Exercise: Your AI Opportunity Audit',
      body: `
List 10 marketing tasks you or your team do every week. For each one, note:

1. How long it takes per week
2. Which funnel stage it supports
3. Whether AI could draft it, do it with approval, or should stay fully human

Circle the two tasks with the most time saved and the lowest risk. Those are your first AI projects — you'll build one of them in Module 02.
`,
    },
  },
  {
    number: '02',
    summary:
      'Choose AI tools by the job they do, understand how automation workflows are built, and design your first workflow safely.',
    lessons: [
      {
        slug: 'choosing-your-toolkit',
        title: 'Choosing Your AI Toolkit',
        minutes: 55,
        body: `
New AI tools launch every week. You don't need most of them. Pick tools by the **job to be done**, not by hype.

## The core toolkit by job

- **Writing and thinking:** a general AI assistant such as ChatGPT, Claude or Gemini. This will be your most-used tool — drafting, rewriting, summarizing, brainstorming and analysis.
- **Design and images:** tools such as Canva (with its AI features) or Adobe Firefly for social graphics, ad variations and quick mockups.
- **Video:** AI editing tools that cut long videos into short clips, add captions and remove filler words.
- **Automation:** Zapier, Make or n8n to connect your apps so work moves between them without copy-and-paste.
- **Built-in AI:** your CRM, email platform and ad accounts likely already include AI features. Check what you're already paying for before buying something new.

## How to evaluate a tool

Before adopting any tool, answer five questions:

1. **Job:** Which specific task does it improve, and by how much?
2. **Quality:** Test it on a real task from your business, not the demo examples.
3. **Data:** Where does your data go? Can you turn off training on it?
4. **Cost:** What does it cost per month at your real usage, including extra seats?
5. **Fit:** Does it connect to the tools you already use?

## Avoid tool sprawl

Every tool adds a login, a bill and a place for information to get lost. A small business can do excellent AI marketing with **one AI assistant, one design tool and one automation platform**. Add more only when a specific job demands it.

> Run a two-week trial on one real task before you commit to any paid plan. If you can't measure the difference, you don't need the tool.
`,
      },
      {
        slug: 'automation-basics',
        title: 'Automation Basics: Triggers, Actions and Workflows',
        minutes: 60,
        body: `
Automation is where AI stops being a chat window and starts doing work while you sleep. Every automation, however complex, is built from the same parts.

## The building blocks

- **Trigger** — the event that starts the workflow. *A form is submitted. A new row is added to a sheet. A payment is received.*
- **Action** — what happens next. *Create a CRM contact. Send an email. Post a message to your team.*
- **Filter / condition** — rules that decide whether to continue. *Only if the budget is over $1,000. Only if the lead is in Florida.*
- **AI step** — an action that sends information to an AI model and uses the reply. *Summarize this lead. Classify this message as sales, support or spam. Draft a reply.*

A **workflow** is a trigger followed by a chain of actions, filters and AI steps.

## Example: an AI-assisted lead workflow

1. **Trigger:** a new lead submits your website form
2. **Action:** save the lead to your CRM or a Google Sheet
3. **AI step:** summarize what they asked for and suggest a priority (hot, warm, cold)
4. **Filter:** if hot, continue to step 5; otherwise add to a nurture email sequence
5. **Action:** text the sales owner with the summary and the lead's phone number
6. **Action:** send the lead an instant confirmation email

This one workflow can take response time from hours to minutes — without anyone watching the inbox.

## Where automations break

- A field gets renamed and the workflow stops finding the data
- An app's login expires
- The AI step returns something unexpected (a long paragraph instead of "hot")

That's why you'll build in checks, which is the next lesson.

> Think of every workflow as a sentence: "When [trigger], do [actions], but only if [conditions]." If you can't say it in one sentence, simplify it.
`,
      },
      {
        slug: 'building-your-first-workflow',
        title: 'Building Your First Workflow Safely',
        minutes: 65,
        body: `
The goal of your first automation is not to impress anyone. It's to save real time, reliably, without creating new problems.

## Step 1: Map the process by hand

Write down exactly what happens today, step by step, including who does it and which apps are involved. If the manual process is messy, automating it just makes the mess faster.

## Step 2: Start with one small, frequent task

Good first workflows run often, follow clear rules and are low-risk if something goes wrong — for example saving form leads to a sheet and alerting your team, or turning a new blog post into draft social captions for review.

## Step 3: Make AI output predictable

AI steps are the least predictable part of any workflow. Make them reliable:

- Ask for a **fixed format**: "Reply with only one word: hot, warm or cold."
- Give it the **context** it needs: what you sell, who your ideal customer is, and what makes a lead hot.
- Add a **fallback**: if the reply isn't one of the allowed words, treat it as "warm" and flag it for a human.

## Step 4: Keep a human approval step

For anything customer-facing, have AI create a **draft** — in your email tool, a document, or a Slack or email message — that a person approves before it goes out. Remove the approval step only after weeks of consistently good output.

## Step 5: Test, then monitor

1. Run the workflow with test data before going live
2. Try messy inputs: blank fields, a very long message, a message in another language
3. Turn on error notifications so you hear about failures immediately
4. Review the results weekly for the first month

## Step 6: Know the cost

Automation platforms charge by the number of tasks, and AI steps charge by usage. Estimate monthly volume before you launch so there are no surprise bills.

> Document every workflow in one place: what triggers it, what it does, who owns it, and how to turn it off. Future you will be grateful.
`,
      },
    ],
    exercise: {
      title: 'Exercise: Design Your First Workflow',
      body: `
Take one of the two tasks you circled in the Module 01 audit and design an automation for it on paper:

1. Write the one-sentence version: "When ___, do ___, but only if ___."
2. List the trigger, every action, any filters and any AI steps
3. Mark which steps need human approval
4. Write the exact instruction your AI step will receive, including the required output format
5. List three things that could go wrong and how you'll know

If you have access to Zapier, Make or n8n, build it and run it on test data.
`,
    },
  },
  {
    number: '03',
    summary:
      'Write prompts that get consistent, on-brand output the first time, and build a reusable prompt library for your team.',
    lessons: [
      {
        slug: 'anatomy-of-a-prompt',
        title: 'The Anatomy of a Strong Prompt',
        minutes: 45,
        body: `
The quality of AI output depends mostly on the quality of the instructions. "Write a post about our new service" gets you something generic. A structured prompt gets you something you can use.

## The six parts of a strong prompt

1. **Role** — who the AI should act as. *"You are an experienced social media copywriter for local service businesses."*
2. **Context** — what it needs to know. *The business, the audience, the offer, what has worked before.*
3. **Task** — exactly what to produce. *"Write three Instagram captions announcing our new weekend hours."*
4. **Format** — how the output should look. *"Each caption under 150 words, with one call to action and no more than three hashtags."*
5. **Constraints** — what to avoid. *"No emojis in the first line. Don't mention prices. Don't use the words 'game-changer' or 'unlock'."*
6. **Examples** — a sample of what good looks like, when you have one.

## Before and after

**Weak:** "Write an email about our sale."

**Strong:** "You are the email marketer for a family-owned furniture store. Our customers are homeowners aged 35–60 who value quality over the lowest price. Write a promotional email for our 20%-off dining sets event this Saturday and Sunday. Include a subject line under 45 characters, a friendly opening, three short benefit-focused paragraphs and one clear call to action to visit the showroom. Warm and straightforward tone. No pressure tactics, no fake urgency, no exclamation marks in the subject line."

The second prompt takes one extra minute to write and saves ten minutes of editing.

> If the output is bad, don't just hit "regenerate." Ask yourself which of the six parts was missing, add it, and try again.
`,
      },
      {
        slug: 'prompting-techniques',
        title: 'Techniques That Improve Every Output',
        minutes: 50,
        body: `
Once your prompts have the six parts, these techniques take the output from good to excellent.

## Show, don't just tell (few-shot prompting)

Paste two or three examples of content you love — your best-performing posts, emails that got replies — and say "match the style of these examples." Examples communicate tone far better than adjectives like "friendly" or "professional."

## Ask it to ask you questions first

End your prompt with: *"Before you start, ask me any questions you need answered to do this well."* The AI will often ask about details you forgot to include — audience, goal, offer, deadline.

## Break big tasks into steps

Don't ask for a whole campaign in one prompt. Work in stages:

1. Brainstorm 10 campaign angles
2. Pick the best two and explain why
3. Write an outline for the winner
4. Draft each piece from the outline

Each step gives you a chance to steer before the AI goes too far in the wrong direction.

## Make it critique itself

After a draft, ask: *"Review this as a skeptical customer. What's unclear, unconvincing or too salesy? Then rewrite it fixing those issues."* Self-critique catches weak spots you'd otherwise have to find yourself.

## Iterate with specific feedback

"Make it better" is vague. Say what to change: *"Shorten the second paragraph by half, replace the opening with a question, and make the call to action more specific."*

## Ask for options

Request three to five variations with different approaches — for example one emotional, one practical, one based on social proof. Choosing is faster than rewriting, and variations are exactly what you need for ad testing.

> Save any prompt that produced great output. The best prompt library is built from real wins, not from prompt lists found online.
`,
      },
      {
        slug: 'prompt-library-and-brand-voice',
        title: 'Your Prompt Library and Brand Voice Guide',
        minutes: 55,
        body: `
The difference between a person who "uses AI" and a team that gets consistent results is documentation. Two documents do most of the work.

## The brand voice guide

A one-page document you paste into any content prompt as context. It should include:

- **Who we are:** one or two sentences about the business and what makes it different
- **Who we talk to:** the ideal customer, their main problems and what they care about
- **How we sound:** three to five voice traits, each with a short "this, not that" example — *confident, not arrogant; friendly, not silly*
- **Words we use and words we never use**
- **Rules:** claims we can and can't make, legal requirements, formatting preferences
- **Examples:** two or three pieces of content that perfectly represent the brand

Many AI assistants let you save this as project instructions or a custom assistant, so you don't have to paste it every time.

## The prompt library

A shared document or spreadsheet of tested prompts your whole team can reuse. For each prompt, record:

1. **Name and use case** — "Weekly Instagram captions from a blog post"
2. **The prompt itself**, with placeholders in brackets like [BLOG POST] and [OFFER]
3. **Which tool** it works best in
4. **An example output** that shows what good looks like
5. **Owner and last-updated date**

## Keep it alive

- Review the library monthly; delete prompts nobody uses
- When a prompt produces a weak result, improve the prompt, not just the output
- When a new team member joins, the library and voice guide are their AI training

> A good prompt library turns one person's best results into the whole team's standard.
`,
      },
    ],
    exercise: {
      title: 'Exercise: Build Your Brand Voice Guide and First Three Prompts',
      body: `
1. Write a one-page brand voice guide using the template from Lesson 3 (for your business or a sample business)
2. Write three reusable prompts for tasks you do every week, using all six parts from Lesson 1
3. Test each prompt with your voice guide included, then improve the prompt at least once based on the result
4. Save the final versions — you'll use them in Module 04 and in your capstone
`,
    },
  },
  {
    number: '04',
    summary:
      'Plan content around your audience and goals, produce more of it without losing quality, and stay visible as search changes.',
    lessons: [
      {
        slug: 'strategy-before-content',
        title: 'Strategy Before Content',
        minutes: 55,
        body: `
AI can produce a hundred posts in an afternoon. That's the problem: without a strategy, you just publish more noise, faster. Strategy decides **what** is worth producing; AI helps with **how much** and **how fast**.

## Start with the goal and the audience

Every content plan should answer:

- **What business result is this for?** More booked calls, more store visits, more repeat customers?
- **Who exactly is it for?** Be specific: "homeowners in Miami planning a kitchen remodel," not "people who like design."
- **What do they need to hear to take the next step?** Their questions, doubts and objections are your best content ideas.

## Content pillars

Pick three to five recurring themes that connect what your audience cares about with what you sell. A roofing company might use:

1. **Education** — how to spot storm damage, what affects roof lifespan
2. **Proof** — real projects, customer stories, before-and-after photos
3. **Behind the scenes** — the team, the process, safety standards
4. **Offers** — inspections, seasonal promotions, financing

Pillars keep your content consistent and make it easy to brief AI: *"Write five post ideas for our Education pillar."*

## Use AI for audience research

Paste in anonymized reviews, common customer emails or sales call notes and ask: *"What are the top ten questions, fears and desired outcomes in these messages? Quote the exact phrases customers use."* Customers' own words make the strongest headlines and hooks.

> Content that answers a real customer question will always outperform content created because "we need to post something today."
`,
      },
      {
        slug: 'content-at-scale',
        title: 'Producing at Scale Without Losing Your Voice',
        minutes: 65,
        body: `
The best AI content workflows don't start from a blank prompt. They start from something original — your expertise, your stories, your real results — and use AI to multiply it.

## The repurposing pyramid

Create one substantial **pillar piece** each week or month, then break it into smaller pieces:

1. **Pillar:** a video, podcast episode, webinar or long article built on real expertise
2. **Mid-size pieces:** a blog post, an email newsletter, a LinkedIn article
3. **Micro pieces:** short video clips, quote graphics, carousel posts, captions, stories

One recorded 20-minute conversation with an expert on your team can become a month of content — and it all sounds like you, because it started with you.

## The production workflow

1. **Brief:** goal, audience, pillar, key points and call to action
2. **Draft:** AI drafts using your brand voice guide and a prompt from your library
3. **Edit:** a human adds specific details, stories and opinions and removes generic filler
4. **Fact-check:** verify every claim, number and name
5. **Approve and schedule**

The edit step is where quality lives. Look for what makes content forgettable: vague claims, empty phrases, and the same sentence structure repeated over and over. Replace them with specifics only your business could say.

## Batch your work

Create content in focused batches — for example one afternoon for a week's worth of posts — instead of a little every day. AI makes batching much faster: draft 10 posts in one session, edit them in the next, schedule them all at once.

> Your competitors have the same AI tools you do. Your advantage is your expertise, your customers' stories and your point of view. Put those into every piece.
`,
      },
      {
        slug: 'search-in-the-ai-era',
        title: 'SEO and Search in the AI Era',
        minutes: 60,
        body: `
Search is changing. Google now shows AI-generated summaries at the top of many results, and more people ask AI assistants directly. The fundamentals of being found still hold — they just matter more.

## What search engines reward

Google's guidance is clear: it rewards **helpful, reliable, people-first content**, no matter how it was produced. It penalizes content made mainly to manipulate rankings — including large amounts of thin, mass-produced pages. Its quality guidelines emphasize **E-E-A-T**:

- **Experience** — first-hand experience with the topic (real projects, real photos)
- **Expertise** — knowledge shown through depth and accuracy
- **Authoritativeness** — recognition from others (reviews, links, mentions)
- **Trustworthiness** — accurate information, clear business details, honest claims

## What this means for AI content

- Don't publish hundreds of near-identical AI pages ("plumber in [every city]"). That's exactly the pattern search engines work to demote.
- Do use AI to help with research, outlines, first drafts, FAQs and page structure — then add real experience and expertise.
- Keep your business details consistent everywhere: name, address, phone, hours, and your Google Business Profile.

## Getting mentioned in AI answers

AI assistants and AI summaries pull from sources they consider trustworthy. To improve your chances:

1. Answer specific questions clearly and directly on your pages
2. Use descriptive headings and simple structure
3. Earn reviews and mentions on reputable sites in your industry and area
4. Keep important pages up to date

> The goal isn't to trick an algorithm. It's to be the most useful, most trustworthy answer to your customers' questions — that works for search engines and AI assistants alike.
`,
      },
    ],
    exercise: {
      title: 'Exercise: One Pillar, Ten Pieces',
      body: `
1. Define three to five content pillars for your business (or a sample business)
2. Choose one pillar topic and outline a pillar piece around a real customer question
3. Using your brand voice guide and prompt library, turn it into at least ten smaller pieces across two or more platforms
4. Edit every piece by hand: add one specific detail, story or opinion to each
5. Fact-check everything and note what you changed from the AI draft
`,
    },
  },
  {
    number: '05',
    summary:
      'Focus on the numbers that drive decisions, use AI to analyze data faster without trusting it blindly, and run a simple test-and-learn loop.',
    lessons: [
      {
        slug: 'metrics-that-matter',
        title: 'Metrics That Actually Matter',
        minutes: 40,
        body: `
Marketing dashboards are full of numbers. Most of them don't change any decision. Start with the handful that connect directly to revenue.

## Vanity metrics vs. decision metrics

- **Vanity metrics** look good but don't tell you what to do: follower count, impressions, likes.
- **Decision metrics** tie to business results and tell you where to act: leads, cost per lead, conversion rate, revenue per customer.

Vanity metrics aren't useless — reach matters for awareness — but they should never be the headline of a report.

## The core metrics

- **Leads** — how many potential customers raised their hand (form, call, booking)
- **Cost per lead (CPL)** — ad spend ÷ number of leads
- **Conversion rate** — the percentage who take the next step. *If 200 people visit a landing page and 10 book a call, the conversion rate is 10 ÷ 200 = 5%.*
- **Customer acquisition cost (CAC)** — total sales and marketing cost ÷ new customers won
- **Customer lifetime value (LTV)** — the average total revenue a customer brings over the whole relationship
- **Return on ad spend (ROAS)** — revenue from ads ÷ ad spend

A healthy business earns much more from a customer over time (LTV) than it costs to acquire them (CAC).

## Pick one North Star

Choose one metric that best represents success for your current goal — for a service business, often **booked appointments** or **new customers per month**. Every other metric in your report should help explain why the North Star went up or down.

> If a number wouldn't change what you do next week, it doesn't belong at the top of your report.
`,
      },
      {
        slug: 'analyzing-data-with-ai',
        title: 'Analyzing Data With AI',
        minutes: 45,
        body: `
AI assistants can read a spreadsheet export and answer questions about it in plain English. That turns hours of spreadsheet work into minutes — if you use it carefully.

## What AI does well with data

- Summarizing a campaign export: *"Which three ads had the lowest cost per lead last month, and what do they have in common?"*
- Spotting trends: *"How did conversion rate change week by week?"*
- Grouping open-text responses: *"Group these 300 survey answers into themes and count each theme."*
- Suggesting charts and explaining what they show
- Drafting the written summary of a report

## How to get reliable answers

1. **Clean the data first.** Clear column names, one row per record, no merged cells.
2. **Remove personal information.** Delete names, emails and phone numbers before uploading.
3. **Say what the columns mean**, for example *"'Spend' is in U.S. dollars; 'Results' means leads."*
4. **Ask it to show its work:** *"Explain how you calculated this."*
5. **Spot-check the numbers.** Recalculate one or two key figures yourself before you share them.

## The big risk: confident mistakes

AI can misread a column, mix up totals and averages, or invent a number that isn't in the data. The more important the decision, the more carefully you should check. Treat AI analysis like an analyst's first pass, not a final answer.

## Correlation isn't causation

If sales went up the week you posted more videos, the videos *might* be the reason — or it might have been a holiday, a promotion, or the weather. AI will happily suggest explanations; you need to test them. That's the next lesson.

> Use AI to find the question worth asking. Use your own verification before you bet money on the answer.
`,
      },
      {
        slug: 'reporting-and-testing',
        title: 'Reporting and the Test-and-Learn Loop',
        minutes: 35,
        body: `
A report is only useful if it leads to a decision. The best marketing teams run a simple loop every week.

## A one-page weekly report

1. **North Star:** this week vs. last week vs. target
2. **What happened:** the two or three biggest changes and the likely reasons
3. **What we learned:** results from any tests that finished
4. **What we'll do next:** the specific actions for the coming week

AI can draft the "what happened" section from your data export in seconds — you check it and add the context only you know.

## The test-and-learn loop

1. **Hypothesis:** *"If we add customer photos to our ads, cost per lead will go down, because people trust real results."*
2. **Test:** change one thing at a time. Run the new version against the current one (an A/B test).
3. **Measure:** wait for enough data. A few clicks is not a result — let the test run long enough to see a consistent difference.
4. **Learn:** keep the winner, record what you learned, and plan the next test.

## Use AI to speed up each step

- Brainstorm hypotheses from your data and customer feedback
- Create the test variations (headlines, images, offers)
- Summarize the results and draft the "what we learned" notes

Keep a simple test log — date, hypothesis, what changed, result, decision. Over months it becomes one of your most valuable marketing assets: a record of what works for *your* customers.

> Small, steady weekly improvements add up. A team that runs one good test every week will outperform a team that waits for the perfect big idea.
`,
      },
    ],
    exercise: {
      title: 'Exercise: Your Measurement Plan',
      body: `
1. Choose a North Star metric for your business (or a sample business) and explain why
2. List three to five supporting decision metrics and where each one comes from
3. Take a real or sample campaign export, remove personal data, and use AI to answer three questions about it — then spot-check one answer by hand
4. Write one testable hypothesis using the format from Lesson 3
5. Draft a one-page weekly report template
`,
    },
  },
  {
    number: '06',
    summary:
      'Bring everything together in a complete AI marketing system for a real or sample business, then pass the final assessment to earn your certificate.',
    lessons: [
      {
        slug: 'capstone-brief',
        title: 'The Capstone Project Brief',
        minutes: 120,
        body: `
Your capstone is a complete, practical **AI Marketing System** for one business — your own, a client's, or a sample business you choose. It pulls together the work you've done in every module.

## What your system must include

1. **Business snapshot** — what the business sells, who its ideal customer is, and its main marketing goal for the next 90 days
2. **AI opportunity audit** — the ten tasks you reviewed in Module 01 and the two you prioritized, with the time you expect to save
3. **Automation workflow** — one workflow from Module 02, with its trigger, actions, AI steps, approval points and failure plan (built, or fully designed on paper)
4. **Brand voice guide and prompt library** — from Module 03, with at least five tested prompts
5. **Content plan** — pillars, one pillar piece and its repurposed pieces from Module 04, and a 30-day calendar
6. **Measurement plan** — North Star, supporting metrics, weekly report template and your first two test hypotheses from Module 05
7. **Responsible-use checklist** — how this system protects customer data, keeps a human in the loop, and avoids misleading content

## Guidelines

- **Be specific.** "Post more on Instagram" is not a plan. "Publish four Education posts and one Proof video every week, drafted with prompt #3 and edited by Maria" is.
- **Be realistic.** Design something that could actually run with the business's time, budget and tools.
- **Show your work.** Include real prompts, real AI outputs and what you changed in them.

## Format

Put everything in one document or slide deck that could be handed to the business owner and put to use the next day. Keep a copy — it's the portfolio piece that shows what you can do.
`,
      },
      {
        slug: 'capstone-review',
        title: 'Reviewing Your System',
        minutes: 60,
        body: `
Before you take the final assessment, review your capstone against this checklist. A system that passes every point is one a real business could put to work.

## Strategy

- The 90-day goal is specific and measurable
- The ideal customer is described clearly enough to guide content and ads
- Every part of the system connects back to the goal

## Workflow

- The workflow can be explained in one sentence
- AI steps have a fixed output format and a fallback
- Customer-facing steps have human approval
- There's a clear owner and a way to find out when it fails

## Content

- Pillars connect customer needs to what the business sells
- The pillar piece contains real expertise or experience, not just AI output
- Every piece has been edited and fact-checked

## Measurement

- There's one North Star metric
- The weekly report leads to decisions, not just numbers
- Hypotheses change one thing at a time

## Responsibility

- No personal customer data goes into tools that aren't approved for it
- No fake reviews, testimonials or misleading images
- Customers can always reach a human

## Ready for the final assessment?

The final assessment has 10 questions covering all six modules. You need **80% (8 of 10)** to pass. You can retake it if you don't pass on the first try — review the lessons for any questions you missed.

> Passing the final assessment completes the course and unlocks your N°1 Academy AI Marketing Certificate.
`,
      },
      {
        slug: 'next-steps',
        title: 'Keeping Your Skills Current',
        minutes: 20,
        body: `
AI tools change every few months. The skills in this course — thinking in funnels and workflows, writing clear instructions, protecting your brand, and measuring results — don't.

## Stay sharp

- **Run one experiment a month.** Try a new tool or technique on a real task and record the result in your test log.
- **Keep your prompt library alive.** Update prompts when tools change and delete the ones nobody uses.
- **Watch the rules.** Advertising, privacy and platform policies around AI keep evolving — check them, especially in regulated industries.
- **Teach someone else.** Walking a colleague through your workflow is the fastest way to find its gaps.

## Put it to work

The fastest way to prove what you've learned is results. Put your capstone system to work, measure it for 30 days, and write up what happened — the numbers, what you changed and what you learned. That write-up is worth more to a client or employer than any list of tools.
`,
      },
    ],
    exercise: {
      title: 'Capstone: Your AI Marketing System',
      body: `
Complete all seven parts of the capstone described in Lesson 1, review it against the checklist in Lesson 2, then take the final assessment below.
`,
    },
  },
];

const courses: Record<string, CourseModule[]> = { en: course, es: courseEs, pt: coursePt };

export function getModule(number: string, locale = 'en'): CourseModule | undefined {
  return (courses[locale] ?? course).find((m) => m.number === number);
}

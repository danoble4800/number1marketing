// N°1 Academy course content (English; Spanish and Portuguese in lessons.es.ts / lessons.pt.ts,
// which must keep the same modules, lessons and order). Module titles and time estimates live in
// messages/*.json under academy.modules.items; this file holds the lessons.
// Quiz questions live in quizzes.ts. Correct answers are never stored in this repo —
// they live only in the Supabase table quiz_answer_key (see supabase/schema.sql).
//
// Lesson bodies use a small markdown subset rendered by components/academy/LessonBody.tsx:
//   ## Heading, paragraphs, "- " bullets, "1. " numbered lists, "> " callouts, **bold**,
//   and [[shown text|glossary-id]] for a term students can tap to see its glossary definition.

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
  // "Do it on your own business" steps shown under the exercise; ticks are saved in the browser.
  checklist: string[];
};

// Passing this module's final assessment issues the certificate. Modules after it form the
// Hands-On Track: optional, unlocked in order after the certificate.
export const CERT_MODULE = '06';
export const isHandsOn = (number: string) => Number(number) > Number(CERT_MODULE);

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
    checklist: [
      "List 10 marketing tasks you do every week and how long each one takes",
      "Mark the funnel stage each task supports",
      "Pick the two tasks with the most time saved and the lowest risk",
      "Write down what customer data you will never paste into an AI tool",
      "Decide who approves anything AI writes before customers see it",
    ],
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
    checklist: [
      "Choose one AI writing tool and one automation tool, and cancel any you don’t use",
      "Write your first workflow as one sentence: “When ___, do ___, but only if ___”",
      "Map every step, and mark the ones that need a human to approve",
      "Build it (or draw it) and run it on test data",
      "Write down who owns it, how you’ll know it broke and how to turn it off",
    ],
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
    checklist: [
      "Write a one-page brand voice guide",
      "Turn three weekly tasks into prompts with all six parts",
      "Test each prompt and improve it at least once",
      "Save the final prompts in one shared prompt library",
      "Put a date on the calendar to review the library every quarter",
    ],
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
    checklist: [
      "Write down the business’s content goal and ideal customer",
      "Choose three to five content pillars",
      "Write one pillar piece that answers a real customer question",
      "Turn it into at least ten smaller pieces for two platforms",
      "Add one real detail, story or opinion to every piece, and fact-check it",
      "Put a 30-day calendar together and batch-produce the first week",
    ],
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
    checklist: [
      "Choose one North Star metric and write down why",
      "Pick three to five supporting metrics and where each comes from",
      "Ask AI three questions about a real export, and check one answer by hand",
      "Write one test hypothesis that changes only one thing",
      "Set up a one-page weekly report and a weekly time to fill it in",
    ],
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
    checklist: [
      "Choose the business your capstone is for",
      "Put all seven parts of the capstone in one document",
      "Review it against every point in the Lesson 2 checklist",
      "Hand it to the owner (or a friend) and ask what’s unclear",
      "Run the system for 30 days and write down what happened",
    ],
  },
  {
    number: '07',
    summary:
      'Get a local business found on Google Maps and in local search: how the local ranking works, how to set up a Google Business Profile properly, and how to keep the business’s details consistent everywhere online.',
    lessons: [
      {
        slug: 'how-local-search-works',
        title: 'How Local Search Works',
        minutes: 30,
        body: `
When someone searches "coffee near me" or "barber South Boston", Google shows a map with three businesses under it. That box is called the [[local pack|local-pack]], and for most small businesses it matters more than any ad. People who search this way usually want to buy today.

The businesses in the local pack come from their [[Google Business Profile|gbp]]: the free listing that shows the business's name, hours, photos, reviews and a button to call or get directions.

## The three things Google looks at

Google says local results are based on three things:

- **Relevance:** how well the profile matches what the person searched for. The right categories, services and description matter here.
- **Distance:** how far the business is from the person searching, or from the place named in the search. You can't change this one.
- **Prominence:** how well known and trusted the business is. Reviews, ratings, links, mentions around the web and a complete, active profile all count.

You can't move a shop closer to its customers, so the work is all in relevance and prominence.

## Why this is the first thing to fix

- It's free. A Google Business Profile costs nothing.
- It's where the buyers are. Local searches often turn into a call, a visit or directions within the same day.
- Most small businesses leave it half done. Wrong hours, no photos since opening day, a vague category, reviews with no replies. Fixing that alone often moves a business up.

## What a "good" profile looks like

- The right **primary category** (the single most important relevance setting)
- Correct name, address, phone number and hours, including holiday hours
- A clear description that says what the business does, for whom, and where
- Real photos of the place, the team and the work, added regularly
- Services or products listed with short descriptions
- Recent reviews, with a reply from the owner on each one
- Posts in the last month or two

> The name on the profile must match the real-world business name. Adding keywords to the name ("Tony's Pizza Best Pizza Boston") breaks Google's rules and can get the profile suspended.
`,
      },
      {
        slug: 'optimizing-the-profile',
        title: 'Setting Up and Optimizing a Google Business Profile',
        minutes: 50,
        body: `
Search the business's name on Google Maps first. Many businesses already have a profile that Google created automatically. If it exists, choose **Claim this business** instead of making a new one. Duplicate profiles confuse Google and customers.

## Step 1: Verify it

Google needs to confirm the business is real before most edits go live. Depending on the business, verification can be a video of the location, a phone call, a text, an email or a postcard. Follow the options Google offers in the profile. Until it's verified, work on the rest, but don't expect it to show up well.

## Step 2: Get the basics exactly right

- **Name:** the name on the sign, nothing added.
- **Primary category:** the most specific one that fits ("Barber shop", not "Beauty"). Add a few **secondary categories** for other main services.
- **Address or service area:** a shop that customers visit shows its address. A business that goes to customers (plumber, mobile detailer) sets a service area and can hide the address.
- **Phone and website:** a local number the business answers. The website link should go to the most relevant page.
- **Hours:** regular hours, plus special hours for holidays. Wrong hours are one of the fastest ways to earn a one-star review.

Write these details down in one place. You'll use exactly the same [[NAP|nap]] (name, address, phone) everywhere else in Lesson 3.

## Step 3: Fill in everything else

- **Description (up to 750 characters):** what the business does, who it's for, what makes it different and the area it serves. Write it for people, not for Google.
- **Services or products:** each with a short plain description and a price if the business is comfortable showing one.
- **Attributes:** things like wheelchair access, outdoor seating or women-owned, when they apply.
- **Photos:** exterior (so people recognize it when they arrive), interior, team, products and finished work. Real photos beat stock photos every time.

## Step 4: Keep it active

- **Posts:** a short update, offer or event, with a photo and a button. Once a week is a good rhythm; once a month is the minimum.
- **New photos** every month.
- **Replies to every review** (Module 08 covers how).
- **Check the Performance tab monthly:** calls, direction requests, website clicks and the searches that found the profile.

## Where AI helps

- Drafting the description from the owner's notes, then editing it to sound like them
- Turning one week's news into a post, an Instagram caption and a text to regulars
- Brainstorming the services list from the business's menu or price list
- Summarizing the Performance numbers into a two-line monthly note

A prompt that works well for posts:

> "You write Google Business Profile posts for [business], a [type of business] in [neighborhood]. Write a post of 80 to 120 words about [this week's news or offer]. Use a friendly, plain tone, mention the neighborhood once, end with one clear action (call, book or visit), and don't use hashtags or emojis."

Check every fact, price and date before posting. Google can remove posts with wrong phone numbers, links to unrelated sites or misleading offers.
`,
      },
      {
        slug: 'local-seo-beyond-google',
        title: 'Local SEO Beyond the Profile',
        minutes: 40,
        body: `
The Google Business Profile is the biggest piece, but Google also looks at what the rest of the internet says about the business. This is where [[local SEO|local-seo]] goes beyond the profile.

## Consistent details everywhere

A [[citation|citation]] is any place online that lists the business's name, address and phone number: Yelp, Apple Maps, Bing, Facebook, the chamber of commerce, industry directories. When those details match, Google trusts them. When they don't (an old address, a different phone number), it's less sure which is right.

Start with the listings that matter most:

- **Apple Business Connect** (Apple Maps and Siri, which many iPhone users search with)
- **Bing Places** (Bing, and several AI assistants that use Bing data)
- **Yelp** and **Facebook**
- The directories for the industry: for example TripAdvisor for restaurants, Healthgrades for clinics, Houzz for contractors

Use exactly the same name, address and phone number from Lesson 2. A spreadsheet with one row per listing, its link and its login keeps this manageable.

## The website supports the profile

- The website shows the same name, address, phone number and hours, usually in the footer.
- A business that serves several towns has a real page for each main service or area, with useful information, not the same text with the town name swapped.
- The homepage title says what the business is and where: "Brancato Barbershop | Haircuts and Shaves in South Boston".
- Adding [[schema markup|schema]] (a small piece of code that labels the business's details for search engines) helps Google read them correctly. Most website builders have a setting or plugin for it.
- The site loads fast and works well on a phone, where most local searches happen.

## Show up in AI answers too

More people now ask ChatGPT, Gemini or Google's AI results for a recommendation. Those answers are built from the same signals: a complete profile, consistent listings, plenty of recent reviews and a clear website. The work in this module helps there as well.

## Measure it

Once a month, write down:

- Calls, direction requests and website clicks from the Performance tab
- The number of reviews and the average rating
- Where the business shows up for its two or three most important searches (search from the neighborhood on a phone, or ask someone local to check)

> Local SEO is slow, steady work. Expect to see changes over weeks and months, not days. Anyone who promises the number one spot on Maps by next week is guessing or cheating.
`,
      },
    ],
    exercise: {
      title: 'Exercise: Local Visibility Audit and Fix List',
      body: `
Pick a local business: your own, a client's, or one near you. Using what you learned:

1. Search for it on Google Maps from a phone and screenshot what a customer sees
2. Score the profile against the "good profile" list in Lesson 1, one point per item
3. Write the correct name, address, phone, hours and primary category in one place
4. Check Apple Maps, Bing, Yelp and Facebook and note every detail that doesn't match
5. Use AI to draft a new description and two posts, then edit them until they sound like the owner
6. Turn everything into a fix list, ordered by what will make the biggest difference first

This is the same audit Number 1 Digital Marketing does for its clients. Done well, it's something a business owner would pay for.
`,
    },
    checklist: [
      'Find the business on Google Maps and claim or verify its profile',
      'Set the most specific primary category and two or three secondary ones',
      'Make the name, address, phone and hours exactly right, including holiday hours',
      'Write a 750-character description with AI, then edit it in the owner’s voice',
      'Add services or products with short descriptions',
      'Upload at least 10 real photos: outside, inside, team and work',
      'Publish a first post, and put a weekly post on the calendar',
      'Make the details match on Apple Business Connect, Bing Places, Yelp and Facebook',
      'Check that the website shows the same name, address, phone and hours',
      'Write down this month’s calls, direction requests and website clicks as a starting point',
    ],
  },
  {
    number: '08',
    summary:
      'Build a steady stream of honest reviews and answer every one of them well, using AI to draft replies and spot patterns without breaking the rules.',
    lessons: [
      {
        slug: 'why-reviews-matter',
        title: 'Why Reviews Drive Local Sales',
        minutes: 30,
        body: `
Reviews do two jobs at once. They help a business rank in the [[local pack|local-pack]], because they're part of how Google judges prominence. And they convince the person reading them to call, book or walk in.

## What customers look at

- **Rating:** most people filter out businesses below about four stars.
- **How many:** 150 reviews feel safer than 12, even at the same rating.
- **How recent:** a profile whose newest review is from last year looks closed or neglected.
- **What they say:** people read the words, especially the bad reviews, to see what went wrong.
- **The owner's replies:** a calm, helpful reply to a bad review often earns more trust than a perfect score.

## The rules (these are not optional)

- **No fake reviews.** Don't write reviews for the business, pay someone to, or have employees and family post them. In the US, the FTC rule on fake reviews allows large fines for buying, selling or writing them, and Google removes them and can restrict the profile.
- **No [[review gating|review-gating]].** Don't ask only happy customers for reviews, or send unhappy ones somewhere else first. Google's rules say to ask every customer the same way.
- **No rewards for reviews on Google.** Discounts, free items or entries into a raffle in return for a review break Google's rules.
- **No AI-written reviews,** ever. AI can help the business *reply*, never write the review.
- **Protect privacy.** Never confirm someone was a customer or share their details in a reply. This matters even more for health, legal and financial businesses.

> A steady flow of honest reviews beats any trick. Every shortcut here is either against the rules, against the law, or both.
`,
      },
      {
        slug: 'getting-more-reviews',
        title: 'Getting More Reviews',
        minutes: 40,
        body: `
Most happy customers never leave a review because nobody asked, or asking made it too much effort. The fix is to ask every customer, at the right moment, with a link that takes one tap.

## Get the review link

In the Google Business Profile, choose **Ask for reviews** (or **Get more reviews**) to copy a short link that opens the review box directly. Save it everywhere the team can reach it.

## Ask at the right moment

The best time is right after the customer got what they came for:

- A barber or salon: at checkout, while the customer is looking in the mirror
- A restaurant or café: on the receipt, or a card with the check
- A contractor or cleaner: the day the job is finished, with before-and-after photos
- An online order: a few days after delivery

## Make it easy

- **Say it in person:** "If you were happy today, a Google review really helps a small shop like ours. Here's the link."
- **A QR code or [[NFC|nfc]] card at the counter:** one tap or scan opens the review box. (Number 1 Tap Cards do exactly this.)
- **A follow-up text or email** the same day, with the link. Texts get read far more often than emails.
- **A reminder** a few days later if they haven't left one, and then stop. One reminder is helpful; more is annoying.

## Use AI and automation carefully

- Draft the request messages with AI in the business's voice, then have the owner approve them once.
- If the business has a booking or point-of-sale system, an automation can send the request after each visit (the Module 02 workflow skills apply here). Send it to **every** customer, not only the ones you think were happy.
- Keep a simple count each week: requests sent and reviews received. If requests go out and reviews don't come in, change the wording or the timing.

A request text that works:

> "Hi [first name], thanks for coming in to [business] today! If you have a minute, a quick Google review would mean a lot to us: [link]. Thank you! [owner's first name]"

Keep it short, personal, and signed by a real person.
`,
      },
      {
        slug: 'responding-with-ai',
        title: 'Responding to Reviews With AI',
        minutes: 45,
        body: `
Every review deserves a reply: it shows future customers that someone cares, and Google treats a business that responds as more active. Try to reply within a day or two.

## Replying to good reviews

Keep it short and specific. Thank them by first name, mention one detail from their review, and invite them back. Avoid pasting the same "Thanks for the review!" on every one. People notice.

## Replying to bad reviews

Use a simple four-step framework:

1. **Thank them** for taking the time to write.
2. **Acknowledge** the problem without arguing or making excuses.
3. **Take it offline:** give a name and a direct way to reach the owner or manager.
4. **Say what's changing,** if something is.

Never argue, never share details about their visit, and never reply while angry. Future customers are reading the reply more than the reviewer is.

## Let AI draft, you decide

AI is very good at a calm first draft, especially when the owner is upset. A prompt that works:

> "You reply to Google reviews for [business], a [type of business] in [neighborhood]. Our tone is [warm, direct, a little funny]. Write a reply of 40 to 80 words to the review below. Thank them by first name, mention one specific detail from their review, and don't use exclamation marks more than once. If the review is negative, apologize for their experience, don't argue, don't mention any details about their visit, and invite them to contact [owner name] at [phone or email]. Review: [paste the review]"

Then read it before posting. Make sure it sounds like the owner, says nothing that isn't true, and contains no private details.

## Reviews that break the rules

If a review is spam, from someone who was never a customer, hateful, or clearly from a competitor, report it from the profile (**Report review**) and explain why. Don't expect every report to succeed, and never ask friends to flood the profile with reviews to push it down.

## Find patterns in reviews

Every few months, copy the last 50 reviews (without names) into an AI tool and ask:

> "Group these reviews into the five most common themes, positive and negative. For each theme, give the number of reviews that mention it and one short quote. Then suggest one change the business could make based on the negative themes."

The answers are some of the best marketing and operations advice a business can get, and it's free. Use the positive themes in ads and on the website, in the customers' own words.
`,
      },
    ],
    exercise: {
      title: 'Exercise: Build a Review System',
      body: `
Using the same business as in Module 07:

1. Copy its short Google review link
2. Write the in-person line, the follow-up text and the reminder text in the business's voice (AI draft, human edit)
3. Decide when each one goes out, and who sends it
4. Write the business's reply prompt using the example from Lesson 3, filled in with its tone and contact details
5. Use it to reply to the three most recent reviews, including one negative review if there is one
6. Run the pattern prompt on the business's recent reviews and write down the top three themes

Check your system against the rules in Lesson 1 before anything goes live.
`,
    },
    checklist: [
      'Copy the short Google review link and save it where the whole team can reach it',
      'Write the in-person ask, the follow-up text and one reminder',
      'Put a QR code or NFC review card at the counter',
      'Set up a way to ask every customer, not only the happy ones',
      'Write the business’s review-reply prompt with its tone and contact details',
      'Reply to every review from the last 90 days',
      'Report any review that clearly breaks Google’s rules',
      'Run the pattern prompt on recent reviews and note the top three themes',
      'Start a weekly count of requests sent and reviews received',
    ],
  },
];

const courses: Record<string, CourseModule[]> = { en: course, es: courseEs, pt: coursePt };

export function getModule(number: string, locale = 'en'): CourseModule | undefined {
  return (courses[locale] ?? course).find((m) => m.number === number);
}

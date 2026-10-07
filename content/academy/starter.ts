// N°1 AI Starter Guide: the beginner tracks "AI for You" (09–11) and "AI for Your Business" (12–14).
// Open to every student in any order. Same lesson format as lessons.ts; Spanish and Portuguese in
// starter.es.ts / starter.pt.ts, which must keep the same modules, lessons and order.
// Scope is kept apart from the AI Marketing Course (01–08): no prompt engineering (03), content
// strategy (04), workflow building (02) or review replies (08) here; lessons point there instead.

import type { CourseModule } from './lessons';

export const starter: CourseModule[] = [
  {
    number: '09',
    summary:
      'Start here if you’ve never used AI. Have your first conversation with an AI assistant, then use it to write everyday emails and messages, including the hard ones.',
    lessons: [
      {
        slug: 'your-first-ai-chat',
        title: 'Your First Chat With an AI Assistant',
        minutes: 10,
        body: `
An [[AI assistant|ai-assistant]] is a website or app you can talk to in plain language. You type (or say) what you need, and it writes back. The best-known ones are **ChatGPT**, **Claude** and **Gemini**. All three have free versions, and any of them is fine for this guide.

## Getting started

1. Go to chatgpt.com, claude.ai or gemini.google.com (or download the app)
2. Sign up with your email or Google account
3. Type a question in the box at the bottom, just like a text message

That's it. There is no special language to learn.

## How to ask so you get something useful

Talk to it like a smart new assistant who knows nothing about you yet:

- **Say who you are:** "I run a small cleaning company" or "I'm a nurse planning a trip."
- **Say what you need:** "Write a short email to…", "Explain…", "Give me five ideas for…"
- **Say what good looks like:** "friendly, under 100 words, no jargon."

## It's a conversation

The first answer is rarely the best one. Reply to improve it: "shorter," "more casual," "make the second idea more detailed," "explain that like I'm new to this." You can keep going as long as you like.

## Three rules from day one

- **Check facts.** AI can sound sure and still be wrong. (This is called a [[hallucination|hallucination]].)
- **Don't paste secrets.** No passwords, card numbers, or private details about other people.
- **You're the editor.** Read everything before you send or use it.

> Want to get really good at asking? Module 03 (Prompt Engineering) in the AI Marketing Course goes deeper. For now, plain English is all you need.
`,
        tryIt: `Open any AI assistant and type: "I'm new to AI. In five short bullet points, what are the most useful things you could help me with this week? I [describe your job or day in one sentence]." Then reply to one bullet with "show me how."`,
      },
      {
        slug: 'everyday-emails',
        title: 'Emails and Messages in Half the Time',
        minutes: 12,
        body: `
Most people spend hours a week writing messages. AI is very good at this, as long as you give it the facts and it gives you the words.

## Five ways to use it today

- **Notes to email:** type three rough bullet points and ask, "Turn this into a polite email to my landlord."
- **Reply drafts:** paste a message you received and ask, "Draft a reply that says yes to Tuesday, no to Thursday."
- **Fix the tone:** "Make this sound friendlier," "less pushy," or "more professional."
- **Shorten it:** "Cut this to three sentences without losing the key point."
- **Translate it:** "Write this in simple Spanish for a customer," then ask a native speaker to check anything important.

## Give it the facts, not just the topic

A vague request ("write an email about the delay") gets a vague email. A good request includes who it's for, what happened, what you want them to do, and the tone:

"Write a short email to a customer. Their order is two days late because our supplier was delayed. Apologize once, give the new date (Friday), and offer free delivery. Warm, not over the top."

## Make it sound like you

AI loves words like "delighted" and "I hope this finds you well." If that isn't you, say so: "Write like a real person texting a client. No fancy words." You can also paste an email you wrote and say, "Match this style."

> Social posts and marketing emails have their own module: Module 04 (AI Content Strategy) covers writing for an audience at scale. This lesson is about the messages you send to one person.
`,
        tryIt: `Find one email or text you've been putting off. Paste it into an AI assistant (remove names and phone numbers) and ask: "Draft a short, friendly reply that [what you want to say]." Edit one line so it sounds like you, then send it.`,
      },
      {
        slug: 'hard-messages',
        title: 'Tough Conversations and Important Letters',
        minutes: 12,
        body: `
The messages we put off longest are usually the hard ones: saying no, asking for money, apologizing, complaining. AI won't feel awkward for you, which makes it a great first-draft partner.

## Good uses

- **Saying no:** "Help me turn down this request kindly without making up an excuse."
- **Chasing payment:** "Write a firm but polite reminder that an invoice is 30 days overdue."
- **Complaints:** "Help me write a clear complaint to my phone company. Here's what happened…"
- **Apologies:** "Help me apologize for missing the deadline without over-explaining."
- **Important letters:** cover letters, letters to a school, a reference request.

## Practice the conversation first

If the hard conversation is in person or on the phone, ask the AI to play the other person: "Pretend you're my landlord and you don't want to fix the heater. I'll practice asking." Then ask, "How could I have said that better?"

## Keep your judgment in charge

- **Facts come from you.** Never let AI invent dates, amounts or what someone said.
- **Read it out loud.** If it sounds stiff or too long, ask for a simpler version.
- **For legal, medical or money matters,** use AI to organize your thoughts, then check with a professional before you send anything that matters.

> A useful habit: ask "What might the other person feel when they read this?" before you send.
`,
        tryIt: `Think of one "no" you need to say. Ask an AI assistant: "Help me say no to [the request] in two or three kind, clear sentences. No fake excuses." Pick the version you like best and save it for next time.`,
      },
    ],
    exercise: {
      title: 'Exercise: Clear Three Messages',
      body: `
Pick three messages you've been avoiding: one easy, one long, one hard.

1. For each one, write the facts in bullet points first: who it's for, what happened, what you want
2. Ask your AI assistant for a draft, then ask for one improvement ("shorter," "warmer," "firmer")
3. Edit each draft so it sounds like you, and check every fact
4. Send all three today
5. Write down roughly how long it took compared with doing it alone
`,
    },
    checklist: [
      'Sign up for one free AI assistant (ChatGPT, Claude or Gemini)',
      'Ask it one question about your work and one about your life',
      'Use it to draft a reply to a real email or text, then edit and send it',
      'Use it to rewrite one message in a different tone',
      'Practice one hard conversation by asking the AI to play the other person',
    ],
  },
  {
    number: '10',
    summary:
      'See what AI can create today, from pictures and edited photos to short videos and voiceovers, and how to use it honestly.',
    lessons: [
      {
        slug: 'what-ai-can-make',
        title: 'What AI Can Create Today',
        minutes: 12,
        body: `
A few years ago, making a custom image or video meant hiring someone or learning complicated software. Now you can describe what you want in a sentence.

## What's possible right now

- **Pictures from a description:** an [[image generator|image-generator]] creates a new image from words, such as "a cozy coffee shop on a rainy morning, watercolor style."
- **Photo editing:** remove a background, erase a stranger from a photo, fix the lighting, or extend a photo so it fits a different size.
- **Short videos:** turn an image or a description into a few seconds of video, or cut a long video into short clips automatically.
- **Captions and subtitles:** add them to any video in a couple of clicks.
- **Voiceovers:** turn a written script into a natural-sounding voice ([[voice AI|voice-ai]]).
- **Design layouts:** flyers, invitations, menus and social graphics from a template plus a description.

## Where to try it

You don't need special software to start. ChatGPT and Gemini can make and edit images inside the chat. Canva and Adobe Firefly have AI tools built in, and phone editing apps such as CapCut do captions and quick video edits. Many of these are [[multimodal|multimodal]]: you can show them a photo and ask questions about it.

## What it's still bad at

- Spelling words inside images (always check signs and labels)
- Hands, crowds and small details
- Keeping the same person or product looking identical across many images
- Showing your *real* product, shop or team. AI can only guess what they look like.

> Rule of thumb: use AI to create ideas, backgrounds and illustrations. Use real photos for real things.
`,
        tryIt: `Ask ChatGPT or Gemini: "Make an image of [something you love] in the style of a children's book illustration." Then ask for one change, such as a different color, time of day or angle, and compare the two.`,
      },
      {
        slug: 'describing-images',
        title: 'Describing What You Want',
        minutes: 12,
        body: `
Image tools follow your words closely. A vague request gets a generic picture. A clear one gets something you can use.

## The five-part description

1. **Subject:** what's in the picture ("a golden retriever wearing a party hat")
2. **Setting:** where it is ("on a front porch with balloons")
3. **Style:** photo, watercolor, cartoon, flat illustration, 3D
4. **Light and mood:** bright and cheerful, soft evening light, dramatic
5. **Shape and use:** square for Instagram, tall for a phone screen, wide for a banner

"A golden retriever wearing a party hat on a front porch with balloons, bright cartoon style, cheerful, square" works far better than "dog birthday picture."

## Edit, don't restart

When the image is close, ask for small changes: "make the balloons blue," "remove the text," "zoom out a little." Most tools keep the rest of the picture the same.

## Editing your own photos

For anything real, start with your own photo and let AI improve it:

- "Remove the background and put this product on plain white."
- "Brighten this photo and make the colors look natural."
- "Extend this photo on both sides so it fits a wide banner."

## Short videos

The same idea works for video: describe the scene, the movement ("slow zoom in," "camera pans left") and the length. For talking videos, write the script first, and use AI for captions, trimming and background music.

> Save descriptions that work. Next time you need a similar image, you'll only need to change a few words.
`,
        tryIt: `Take a photo of something on your desk or table. Upload it to ChatGPT, Gemini or Canva and ask: "Remove the background and place this on a clean, light surface with soft daylight." Check whether anything about the object changed.`,
      },
      {
        slug: 'honest-visuals',
        title: 'Using AI Images and Video Honestly',
        minutes: 10,
        body: `
AI makes it easy to create things that look real. That's powerful, and it comes with responsibility.

## Don't fake what customers rely on

- Never show a product, meal, room or result that doesn't really look like that.
- Never create "customers," "before and after" photos or testimonials that aren't real.
- If a picture is an illustration or a mock-up, it's fine to use. Just don't pass it off as a real photo.

## Real people need real permission

A [[deepfake|deepfake]] is AI-made video, audio or images that show a real person doing or saying something they didn't. Never copy someone's face or voice without clear permission, including famous people, staff and family. Many places now have laws about this.

## Check the rules where you post

Some platforms ask you to label AI-made images or video, and some tools limit what you can make or how you can use it commercially. Read the terms before using AI images in ads or on products.

## How to spot fakes

You'll see more AI-made content every year. Before you believe or share something surprising:

- Look for odd details: hands, text, jewelry, reflections, backgrounds that don't make sense
- Check the source. Who posted it first?
- Search the image (Google Lens, for example) to see where else it appears
- Be extra careful with urgent voice messages asking for money, even if the voice sounds familiar

> If you'd be embarrassed when someone found out it was AI-made, don't use it that way.
`,
        tryIt: `Open Google Lens (in the Google app or Chrome) and search with any viral image you've seen this week. See where else it appears and whether anyone has questioned it. Then ask an AI assistant: "What are three signs an image might be AI-generated?"`,
      },
    ],
    exercise: {
      title: 'Exercise: Make a Set of Three',
      body: `
Create three pieces with AI, each one a different skill from this module:

1. **A new image:** a birthday card, invitation, flyer background or illustration, using the five-part description
2. **An edited real photo:** remove a background, fix the lighting or extend the edges
3. **A short clip:** a 10–20 second video with AI-made captions (a phone video is fine)

For each one, write one sentence on what you'd do differently next time. Check all three for honesty: does anything look real that isn't?
`,
    },
    checklist: [
      'Create one image from a description and ask for at least one change',
      'Edit one of your own photos with an AI tool',
      'Add automatic captions to a short video',
      'Save two image descriptions that worked well',
      'Search one surprising image online before believing or sharing it',
    ],
  },
  {
    number: '11',
    summary:
      'Use AI as a personal assistant to plan your week, handle meals, trips and budgets, think through decisions and learn new things faster.',
    lessons: [
      {
        slug: 'plan-your-week',
        title: 'Plan Your Week in Ten Minutes',
        minutes: 12,
        body: `
Planning is one of the most useful things AI does, and one of the least known. You bring the mess, and it helps you make a plan.

## The brain dump method

1. **Dump everything:** type every task, errand, appointment and worry on your mind, in any order. Don't organize it.
2. **Add your limits:** "I work 9–5 Monday to Friday, pick up the kids at 3:30 on Wednesdays, and I'm tired after 8 pm."
3. **Ask for a plan:** "Sort this into must-do this week, nice-to-do and can wait. Then suggest which day to do each must-do."
4. **Push back:** "That's too much for Monday," or "Group all the errands into one trip."

## Make it realistic

AI doesn't know how long things really take you. Tell it ("grocery shopping takes me 90 minutes"), and ask it to leave free time each day. A plan with no breaks falls apart by Tuesday.

## Connected or not

On their own, most AI assistants can't see your calendar or email. Some can if you connect them, and AI features are being built into Google, Microsoft and Apple apps. Either way, you stay in charge: AI suggests, and you put it on the calendar.

> Do the brain dump on Sunday evening or Monday morning. Ten minutes of planning saves hours of "what was I supposed to do?"
`,
        tryIt: `Type everything on your mind this week into an AI assistant, one line each, plus your working hours. Ask: "Turn this into a realistic plan for the week with one free hour each day." Move just one item onto your real calendar.`,
      },
      {
        slug: 'everyday-life',
        title: 'Meals, Trips, Budgets and Big Decisions',
        minutes: 12,
        body: `
Once you're used to asking, you'll find AI helps with the everyday jobs that eat your evenings.

## Meals

"Plan five easy weeknight dinners for a family of four. One is vegetarian, nobody likes mushrooms, and each takes under 30 minutes. Then give me one shopping list grouped by store aisle." You can also snap a photo of your fridge and ask what to cook.

## Trips

Give it the dates, budget, who's going and what you enjoy, and ask for a day-by-day plan. Then check opening hours, prices and travel times yourself. AI can be out of date or simply wrong about these.

## Budgets

Describe your monthly income and spending in rough categories and ask for ideas to save $200 a month, or help building a simple budget spreadsheet. Never paste account numbers, passwords or full bank statements.

## Big decisions

AI is a patient thinking partner. Try:

- "Help me compare these two job offers. Ask me questions first."
- "What am I not thinking about before buying a used car?"
- "Argue against this decision so I can test it."

## Know the limits

For health, legal and money matters, AI is good for understanding your options and preparing questions. It doesn't replace a doctor, lawyer or accountant who knows your situation.

> Ask "What questions should I ask the expert?" It's one of the most valuable uses of AI.
`,
        tryIt: `Ask an AI assistant: "Plan three dinners I can make this week with [three things already in your kitchen], under 30 minutes each, and give me a short shopping list for the rest." Cook one of them.`,
      },
      {
        slug: 'learn-anything',
        title: 'Learn Anything Faster',
        minutes: 10,
        body: `
Think of AI as a tutor who never gets tired of your questions.

## Ways to learn with it

- **Explain it simply:** "Explain how mortgages work like I'm completely new to this. Use an example with real numbers."
- **Go one step at a time:** "Teach me the basics of Excel formulas, one lesson at a time. Wait for me to say 'next.'"
- **Quiz me:** "Ask me five questions about what you just explained, one at a time, and tell me what I got wrong."
- **Summarize:** paste a long article or document and ask for the five key points, or for what it means for you.
- **Practice a language:** "Let's have a simple conversation in Spanish about ordering food. Correct my mistakes gently."

## Check what it tells you

AI explains things clearly even when it's wrong, so for anything important:

- Ask, "How sure are you, and where could I check this?"
- Use an assistant with web search for recent facts, and click through to the sources
- Compare with one trusted source (an official website, a textbook, a professional)

## Use it to understand, not to skip

Asking AI to do your homework or a work test teaches you nothing, and often breaks the rules. Asking it to explain until you understand is one of the best ways to learn.

> The Academy glossary works the same way: when an AI word confuses you, look it up, then ask an assistant for an example from your own life.
`,
        tryIt: `Pick something you've always wanted to understand (credit scores, how solar panels work, a sport's rules). Ask: "Explain this to me in plain English in under 150 words, then quiz me with three questions." Answer them.`,
      },
    ],
    exercise: {
      title: 'Exercise: Your AI-Planned Week',
      body: `
Run one full week with AI as your personal assistant:

1. Sunday or Monday: do a brain dump and get a realistic weekly plan
2. Plan the week's dinners and one shopping list
3. Use AI to think through one decision you've been putting off
4. Learn one new thing with the explain-and-quiz method
5. At the end of the week, write down what helped and what you'll keep doing
`,
    },
    checklist: [
      'Do a brain dump and turn it into a weekly plan',
      'Plan a week of meals with one shopping list',
      'Use AI to compare options for one real decision',
      'Learn one new topic with the explain-and-quiz method',
      'Check one important AI answer against a trusted source',
    ],
  },
  {
    number: '12',
    summary:
      'See how AI can answer customer questions by chat, text and phone day and night, what it should never handle alone, and how to set it up so customers trust it.',
    lessons: [
      {
        slug: 'what-customers-ask',
        title: 'What Customers Ask (and When)',
        minutes: 12,
        body: `
Before you add any AI, find out what your customers actually need help with. Most businesses get the same 15–20 questions over and over.

## Find your top questions

Look back through the last month of emails, texts, DMs and calls, and write down every question. Typical ones:

- Are you open now? What are your hours?
- How much does it cost?
- Do you serve my area?
- Can I book for Saturday?
- Where's my order? What's your refund policy?

## Notice when they ask

Many questions arrive in the evening and on weekends, exactly when nobody is there to answer. People usually contact more than one business, and the first to reply often gets the job. That's [[speed to lead|speed-to-lead]].

## Sort them into three groups

1. **Simple facts:** hours, prices, location, policies. AI can answer these well.
2. **Simple actions:** booking a time, taking a message, sending a link. AI can handle these with the right setup.
3. **Judgment calls:** complaints, refunds, emergencies, custom quotes. A person should handle these.

This sorting becomes your plan for the next two lessons.

> If you can't write the answer down, AI can't give it either. Your first job is to write clear answers to your top questions.
`,
        tryIt: `Paste ten real customer questions (no names) into an AI assistant and ask: "Sort these into simple facts, simple actions and judgment calls. Which three would save me the most time if they were answered instantly?"`,
      },
      {
        slug: 'ai-chat-and-phone',
        title: 'AI Chat and AI Phone Answering',
        minutes: 15,
        body: `
There are two main ways AI answers customers: by chat or text, and by phone.

## Chat and text assistants

A [[chatbot|chatbot]] on your website, Facebook, Instagram or text line can answer questions instantly. Modern ones don't follow a rigid script. They read your business information, called a [[knowledge base|knowledge-base]], and answer in normal language.

A good one:

- Answers only from your information, and says "I'm not sure, let me get someone" when it doesn't know
- Can share links (booking page, menu, price list)
- Collects the customer's name and number before handing over to a person

## AI phone answering

[[Voice AI|voice-ai]] can now answer the phone in a natural voice, answer common questions, book appointments and take detailed messages. That makes it very useful for trades, clinics, salons and restaurants that miss calls while they're busy. Calls that need a person are passed on or turned into a written message with a summary.

## What to look for

- **Easy to update:** you can change prices and hours yourself in minutes
- **Connects to your tools:** your booking calendar, email and text
- **Conversation records:** you can read every conversation
- **A clear handoff:** a simple way to reach a person

## Keep expectations real

AI won't know about today's special or that your van broke down unless you tell it. Plan to update its information whenever something changes.

> Setting this up across your website, phone and inbox is what we build for clients at Number 1 Digital Marketing. You can also start small with one channel yourself.
`,
        tryIt: `Paste your hours, prices and five common questions with answers into an AI assistant. Then say: "Pretend you're the assistant for my business and answer customers only from this information. If you don't know, say so." Ask it three questions as a customer, including one it can't answer.`,
      },
      {
        slug: 'handoff-to-humans',
        title: 'Knowing When a Human Takes Over',
        minutes: 12,
        body: `
The best AI customer service knows its limits. Customers forgive "let me get a person for you." They don't forgive a confident wrong answer.

## Always hand off

- Complaints and upset customers
- Refunds, discounts and anything about money beyond your listed prices
- Emergencies, safety or health issues
- Custom quotes and unusual requests
- Anything not in the knowledge base

Write these as clear rules your tool follows, and decide who gets the alert and how fast they'll reply.

## Be upfront

Tell customers they're talking to an AI assistant, and make it easy to reach a person. In many places this is becoming a legal requirement. Everywhere, it builds trust.

## Review it every week

For the first month, read the conversations each week:

- Which questions did it get wrong or dodge? Add better answers.
- Where did customers get frustrated? Adjust the handoff rules.
- What new questions came up? Add them.

## Protect customer information

Choose tools that keep conversations private, don't ask for more personal details than you need, and never let AI take card numbers in a chat.

> A [[human in the loop|human-in-the-loop]] isn't a weakness. It's what makes 24/7 answers safe to offer.
`,
        tryIt: `Write your "always hand off" list for your business in five lines. Ask an AI assistant: "What situations am I missing for a [your type of business]?" Add the one that surprises you most.`,
      },
    ],
    exercise: {
      title: 'Exercise: Write Your Answer Sheet',
      body: `
Create the knowledge base any AI assistant (or new employee) would need:

1. List your top 15–20 customer questions from the last month
2. Write a short, clear answer to each, including hours, prices, area, booking and policies
3. Write your handoff rules: what always goes to a person, who gets alerted, and how fast they reply
4. Test it: paste everything into an AI assistant, tell it to answer only from your sheet, and ask it ten customer questions
5. Fix every answer that was wrong, vague or too long
`,
    },
    checklist: [
      'Collect your top customer questions from the last month',
      'Write a clear answer for each one',
      'Write your handoff rules and who gets alerted',
      'Test your answer sheet with an AI assistant as a pretend customer',
      'Pick one channel (website chat, text or phone) to try first',
    ],
  },
  {
    number: '13',
    summary:
      'Use AI to cut the paperwork: meeting notes, proposals, quotes, policies, spreadsheets and the repeat jobs that fill your week.',
    lessons: [
      {
        slug: 'meetings-and-notes',
        title: 'Meetings, Notes and Calls',
        minutes: 12,
        body: `
Taking notes, writing up what was agreed and remembering follow-ups is one of the easiest places to save time.

## Let AI take the notes

[[Transcription|transcription]] tools turn speech into text. Many video-call apps (Zoom, Google Meet, Microsoft Teams) now have AI notes built in, and phone apps can record and transcribe in-person meetings.

From a transcript, AI can give you:

- A short summary of what was discussed
- Decisions made and who agreed
- A to-do list with names and dates
- A follow-up email ready to edit and send

## Voice memos count too

Driving between jobs? Record a voice memo with your thoughts, then paste the transcript into an AI assistant: "Turn this into a tidy to-do list and a short note for my team."

## Ask permission first

Always tell people you're recording, and get their OK. In many places it's the law. Don't record confidential conversations with tools you haven't checked for privacy.

## Check the details

Transcripts mishear names, numbers and jargon. Before you send a summary, check every amount, date and name against what you remember.

> One habit that pays off fast: end every meeting by asking AI for the follow-up email, and send it within the hour.
`,
        tryIt: `Record a two-minute voice memo about what you need to get done this week. Use your phone's built-in transcription (or type it fast), paste it into an AI assistant and ask: "Turn this into a to-do list with a deadline for each item."`,
      },
      {
        slug: 'documents-and-paperwork',
        title: 'Proposals, Quotes, Policies and Paperwork',
        minutes: 14,
        body: `
Most business paperwork follows a pattern. AI is very good at patterns.

## Documents AI can draft

- **Proposals and quotes:** "Turn these job notes into a clear one-page proposal with scope, price and timeline."
- **How-to guides for your team:** talk through how you do a task, then ask AI to turn it into numbered steps
- **Policies:** cancellation, refund and late-payment policies in plain language
- **Job posts:** "Write a job post for a part-time receptionist. Here's what the job really involves…"
- **Forms and checklists:** intake forms, opening and closing checklists, inspection checklists

## Start from your best example

Paste a proposal or document that worked well and say, "Use this as the template for a new one for [client]." That keeps your format, prices and wording consistent.

## Spreadsheets without the headache

Describe what you want in plain English: "Write a Google Sheets formula that adds up column C only where column B says 'paid.'" Ask it to explain the formula so you can fix it later. You can also paste a small table and ask for a summary.

## Where to be careful

- **Contracts and legal documents:** AI can draft and explain them, but a lawyer should review anything you sign or ask others to sign
- **Numbers:** check every total and price yourself
- **Private details:** remove client names, addresses and ID numbers before pasting

> Keep a folder of your best AI-assisted documents. They become templates you can reuse forever.
`,
        tryIt: `Pick one document you write often (a quote, an invoice note, a welcome message). Paste an old one into an AI assistant with private details removed and ask: "Turn this into a reusable template with [BRACKETS] for the parts that change."`,
      },
      {
        slug: 'inbox-and-routine',
        title: 'Your Inbox and the Repeat Jobs',
        minutes: 12,
        body: `
The last step is the work that repeats every day: email, scheduling, updates and data entry.

## Your inbox

- **Use what you already have.** Gmail and Outlook now include AI that can summarize long threads and suggest replies.
- **Write saved replies** for questions you answer every week, and let AI adjust them for each person.
- **Batch it.** Check email two or three times a day and use AI to draft the replies all at once.

## Spot the repeat jobs

For one week, keep a simple list of tasks you do more than twice. Common ones: sending booking confirmations, copying leads into a spreadsheet, sending invoices and reminders, posting the same update in several places.

For each task, ask:

1. Could a template plus AI do most of it? (Use what you learned in this module.)
2. Could it run automatically, without anyone starting it? That's [[automation|workflow]], and Module 02 (AI Tools & Automation) shows you how to build it step by step.

## AI agents

You'll hear about [[AI agents|ai-agent]]: AI that can take actions for you, such as filling in forms, booking, or working across apps. They're improving fast. For now, use them for low-risk tasks, check their work, and never give them access to money or private accounts without strong limits.

> Measure it: write down how long a task took before AI and after. Hours saved is the clearest sign something is working.
`,
        tryIt: `Open your email and find the question you answer most often. Ask an AI assistant: "Write a friendly saved reply for this question with [BRACKETS] for the details that change." Save it as a template in your email app.`,
      },
    ],
    exercise: {
      title: 'Exercise: Find Five Hours',
      body: `
Find five hours a week to win back:

1. For three days, jot down every admin task and roughly how long it takes
2. Circle the three that repeat most or take longest
3. For each one, pick a fix from this module: AI notes, a template, a saved reply, or (later) an automation
4. Try each fix at least twice
5. Write down the time before and after. Did you find five hours? If not, which task is next?
`,
    },
    checklist: [
      'Use AI notes or a transcript for one meeting or call',
      'Turn one document you write often into a reusable template',
      'Get AI to write or explain one spreadsheet formula',
      'Create two saved email replies',
      'List your repeat tasks and mark which could be automated later',
    ],
  },
  {
    number: '14',
    summary:
      'Use AI as a business thinking partner: research customers and competitors, test prices, and try new offers before you bet on them.',
    lessons: [
      {
        slug: 'ai-as-advisor',
        title: 'AI as Your Business Thinking Partner',
        minutes: 12,
        body: `
Most small-business owners make big decisions alone. AI can't replace a mentor, but it's a smart sounding board that's available whenever you need it.

## Give it the whole picture

The more context it has, the better its thinking. Start a conversation like this:

"I run a [business] in [city]. We have [number] employees, our main customers are [who], and our best-selling service is [what]. Our biggest challenge right now is [problem]. Ask me five questions before you give advice."

Asking it to question you first leads to far better advice than a generic list.

## Useful ways to think with AI

- **Poke holes:** "Here's my plan to open a second location. What could go wrong?"
- **Play the customer:** "Act as a busy mom deciding whether to book my cleaning service. What would make you hesitate?"
- **Play the skeptic:** "Argue that I should NOT raise my prices."
- **Think in steps:** "Break this goal into a 90-day plan with one milestone per month."

## Where it falls short

AI doesn't know your local market, your cash in the bank or your customers' names unless you tell it, and it can be confidently wrong about laws, taxes and numbers. Use it to sharpen your thinking, then check key facts and talk to your accountant or advisor before big moves.

> Treat AI's advice as a strong first opinion, not a final answer.
`,
        tryIt: `Describe your business in three sentences and your biggest challenge in one. Ask an AI assistant: "Ask me five questions about this, one at a time, then suggest three things I could try in the next 30 days." Answer honestly.`,
      },
      {
        slug: 'research-and-pricing',
        title: 'Research Customers, Competitors and Prices',
        minutes: 15,
        body: `
Research that used to take days can now take an afternoon, if you check what AI finds.

## Learn from what customers already say

Copy reviews of your business and two or three competitors (from Google, Yelp or Facebook) and ask:

- "What do customers love most? What do they complain about most?"
- "What do customers wish someone offered?"

The gaps in your competitors' reviews are often your best opportunities.

## Research competitors

Use an AI assistant with web search: "Compare the services, prices and promises of these three [business type] businesses in [city]. Use their websites, and list your sources." Click the sources to make sure it's accurate. AI can mix up businesses or use old prices.

## Test your prices

AI is useful for working through "what if" questions:

- "If I raise prices 10% and lose 5% of customers, do I make more or less? Show the math."
- "What would a monthly membership look like for my car-detailing business?"
- "Help me build three packages: basic, standard and premium."

Check the math yourself or in a spreadsheet. AI sometimes makes arithmetic mistakes.

## Understand your market

Ask about trends, who your likely customers are and what they care about. Then confirm with real conversations. Five short chats with real customers beat any AI guess.

> Always ask "Where did this come from?" Research you can't check is just a guess that sounds smart.
`,
        tryIt: `Copy ten Google reviews from a competitor (or your own business) into an AI assistant and ask: "What are the top three things customers praise and the top three complaints? What's one opportunity this suggests for a competitor?"`,
      },
      {
        slug: 'new-offers',
        title: 'Testing New Offers and Ideas',
        minutes: 12,
        body: `
New ideas are exciting, but most should be tested small before you bet on them. AI helps you go from idea to test quickly.

## From idea to one-page plan

Ask: "Turn this idea into a one-page plan: who it's for, what problem it solves, what it costs me, what I'd charge, and how I'll know if it's working." A page forces clear thinking.

## Ideas to brainstorm

- New services your current customers would buy ("What else might my lawn-care customers need?")
- Packages, bundles and memberships
- Workshops, classes or digital products based on what you know
- Partnerships with nearby businesses that serve the same customers

## Test before you build

- **Ask first:** have AI help write a short survey or five questions to ask customers in person
- **Pre-sell:** offer it to a few customers before you invest. If nobody says yes, you've saved money.
- **Name it:** ask for 10 name ideas, then pick based on what customers understand, not what sounds clever

## When it's time to get the word out

Once an offer is proven, you need to market it. That's what the AI Marketing Course (Modules 01–08) is for: content, search, reviews and measuring results.

> Small test, real customers, clear number. That's how good ideas become good businesses.
`,
        tryIt: `Ask an AI assistant: "My customers buy [your main service]. Suggest five related products or services they might also pay for, and for each one, the cheapest way to test demand this month." Pick one to test.`,
      },
    ],
    exercise: {
      title: 'Exercise: One-Page Growth Plan',
      body: `
Use AI as your thinking partner to build a one-page plan:

1. Describe your business and let AI ask you questions
2. Analyze reviews of your business and two competitors for gaps
3. Pick one opportunity, such as a new offer, a price change or a package
4. Turn it into a one-page plan with a small test and a clear success number
5. Run the test with real customers within 30 days
`,
    },
    checklist: [
      'Have one "ask me questions first" planning conversation with AI',
      'Analyze competitor reviews for gaps',
      'Check one AI research answer by clicking its sources',
      'Use AI to work out one pricing "what if" and check the math',
      'Write a one-page plan for one new idea and set a test date',
    ],
  },
];

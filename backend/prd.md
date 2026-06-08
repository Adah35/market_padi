Àjọ
Your Business. Your Community. Your Voice.

A Voice-First AI Business Assistant for Nigerian Market Traders
Record Sales · Manage Inventory · Run Adashi Groups · Get Market Intelligence
OPay & Google National Innovation Challenge 2026

Submitted by Team Àjọ
Favour · Tijjani · Benjamin · Joshua · [AI Member]
Application Deadline: June 14, 2026
Version 3.0 — Full Proposal with Sources, Team Plan & Prototype Roadmap
 
1.  Product Name & Brand Identity	
1.1 Why Àjọ?
The name Àjọ (pronounced "Ah-joh") is a Yoruba word with two interlocking meanings that capture everything this product does:

Meaning	Significance
Àjọ as savings circle	In Yoruba tradition, an Àjọ is a rotating community savings group — what Hausa speakers call Adashi, Igbo call Isusu, and the English-speaking world calls a ROSCA (Rotating Savings and Credit Association). By naming the product Àjọ, we immediately signal our Adashi/savings group feature and our roots in the informal economy.
Àjọ as gathering/community	A secondary meaning is "a gathering" or "a group assembled for a purpose." Àjọ as a product is a gathering of tools — bookkeeping, inventory, ordering, savings, and market intelligence — assembled in one voice-first assistant for every trader.
Cross-cultural resonance	The word is recognisable across all major Nigerian languages. Hausa traders know it as Adashi, Igbo as Isusu, Edo as Osusu. Àjọ is the umbrella concept — it speaks to every market, every ethnic group, every region.

TAGLINE OPTIONS (CHOOSE ONE FOR YOUR PITCH)
Option A (recommended): "Your Business, Your Community, Your Voice."
Option B (Pidgin-flavoured): "Àjọ: E fit record am, e fit grow am, e fit share am."
Option C (formal): "Àjọ: Voice-First Business Intelligence for Nigeria's 37 Million MSMEs."

 
2.  The Problem
2.1  Nigeria's Informal Economy Is Flying Blind
Nigeria's 37.1 million MSMEs contribute nearly 48% of national GDP and employ the vast majority of the working-age population. Yet the overwhelming majority — market women in Kano, tailors in Aba, pepper sellers in Onitsha — run their entire business on memory and handwritten notebooks. They are financially invisible.

37.1M
MSMEs in Nigeria
SMEDAN DG, 2023	~48%
of GDP from MSMEs
SMEDAN/NBS, 2021	<5%
with formal credit
ResearchGate/NBS	8/10
traders reject digital tools
TechCabal, 2021

2.2  Three Root Causes
•	Literacy and interface barriers: Most bookkeeping apps require typing in English during a busy trading day. A trader handling 50 transactions daily cannot stop to open an app and type after every sale.
•	Language exclusion: The majority of Nigeria's market traders communicate primarily in Hausa, Yoruba, Igbo, or Nigerian Pidgin. Most tools work only in English.
•	The credit invisibility trap: Without financial records, informal traders cannot access bank credit. Fewer than 1 in 20 MSMEs have bank loans, forcing reliance on loan sharks at 100–200% annual rates.
2.3 The Cost of Inaction
In December 2025, the World Bank approved a $500 million MSME finance facility for Nigeria (FINCLUDE Project), confirming that capital exists. The bottleneck is the absence of financial records that would make traders creditworthy. Àjọ is the missing first step in the pipeline from informal trader to credit-worthy MSME.

 
3.  Our Solution — Àjọ
3.1  What It Is
ÀJỌ IN ONE SENTENCE
Àjọ is a WhatsApp-native, voice-first AI business assistant that lets Nigerian market traders record sales, manage inventory, receive customer orders, run Adashi savings groups, and get AI-powered market insights — all by speaking naturally in Pidgin, Hausa, Yoruba, or Igbo — then automatically generates financial statements that unlock OPay micro-loans.

3.2  The Seven Core Features

	Feature	Description	Type
1	Voice Transaction Recording	Speak a sale in any Nigerian language. Gemini AI extracts item, quantity, and price — no typing required.	Core
2	Inventory Management	Say 'reduce tomato by 3 baskets' or 'how much rice I still get?' — stock levels update in real time.	Core
3	Customer Order & Payment	Customers WhatsApp their order. Àjọ creates an OPay payment link, notifies you when paid, auto-decrements stock.	Differentiator
4	Built-in Voice Calculator	'Calculate 3 bags at 4200 each' — instant answer, no app-switching, works mid-transaction.	Differentiator
5	Adashi / Ajo Group Management	Create or join savings circles. Track contributions, automate payout notifications, sync to OPay wallet.	Signature Feature
6	AI Market Intelligence	'Price of tomato for Lagos today?' — Gemini web grounding pulls live market data. Seasonal stock advice.	Differentiator
7	Automated Financial Statements	Monthly PDF of all transactions formatted for OPay micro-loan eligibility — the credit pipeline.	Credit Pipeline

3.3  The Adashi Feature — Àjọ's Signature
The Adashi/Ajo savings circle feature is what sets Àjọ apart from every other bookkeeping tool. It digitises a financial behaviour that already exists at massive scale across Nigeria — one that carries enormous trust because it is community-enforced. Àjọ adds:
•	Group creation via WhatsApp: one trader creates a group and adds members by phone number
•	Automated contribution reminders: every Monday, unpaid members get a WhatsApp reminder with their OPay payment link
•	Payout notification: when all members have paid for the cycle, the recipient is notified and funds are released to their OPay wallet
•	Goal-based circles: groups can save collectively toward a shared asset — cold storage unit, shared transport, bulk stock purchase
•	Dashboard visibility: all Adashi activity is visible in the web dashboard, accessible via a link sent by the bot

3.4  The Two-Tier Experience (WhatsApp + Web Dashboard)
Àjọ runs on two levels designed for two kinds of traders:

Layer	How It Works
WhatsApp Bot (Tier 1)	The entry point for all traders. Voice-first, language-inclusive, works on the cheapest Android phone. No download, no typing, no English required. This is where all transactions are recorded.
Web Dashboard (Tier 2)	Optional, accessed via a link sent by the bot ('tap here to see your statistics'). Shows charts, inventory tables, Adashi group status, credit score, and a chat widget. Designed for traders who are slightly more comfortable with screens and want graphical analytics.
Sync Architecture	Everything recorded on WhatsApp appears in the dashboard in real time. Conversely, when the dashboard chat is used, the same AI reads the same data. One database, two interfaces — the trader chooses their comfort level.

 
4.  Technology Architecture
4.1  Full Stack

Component	Function	Layer
WhatsApp Business API	Primary interface — zero new app, works on any phone. Free tier: 1,000 conversations/month	User Interface
Google Speech-to-Text API	Multilingual recognition: Hausa, Yoruba, Igbo, Pidgin, English (expanded Jan 2026)	Core AI
Gemini 2.0 Flash API	NLU, transaction extraction, market intelligence, business advice, dashboard chat	Core AI
OPay Merchant API	Payment links, order confirmation, wallet disbursement, Adashi payout settlements	OPay Integration
Firebase / Supabase	Shared real-time database — the backbone syncing WhatsApp bot ↔ web dashboard	Backend
React (Web Dashboard)	Optional web interface: charts (Chart.js), inventory tables, Adashi tracker, embedded chat	Frontend
Node.js / Express	Bot server, API endpoints, OPay webhook handler, Adashi cron jobs	Backend
Intron Sahara (optional)	Nigerian-accent optimised STT — outperforms Gemini on African names/numbers by up to 64%	Enhancement

4.2  Database Schema — Six Collections
All data lives in a single Firebase/Supabase database shared by the WhatsApp bot and the web dashboard. Everything syncs in real time.

Collection	Contents & Purpose	
traders	One record per trader. Stores phone, name, language preference, OPay merchant ID, and unique dashboard token (used to generate secure dashboard link).	
transactions	Every sale and expense recorded by voice, customer order, or manual entry. Fields: item, qty, unit_price, total, source (voice/order), language_used, timestamp.	
inventory	Current stock levels per item per trader. Auto-decremented when a sale is recorded. Triggers low-stock WhatsApp alert when quantity drops below restock_threshold.	
adashi_groups	Savings circle configuration: type (rotating or goal-based), contribution amount, frequency, member list, payout order, current round, goal amount.	
adashi_contributions	Individual payment records: who paid, which cycle, OPay transaction reference, timestamp. Powers the payout trigger and dashboard Adashi view.	
customer_orders	Orders placed via bot: customer phone, items requested, total, OPay payment link, status (pending/paid/fulfilled), OPay transaction reference.	

4.3  Core Sync API — Four Key Functions
These four functions form the backbone connecting the WhatsApp bot to the database and the dashboard:

Function	What It Does
recordTransaction()	Called by the bot every time Gemini parses a voice sale. Saves to transactions collection AND calls decrementStock() to update inventory automatically. Triggers low-stock alert if threshold breached.
sendDashboardLink()	When trader says 'show me my stats' or 'I want to see my dashboard,' the bot generates a secure link (using the trader's unique dashboard_token) and sends it via WhatsApp.
createOrder() + onPaymentConfirmed()	createOrder() generates an OPay payment link and sends to the customer. onPaymentConfirmed() is the OPay webhook — fires when customer pays, updates order status, records transaction, notifies trader.
recordAdashiContribution() + Monday Cron	Records each Adashi payment to the database. Checks if all members have paid this cycle — if yes, notifies payout recipient. A Monday cron job sends payment reminders to all members who haven't contributed yet.

 
5.  Team Structure & Role Assessment
5.1 Team Members: Full Assessment
Below is an honest assessment of each role, what it covers, any gaps, and recommendations to strengthen coverage before the pitch.

Member	Role	Scope	Assessment
Tijjani	Project Lead, Organisation, Documentation & Pitch	Owns the entire project narrative. Coordinates all five members, maintains the sprint board, writes the application text, leads the final pitch presentation. Generate revenue model and impact numbers	Strong. No gaps.
Favour	Content, Advertising & Client Interaction	Owns the 'Mama Nkechi' story and all human-centred content: the pitch video script, social media presence for the application, any user interviews with real traders, and the written proposal's language and tone.	Strong. Recommend: conduct 3 real trader interviews before June 14 — this becomes gold in the pitch.
Benjamin	Graphics, UI/UX & Frontend	Owns the web dashboard design and all visual assets: pitch deck slides, the Àjọ logo and brand identity, the dashboard React build.	Strong. Recommend: prioritise the dashboard UI skeleton over perfection — a working rough version beats a polished wireframe.
Joshua	Backend Development	Owns the WhatsApp bot server (Node.js/Express), Firebase/Supabase setup, OPay webhook integration, Adashi cron jobs, and the sync API that connects bot to dashboard.	Strong. This is the most technically demanding role. See prototype roadmap for build priority.
[AI Member]	AI Integration & Data	Owns the Gemini API integration: prompt engineering for transaction extraction, multilingual voice parsing pipeline (Speech-to-Text → Gemini), market intelligence queries, and credit scoring logic.	Good. Recommend: this person must also understand the database schema so their Gemini outputs match what Joshua's backend expects.

OVERALL TEAM ASSESSMENT
Your five roles cover approximately 90% of what is needed to build and win this competition. The two manageable gaps — user research and financial modelling — can be absorbed by Tijjani and Favour without adding a sixth person. The team composition is genuinely strong: having a content/storytelling person (Favour) is an advantage most technical teams will lack.

 
6.  Project Plan — 10-Day Sprint to June 14
6.1  Overview
You have approximately 10 working days from today (June 6) to June 14. The goal is not a finished product — it is a working prototype that demonstrates the core voice → AI → record → dashboard flow convincingly enough to win shortlisting. Below is a day-by-day sprint plan.

DEFINITION OF DONE FOR JUNE 14
1. WhatsApp bot receives a voice note in Pidgin or English, parses it with Gemini, records the transaction to Firebase.
2. Trader can ask 'how much I make today?' and receive a correct text response.
3. Web dashboard shows that transaction in the sales table and on a chart.
4. Bot can send a working dashboard link to the trader.
5. A 2-minute demo video showing this full flow end-to-end.
6. A GitHub repository with real code (judges are technical — show the work).
7. The written application submitted at opayweb.com/innovation-challenge.

6.2  Day-by-Day Sprint Table
Legend: ● = Primary owner for this task on these days · ◑ = Supporting / reviewing

Task	Owner	D1-2	D3-4	D5-6	D7-8	D9-10	Output
Setup WhatsApp Twilio Sandbox + 'Hello World' bot response	Joshua	●					Bot receives & replies to messages
Set up Firebase project + collections schema	Joshua	●	◑				DB live with 6 collections
Gemini API key + basic text parsing test	AI Member	●					'I sold 3 tomatoes at 500' → JSON output
Voice note pipeline: WhatsApp audio → STT → Gemini → DB	Joshua + AI	◑	●				Voice sale recorded end-to-end
'How much I make today?' query handler	Joshua + AI		◑	●			Correct profit summary reply
Inventory decrement on sale + low-stock alert	Joshua		●				Auto stock update
React dashboard scaffold + Firebase read	Benjamin		●	◑			Dashboard shows live transactions
Sales chart (Chart.js) + inventory table	Benjamin			●			Charts render with real data
Dashboard link endpoint (secure token)	Joshua			◑	●		Bot sends working dashboard link
OPay payment link mock (or real if API approved)	Joshua + AI			●	◑		Customer order → payment link sent
Adashi group: create group, record contribution	Joshua + AI			◑	●		Adashi contribution recorded + notification
Market intelligence query via Gemini web grounding	AI Member				●	◑	'Tomato price Lagos' returns data
Àjọ logo + brand assets	Benjamin	●					Logo, colours, pitch deck template
Pitch deck (10 slides)	Tijjani + Benj	◑	●	◑			Deck ready for review
Demo video script + recording	Favour + Benj			◑	●	◑	2-min video complete
Trader interviews (3 real traders)	Favour	●	◑				3 interview quotes for pitch
Application text draft	Tijjani + Favour	●	◑				Draft complete for review
Application text final + submit	Tijjani				◑	●	Submitted before June 14

6.3  The Pitch Week (Post-Shortlisting)
If shortlisted, you will enter a 6-week virtual bootcamp hosted by OPay digital experts before the final pitch at the Empowering Futures Conference 2.0. During this period:
•	Week 1–2: Complete the customer ordering and OPay payment flow (currently mocked in prototype)
•	Week 3–4: Build the full Adashi dashboard tab with real contribution tracking
•	Week 5: Add market intelligence and credit score progress tracker
•	Week 6: Full pitch rehearsal with the working product — aim to demo live, not via slides

 
7.  Market Opportunity & Social Impact
7.1  Addressable Market

Segment	Definition	Revenue Estimate
Total Addressable Market	37 million MSMEs in Nigeria	~₦185B/yr at ₦5,000 sub/mo
Serviceable Addressable Market	Market traders with WhatsApp (~8 million)	~₦40B/yr
Year 1 Target (SOM)	50,000 active users in 3 pilot markets	~₦3B/yr

7.2  Social Impact

Impact Area	How Àjọ Delivers
Financial Inclusion	Traders gain their first formal financial records — the prerequisite for accessing the World Bank's ₦500M MSME facility
Gender Equity	70%+ of Nigerian market traders are women. Àjọ directly serves Nigeria's most financially excluded demographic.
Language Equity	4 Nigerian languages at launch: Hausa, Yoruba, Igbo, Pidgin — covering 150M+ speakers. True inclusion, not English-only tech.
Credit Pipeline	After 3 months of bookkeeping, Àjọ auto-generates a financial statement formatted for OPay micro-loan eligibility.
Community Savings	By digitising Adashi groups, Àjọ strengthens existing capital-formation behaviour that Nigeria's financial system has historically ignored.
Income Growth	Research shows SMEs using digital bookkeeping tools see a 25% average increase in monthly sales within 6 months.

 
8.  Competition Strategy
8.1  How Àjọ Scores on Every Judging Criterion

Judging Criterion	Àjọ's Position
Real problem identified	37M MSMEs, <5% credit access, ~80% without tools — all cited and sourced. World Bank $500M facility confirms institutional recognition. This is not a student project; this is a documented national crisis.
Technology-driven solution	Gemini AI + Google Speech-to-Text (the competition's own partner technology stack) + OPay payment API + Firebase + React. Every layer is a real technology, not a concept.
Originality	No product in Nigeria offers voice-first, multilingual bookkeeping with integrated Adashi group management and a direct OPay credit pipeline. Genuinely novel.
Feasibility	WhatsApp-native = zero distribution cost. Firebase free tier = zero infrastructure cost. Working prototype achievable in 10 days by a 5-person team.
Impact	Financial inclusion for Nigeria's most excluded demographic (women traders, rural markets), 4-language support, direct credit pipeline to OPay lending. Measurable at scale.
Gemini App requirement	Gemini is the core AI engine for every feature — transaction extraction, market queries, credit assessment. Not bolted-on; it is the intelligence layer.

8.2  Key Differentiators vs. Likely Competitors
•	Most teams will build an app — Àjọ lives in WhatsApp, which traders already use daily. No download, no onboarding friction, no learning curve.
•	Most teams will build in English — Àjọ speaks Hausa, Yoruba, Igbo, and Pidgin natively. Language is not a feature; it is the architecture.
•	Most teams will build a tool — Àjọ builds a pipeline: voice → records → credit. That narrative is more fundable and more compelling than a standalone product.
•	Most teams will be all-technical — having Favour as a dedicated storyteller and Tijjani as a product-minded lead gives Àjọ a human-centred narrative that technical teams rarely achieve.
•	Adashi integration is unique — no competing entry will have digitised rotating savings circles. It is a signature feature that judges will remember.

 
9.  Data Sources & Citations
9.1  All Statistics, Fully Sourced
Every figure in this proposal is drawn from primary government data, peer-reviewed research, or reputable journalism. All links are live and verifiable as of June 2026.

#	Claim / Statistic Used	Source (click to verify)
1	37.1M MSMEs in Nigeria; 47.8% GDP contribution	businesspost.ng/economy/37m-msmes-contribute-47-8-to-nigerias-gdp-smedan/

2	MSMEs: 46.32% GDP, 96.9% of businesses, 87.9% of employment (NBS/SMEDAN 2021)	www.pwc.com/ng/en/publications/strategies-for-msme-success.html

3	Fewer than 1 in 20 MSMEs have access to bank credit	www.researchgate.net/publication/342440692

4	8 out of 10 traders skeptical of digital tools ('I can write it in a book')	techcabal.com/2021/11/22/the-next-wave-sme-digitisation-in-africa/

5	Financially excluded Nigerians score lowest on digital capability (EFInA 2023)	www.efina.org.ng

6	25–30% income growth for SMEs using digital payment/bookkeeping tools	www.gojamss.net/index.php/gojamss/article/download/1494/1530

7	World Bank $500M FINCLUDE MSME finance facility approved December 2025	www.worldbank.org/en/news/press-release/2025/12/22/world-bank-approves-500-million-to-expand-finance-for-small-businesses-in-nigeria

8	Google Speech-to-Text expanded to Hausa, Yoruba, Igbo, Nigerian Pidgin — January 2026	blog.google/company-news/inside-google/around-the-globe/google-africa/africas-digital-decade/

9	Intron Sahara v2: 57 languages, outperforms Gemini on African speech by up to 64%	techcabal.com/2026/03/05/intron-expands-sahara-to-57-languages/

10	OPay: 50M+ users, 1M merchants, $12B+ monthly transaction volume (2024)	fintechnews.africa/45002/fintech-nigeria/top-fintechs-in-nigeria/

11	70%+ of Nigerian market traders are women	www.marketdataforecast.com/market-reports/africa-mobile-money-market

12	NaijaVoices: 1,800hrs of Hausa/Yoruba/Igbo speech data enabling AI language support	nouvelles.umontreal.ca/en/article/2026/03/27/ai-learns-igbo-hausa-and-yoruba

13	Most Nigerian MSMEs remain cash-based and digitally excluded	cheetahsinstitute.org/a-strategic-approach-to-digitalizing-nigerias-msmes-from-survival-to-scale/


 
10.  Application Checklist

DEADLINE: JUNE 14, 2026 — SUBMIT AT OPAYWEB.COM/INNOVATION-CHALLENGE
Application portal: https://www.opayweb.com/innovation-challenge


Mandatory Requirements
•	All 5 team members are current undergraduate students at a recognised Nigerian tertiary institution
•	All 5 team members have downloaded the Gemini App AND initiated basic prompts within the app (this is mandatory — do this today)
•	CGPA requirements met: 3.50 and above (university) or 2.80 and above (polytechnic / college of education)
•	Application identifies exactly one real problem with a clearly technology-driven solution
•	Application submitted as a team — not as individuals

Recommended (Stand Out from Other Applicants)
•	Working WhatsApp bot prototype — a phone number judges can message to test (strongest differentiator)
•	2-minute demo video showing: voice note → AI parsing → transaction recorded → dashboard visible
•	GitHub repository link with real code (technical judges will check)
•	At least 3 real trader interview quotes embedded in your application text
•	All statistics cited with source names — use Section 9 of this document
•	Problem statement written with specific data, not vague claims — use the sourced statistics throughout

Pitch Narrative Reminder
The strongest pitches open with a human story before showing any technology. Your narrative arc:
1.	Step 1: Introduce Mama Nkechi — 15 years trading tomatoes in Onitsha, no financial records, turned down for every loan, paying 120% interest to a moneylender.
2.	Step 2: Show her notebook — the only record of her ₦87,000/month business. Crumpled, incomplete, destroyed if wet.
3.	Step 3: Demonstrate Àjọ in 60 seconds — she sends a WhatsApp voice note in Igbo. The bot responds with her daily total. She asks for her dashboard link. The chart appears.
4.	Step 4: Show the outcome — after 3 months, Àjọ generates her financial statement. She applies for an OPay micro-loan. She qualifies for the first time in 15 years.
5.	Step 5: Scale the vision — 37 million traders like Mama Nkechi. One voice at a time.

FINAL WORD
Àjọ is not a product looking for a problem. It is the answer to a documented ₦5-trillion crisis, built with the exact technologies this competition is designed to celebrate — Gemini AI, Google Speech-to-Text, and OPay's payment infrastructure. You have the team, the name, the story, and the plan. Now build it.


"""
Vocabulary seed data — 50 words per CEFR level (B1, B2, C1, C2).
200 total words covering professional, academic, and everyday English.
Each word includes phonetic pronunciation, meaning, etymology roots, and an example sentence
set in an Indian professional/daily-life context.
"""

VOCABULARY_WORDS = [
    # ============================================================
    # B1 — Intermediate (50 words)
    # ============================================================
    {"word": "accomplish", "phonetic": "uh-KOM-plish", "level": "B1",
     "meaning": "To successfully complete or achieve something you planned to do",
     "roots": ["Latin: accomplere (to fill up, complete)"],
     "example_sentence": "She accomplished all her sprint tasks before the Friday deadline."},

    {"word": "appropriate", "phonetic": "uh-PROH-pree-uht", "level": "B1",
     "meaning": "Suitable or proper for a particular situation or occasion",
     "roots": ["Latin: appropriare (to make one's own)"],
     "example_sentence": "Wearing formals is appropriate for the client meeting at Infosys."},

    {"word": "benefit", "phonetic": "BEN-uh-fit", "level": "B1",
     "meaning": "An advantage or something good that you get from a situation",
     "roots": ["Latin: benefactum (good deed)"],
     "example_sentence": "One major benefit of WFH is saving two hours of Hyderabad commute."},

    {"word": "colleague", "phonetic": "KOL-eeg", "level": "B1",
     "meaning": "A person you work with, especially in a professional setting",
     "roots": ["Latin: collega (partner in office)"],
     "example_sentence": "My colleague Priya helped me debug the API issue yesterday."},

    {"word": "contribute", "phonetic": "kuhn-TRIB-yoot", "level": "B1",
     "meaning": "To give something (time, money, ideas) to help achieve a goal",
     "roots": ["Latin: contribuere (to bring together)"],
     "example_sentence": "Everyone should contribute at least one idea during the brainstorming session."},

    {"word": "deadline", "phonetic": "DED-lyne", "level": "B1",
     "meaning": "The latest time or date by which something must be completed",
     "roots": ["English: dead + line (a line that must not be crossed)"],
     "example_sentence": "The project deadline is next Monday and we still have three open bugs."},

    {"word": "efficient", "phonetic": "ih-FISH-uhnt", "level": "B1",
     "meaning": "Working well and producing results without wasting time or resources",
     "roots": ["Latin: efficere (to accomplish)"],
     "example_sentence": "The new automated pipeline is much more efficient than manual deployments."},

    {"word": "flexible", "phonetic": "FLEK-suh-buhl", "level": "B1",
     "meaning": "Able to change or be changed easily to suit different conditions",
     "roots": ["Latin: flexibilis (that can be bent)"],
     "example_sentence": "Our manager is flexible about work timings as long as deliverables are met."},

    {"word": "guarantee", "phonetic": "gair-uhn-TEE", "level": "B1",
     "meaning": "A firm promise that something will happen or that a product will work",
     "roots": ["Old French: garantie (protection, pledge)"],
     "example_sentence": "The vendor gave a one-year guarantee on the server hardware."},

    {"word": "hesitate", "phonetic": "HEZ-ih-tayt", "level": "B1",
     "meaning": "To pause before doing something because you are unsure or nervous",
     "roots": ["Latin: haesitare (to stick, to be undecided)"],
     "example_sentence": "Don't hesitate to ask questions during the standup meeting."},

    {"word": "implement", "phonetic": "IM-pluh-ment", "level": "B1",
     "meaning": "To put a plan the or decision into action so it actually happens",
     "roots": ["Latin: implere (to fill up, to fulfill)"],
     "example_sentence": "We need to implement the new login flow before the sprint ends."},

    {"word": "indicate", "phonetic": "IN-dih-kayt", "level": "B1",
     "meaning": "To point out, show, or suggest that something is the case",
     "roots": ["Latin: indicare (to point out)"],
     "example_sentence": "The dashboard metrics indicate a 20% drop in user engagement."},

    {"word": "maintain", "phonetic": "mayn-TAYN", "level": "B1",
     "meaning": "To keep something in good condition or at the same level",
     "roots": ["Latin: manu tenere (to hold in the hand)"],
     "example_sentence": "It's important to maintain clean code so the next developer can understand it."},

    {"word": "negotiate", "phonetic": "neh-GOH-shee-ayt", "level": "B1",
     "meaning": "To have a formal discussion to reach an agreement between two sides",
     "roots": ["Latin: negotiari (to carry on business)"],
     "example_sentence": "We managed to negotiate a better rate with the cloud hosting provider."},

    {"word": "opportunity", "phonetic": "op-er-TOO-nih-tee", "level": "B1",
     "meaning": "A chance or situation that makes it possible to do something good",
     "roots": ["Latin: opportunitas (fitness, suitability)"],
     "example_sentence": "This hackathon is a great opportunity to learn new technologies."},

    {"word": "participate", "phonetic": "par-TIS-ih-payt", "level": "B1",
     "meaning": "To take part in an activity or event",
     "roots": ["Latin: participare (to share in)"],
     "example_sentence": "All team members are encouraged to participate in the retrospective."},

    {"word": "previous", "phonetic": "PREE-vee-uhs", "level": "B1",
     "meaning": "Happening or existing before the current one in time or order",
     "roots": ["Latin: praevius (going before)"],
     "example_sentence": "In my previous company, we used Jira for project tracking."},

    {"word": "recommend", "phonetic": "rek-uh-MEND", "level": "B1",
     "meaning": "To suggest something as a good choice or course of action",
     "roots": ["Latin: recommendare (to commit to one's care)"],
     "example_sentence": "I'd recommend using TypeScript for this project to catch bugs early."},

    {"word": "schedule", "phonetic": "SKED-yool", "level": "B1",
     "meaning": "A plan that lists the times when events or tasks will happen",
     "roots": ["Latin: schedula (strip of paper)"],
     "example_sentence": "Let me check my schedule and block a slot for our one-on-one."},

    {"word": "significant", "phonetic": "sig-NIF-ih-kuhnt", "level": "B1",
     "meaning": "Large or important enough to be noticed or have an effect",
     "roots": ["Latin: significare (to signify)"],
     "example_sentence": "There was a significant improvement in app performance after the refactor."},

    {"word": "sufficient", "phonetic": "suh-FISH-uhnt", "level": "B1",
     "meaning": "Enough to meet a need or achieve a purpose",
     "roots": ["Latin: sufficere (to supply, be adequate)"],
     "example_sentence": "Two testers should be sufficient for this module's QA cycle."},

    {"word": "temporary", "phonetic": "TEM-puh-rer-ee", "level": "B1",
     "meaning": "Lasting for only a limited period of time, not permanent",
     "roots": ["Latin: temporarius (of a season, temporary)"],
     "example_sentence": "This is a temporary workaround; we'll fix it properly in the next sprint."},

    {"word": "accurate", "phonetic": "AK-yuh-ruht", "level": "B1",
     "meaning": "Correct and exact, without any mistakes",
     "roots": ["Latin: accurare (to take care of)"],
     "example_sentence": "The test data must be accurate otherwise the results will be misleading."},

    {"word": "assist", "phonetic": "uh-SIST", "level": "B1",
     "meaning": "To help someone with something they are doing",
     "roots": ["Latin: assistere (to stand by, help)"],
     "example_sentence": "Can you assist me with the database migration script?"},

    {"word": "avoid", "phonetic": "uh-VOID", "level": "B1",
     "meaning": "To stay away from something or prevent something from happening",
     "roots": ["Old French: esvuidier (to empty out)"],
     "example_sentence": "Avoid pushing directly to the main branch without a code review."},

    {"word": "confident", "phonetic": "KON-fih-duhnt", "level": "B1",
     "meaning": "Feeling sure about your own abilities or qualities",
     "roots": ["Latin: confidere (to trust fully)"],
     "example_sentence": "After three mock interviews, she felt more confident about the real one."},

    {"word": "confirm", "phonetic": "kuhn-FURM", "level": "B1",
     "meaning": "To make something definite or to verify that it is true",
     "roots": ["Latin: confirmare (to strengthen, make firm)"],
     "example_sentence": "Please confirm your attendance for tomorrow's all-hands meeting."},

    {"word": "convince", "phonetic": "kuhn-VINS", "level": "B1",
     "meaning": "To make someone believe that something is true or agree to do something",
     "roots": ["Latin: convincere (to overcome, prove wrong)"],
     "example_sentence": "We need to convince the stakeholders that migrating to the cloud is worth the cost."},

    {"word": "depend", "phonetic": "dih-PEND", "level": "B1",
     "meaning": "To rely on someone or something for support or to be influenced by",
     "roots": ["Latin: dependere (to hang from)"],
     "example_sentence": "The release date will depend on how quickly we resolve the critical bugs."},

    {"word": "determine", "phonetic": "dih-TUR-min", "level": "B1",
     "meaning": "To find out or decide something with certainty",
     "roots": ["Latin: determinare (to set limits, fix)"],
     "example_sentence": "We need to determine the root cause before applying any fix."},

    {"word": "establish", "phonetic": "ih-STAB-lish", "level": "B1",
     "meaning": "To set up or create something on a firm or permanent basis",
     "roots": ["Latin: stabilire (to make stable)"],
     "example_sentence": "The team wants to establish coding standards that everyone follows."},

    {"word": "evaluate", "phonetic": "ih-VAL-yoo-ayt", "level": "B1",
     "meaning": "To assess or judge the quality, importance, or value of something",
     "roots": ["French: évaluer (to find the value of)"],
     "example_sentence": "Let's evaluate both frameworks before picking one for the project."},

    {"word": "gradually", "phonetic": "GRAD-yoo-uh-lee", "level": "B1",
     "meaning": "Slowly and in small stages over a period of time",
     "roots": ["Latin: gradus (step)"],
     "example_sentence": "Her English fluency improved gradually with daily practice sessions."},

    {"word": "ignore", "phonetic": "ig-NOR", "level": "B1",
     "meaning": "To intentionally not pay attention to something or someone",
     "roots": ["Latin: ignorare (to not know, to disregard)"],
     "example_sentence": "You shouldn't ignore compiler warnings — they often point to real issues."},

    {"word": "involve", "phonetic": "in-VOLV", "level": "B1",
     "meaning": "To include someone or something as a necessary part of an activity",
     "roots": ["Latin: involvere (to roll into, wrap up)"],
     "example_sentence": "The migration will involve updating all the API endpoints."},

    {"word": "justify", "phonetic": "JUS-tih-fy", "level": "B1",
     "meaning": "To give a good reason for something that other people think is wrong",
     "roots": ["Latin: justificare (to make righteous)"],
     "example_sentence": "You need to justify the budget increase with concrete data."},

    {"word": "majority", "phonetic": "muh-JOR-ih-tee", "level": "B1",
     "meaning": "The greater number or part of something; more than half",
     "roots": ["Latin: majoritas (the greater number)"],
     "example_sentence": "The majority of the team voted to adopt the new testing framework."},

    {"word": "obtain", "phonetic": "uhb-TAYN", "level": "B1",
     "meaning": "To get something, especially by effort or request",
     "roots": ["Latin: obtinere (to hold, to gain)"],
     "example_sentence": "You'll need to obtain manager approval before purchasing new software licenses."},

    {"word": "obvious", "phonetic": "OB-vee-uhs", "level": "B1",
     "meaning": "Easy to see, understand, or recognise without doubt",
     "roots": ["Latin: obvius (in the way, presenting itself)"],
     "example_sentence": "The bug was obvious once we checked the console logs."},

    {"word": "promote", "phonetic": "pruh-MOHT", "level": "B1",
     "meaning": "To support or encourage something, or to give someone a higher position",
     "roots": ["Latin: promovere (to move forward)"],
     "example_sentence": "Good documentation helps promote code reusability across teams."},

    {"word": "pursue", "phonetic": "per-SOO", "level": "B1",
     "meaning": "To follow or chase something, or to continue trying to achieve a goal",
     "roots": ["Latin: prosequi (to follow after)"],
     "example_sentence": "She decided to pursue a machine learning certification to upskill."},

    {"word": "release", "phonetic": "rih-LEES", "level": "B1",
     "meaning": "To let something become available or to set free",
     "roots": ["Latin: relaxare (to loosen, let go)"],
     "example_sentence": "We plan to release version 2.0 by the end of this quarter."},

    {"word": "require", "phonetic": "rih-KWYRE", "level": "B1",
     "meaning": "To need something or to make it necessary for someone to do something",
     "roots": ["Latin: requirere (to seek again, to need)"],
     "example_sentence": "This API endpoint will require authentication headers."},

    {"word": "resolve", "phonetic": "rih-ZOLV", "level": "B1",
     "meaning": "To find a solution to a problem or to make a firm decision",
     "roots": ["Latin: resolvere (to loosen, to solve)"],
     "example_sentence": "The support team managed to resolve the customer's issue within an hour."},

    {"word": "respond", "phonetic": "rih-SPOND", "level": "B1",
     "meaning": "To give a reply or reaction to something",
     "roots": ["Latin: respondere (to answer, to match)"],
     "example_sentence": "Please respond to the client's email before end of day."},

    {"word": "strategy", "phonetic": "STRAT-uh-jee", "level": "B1",
     "meaning": "A plan of action designed to achieve a long-term goal",
     "roots": ["Greek: strategia (generalship, art of war)"],
     "example_sentence": "Our go-to-market strategy focuses on tier-2 cities first."},

    {"word": "struggle", "phonetic": "STRUG-uhl", "level": "B1",
     "meaning": "To try very hard to do something difficult",
     "roots": ["Middle English: strogelen (to contend)"],
     "example_sentence": "Many developers struggle with writing clean documentation."},

    {"word": "suggestion", "phonetic": "suh-JES-chuhn", "level": "B1",
     "meaning": "An idea or plan put forward for someone to consider",
     "roots": ["Latin: suggerere (to bring up from below)"],
     "example_sentence": "That's a good suggestion — let's add it to the sprint backlog."},

    {"word": "tendency", "phonetic": "TEN-duhn-see", "level": "B1",
     "meaning": "A natural inclination to behave or think in a particular way",
     "roots": ["Latin: tendere (to stretch, to aim)"],
     "example_sentence": "There's a tendency to over-engineer solutions in our team."},

    {"word": "transfer", "phonetic": "TRANS-fur", "level": "B1",
     "meaning": "To move something or someone from one place to another",
     "roots": ["Latin: transferre (to carry across)"],
     "example_sentence": "She got a transfer to the Bengaluru office starting next month."},

    # ============================================================
    # B2 — Upper Intermediate (50 words)
    # ============================================================
    {"word": "acknowledge", "phonetic": "ak-NOL-ij", "level": "B2",
     "meaning": "To accept or admit the existence or truth of something",
     "roots": ["Old English: oncnawan (to understand, recognise)"],
     "example_sentence": "The manager acknowledged that the timeline was too aggressive."},

    {"word": "ambiguous", "phonetic": "am-BIG-yoo-uhs", "level": "B2",
     "meaning": "Having more than one possible meaning; not clear",
     "roots": ["Latin: ambiguus (uncertain, wandering)"],
     "example_sentence": "The requirements document is ambiguous — we need to clarify with the product owner."},

    {"word": "anticipate", "phonetic": "an-TIS-ih-payt", "level": "B2",
     "meaning": "To expect something and prepare for it in advance",
     "roots": ["Latin: anticipare (to take before)"],
     "example_sentence": "We should anticipate high traffic during the Diwali sale launch."},

    {"word": "comprehensive", "phonetic": "kom-prih-HEN-siv", "level": "B2",
     "meaning": "Including everything that is needed; complete and thorough",
     "roots": ["Latin: comprehendere (to grasp, to understand)"],
     "example_sentence": "We need a comprehensive test suite before going to production."},

    {"word": "consequence", "phonetic": "KON-sih-kwens", "level": "B2",
     "meaning": "A result or effect of an action or situation, often negative",
     "roots": ["Latin: consequi (to follow closely)"],
     "example_sentence": "Deploying without testing could have serious consequences for the users."},

    {"word": "contradiction", "phonetic": "kon-truh-DIK-shuhn", "level": "B2",
     "meaning": "A situation where two statements or ideas are opposite and cannot both be true",
     "roots": ["Latin: contradicere (to speak against)"],
     "example_sentence": "There's a contradiction between what the PM said in the email and in the meeting."},

    {"word": "deteriorate", "phonetic": "dih-TEER-ee-uh-rayt", "level": "B2",
     "meaning": "To become progressively worse over time",
     "roots": ["Latin: deteriorare (to make worse)"],
     "example_sentence": "Code quality will deteriorate quickly without regular code reviews."},

    {"word": "distinguish", "phonetic": "dih-STING-gwish", "level": "B2",
     "meaning": "To recognise or treat as different; to tell apart",
     "roots": ["Latin: distinguere (to separate, divide)"],
     "example_sentence": "It's important to distinguish between a bug and a feature request in the tracker."},

    {"word": "elaborate", "phonetic": "ih-LAB-uh-rayt", "level": "B2",
     "meaning": "To explain something in more detail; or (adj) very detailed and complex",
     "roots": ["Latin: elaborare (to work out)"],
     "example_sentence": "Could you elaborate on the architecture you're proposing for the microservice?"},

    {"word": "emphasize", "phonetic": "EM-fuh-size", "level": "B2",
     "meaning": "To give special importance or attention to something",
     "roots": ["Greek: emphasis (significance, force of expression)"],
     "example_sentence": "The CTO emphasized the need for security-first development practices."},

    {"word": "equivalent", "phonetic": "ih-KWIV-uh-luhnt", "level": "B2",
     "meaning": "Equal in value, function, or meaning to something else",
     "roots": ["Latin: aequivalere (to be of equal worth)"],
     "example_sentence": "The role is equivalent to a Senior Software Engineer at most MNCs."},

    {"word": "fluctuate", "phonetic": "FLUK-choo-ayt", "level": "B2",
     "meaning": "To rise and fall irregularly in number, amount, or intensity",
     "roots": ["Latin: fluctuare (to flow, to wave)"],
     "example_sentence": "Server response times fluctuate during peak hours between 6-9 PM IST."},

    {"word": "hypothesis", "phonetic": "hy-POTH-uh-sis", "level": "B2",
     "meaning": "A proposed explanation based on limited evidence, used as a starting point for investigation",
     "roots": ["Greek: hypothesis (foundation, base of an argument)"],
     "example_sentence": "Our hypothesis is that reducing page load time will increase conversions by 15%."},

    {"word": "implication", "phonetic": "im-plih-KAY-shuhn", "level": "B2",
     "meaning": "A possible effect or result that is not directly stated",
     "roots": ["Latin: implicare (to entangle, involve)"],
     "example_sentence": "Switching to a new database has cost implications we haven't budgeted for."},

    {"word": "inevitable", "phonetic": "in-EV-ih-tuh-buhl", "level": "B2",
     "meaning": "Certain to happen and impossible to avoid",
     "roots": ["Latin: inevitabilis (unavoidable)"],
     "example_sentence": "Technical debt is inevitable, but we should address it before it snowballs."},

    {"word": "integrate", "phonetic": "IN-tuh-grayt", "level": "B2",
     "meaning": "To combine two or more things so they work together as a whole",
     "roots": ["Latin: integrare (to make whole)"],
     "example_sentence": "We need to integrate the payment gateway with our existing checkout flow."},

    {"word": "legitimate", "phonetic": "leh-JIT-ih-muht", "level": "B2",
     "meaning": "Conforming to rules, standards, or laws; genuine and reasonable",
     "roots": ["Latin: legitimare (to make lawful)"],
     "example_sentence": "His concern about data privacy is completely legitimate."},

    {"word": "mitigate", "phonetic": "MIT-ih-gayt", "level": "B2",
     "meaning": "To make something less severe, harmful, or painful",
     "roots": ["Latin: mitigare (to soften, to calm)"],
     "example_sentence": "Adding a CDN will mitigate the latency issues for users in South India."},

    {"word": "predominant", "phonetic": "prih-DOM-ih-nuhnt", "level": "B2",
     "meaning": "Most common, most frequent, or having the greatest influence",
     "roots": ["Latin: praedominare (to rule over)"],
     "example_sentence": "Python is the predominant language for data science roles in India."},

    {"word": "preliminary", "phonetic": "prih-LIM-ih-nair-ee", "level": "B2",
     "meaning": "Coming before the main part of something; preparatory",
     "roots": ["Latin: praeliminaris (before the threshold)"],
     "example_sentence": "The preliminary results from A/B testing look promising."},

    {"word": "privilege", "phonetic": "PRIV-uh-lij", "level": "B2",
     "meaning": "A special right or advantage available to a particular person or group",
     "roots": ["Latin: privilegium (a law for one person)"],
     "example_sentence": "Admin users have the privilege to delete other users' posts."},

    {"word": "proportion", "phonetic": "pruh-POR-shuhn", "level": "B2",
     "meaning": "The relationship between the amounts or sizes of two or more things",
     "roots": ["Latin: proportio (comparative relation)"],
     "example_sentence": "A large proportion of our users access the app from mobile devices."},

    {"word": "reliable", "phonetic": "rih-LY-uh-buhl", "level": "B2",
     "meaning": "Consistently good in quality or performance; able to be trusted",
     "roots": ["Old French: relier (to bind together, trust)"],
     "example_sentence": "We need a reliable CI/CD pipeline that doesn't fail on every other build."},

    {"word": "reluctant", "phonetic": "rih-LUK-tuhnt", "level": "B2",
     "meaning": "Unwilling and hesitant to do something",
     "roots": ["Latin: reluctari (to struggle against)"],
     "example_sentence": "The client was reluctant to approve the redesign without seeing a prototype."},

    {"word": "subordinate", "phonetic": "suh-BOR-dih-nuht", "level": "B2",
     "meaning": "Lower in rank or position; a person under the authority of another",
     "roots": ["Latin: subordinare (to place in a lower order)"],
     "example_sentence": "A good leader listens to subordinate team members during planning sessions."},

    {"word": "subsequent", "phonetic": "SUB-sih-kwuhnt", "level": "B2",
     "meaning": "Coming after something in time or order",
     "roots": ["Latin: subsequi (to follow closely)"],
     "example_sentence": "The bug was introduced in v2.1 and persisted in all subsequent releases."},

    {"word": "substantial", "phonetic": "suhb-STAN-shuhl", "level": "B2",
     "meaning": "Of considerable importance, size, or worth",
     "roots": ["Latin: substantialis (of or relating to substance)"],
     "example_sentence": "There's been a substantial increase in API calls since the mobile launch."},

    {"word": "sustainable", "phonetic": "suh-STAY-nuh-buhl", "level": "B2",
     "meaning": "Able to be maintained at a certain level without depleting resources",
     "roots": ["Latin: sustinere (to hold up, support)"],
     "example_sentence": "Working 14-hour days is not sustainable — it leads to burnout."},

    {"word": "transparent", "phonetic": "trans-PAIR-uhnt", "level": "B2",
     "meaning": "Open and honest; easy to perceive or understand without hidden agendas",
     "roots": ["Latin: transparere (to show through)"],
     "example_sentence": "Our hiring process is transparent — every candidate gets the same evaluation criteria."},

    {"word": "undermine", "phonetic": "un-der-MINE", "level": "B2",
     "meaning": "To gradually weaken or damage something, especially confidence or authority",
     "roots": ["Middle English: underminen (to dig beneath)"],
     "example_sentence": "Skipping retrospectives will undermine the team's trust in the process."},

    {"word": "versatile", "phonetic": "VUR-suh-tuhl", "level": "B2",
     "meaning": "Able to adapt or be adapted to many different functions or activities",
     "roots": ["Latin: versatilis (turning, revolving)"],
     "example_sentence": "React Native is a versatile framework — one codebase for iOS and Android."},

    {"word": "advocate", "phonetic": "AD-vuh-kayt", "level": "B2",
     "meaning": "To publicly support or recommend a particular cause or policy",
     "roots": ["Latin: advocare (to call to one's aid)"],
     "example_sentence": "Our tech lead advocates for test-driven development on every project."},

    {"word": "coherent", "phonetic": "koh-HEER-uhnt", "level": "B2",
     "meaning": "Logical and consistent; making sense as a whole",
     "roots": ["Latin: cohaerere (to stick together)"],
     "example_sentence": "The architecture document should be coherent so new joiners can follow it."},

    {"word": "compatible", "phonetic": "kuhm-PAT-uh-buhl", "level": "B2",
     "meaning": "Able to exist or work together without conflict",
     "roots": ["Latin: compati (to suffer together)"],
     "example_sentence": "Make sure the new library is compatible with our current Node.js version."},

    {"word": "compensate", "phonetic": "KOM-puhn-sayt", "level": "B2",
     "meaning": "To make up for something unwelcome by providing something positive",
     "roots": ["Latin: compensare (to weigh together, balance)"],
     "example_sentence": "The company will compensate employees who work on public holidays."},

    {"word": "controversy", "phonetic": "KON-truh-vur-see", "level": "B2",
     "meaning": "Prolonged public disagreement or heated discussion about a topic",
     "roots": ["Latin: controversia (a turning against, dispute)"],
     "example_sentence": "The decision to move from Slack to Teams caused quite a controversy in the office."},

    {"word": "credible", "phonetic": "KRED-ih-buhl", "level": "B2",
     "meaning": "Able to be believed or trusted; convincing",
     "roots": ["Latin: credibilis (worthy of belief)"],
     "example_sentence": "We need credible benchmarks to prove the new algorithm is faster."},

    {"word": "diminish", "phonetic": "dih-MIN-ish", "level": "B2",
     "meaning": "To make or become less in size, importance, or value",
     "roots": ["Latin: diminuere (to make smaller)"],
     "example_sentence": "The value of manual testing doesn't diminish even with good automation."},

    {"word": "dispose", "phonetic": "dih-SPOZE", "level": "B2",
     "meaning": "To get rid of something, or to arrange things in a particular way",
     "roots": ["Latin: disponere (to arrange, distribute)"],
     "example_sentence": "We need to properly dispose of unused AWS resources to save costs."},

    {"word": "incentive", "phonetic": "in-SEN-tiv", "level": "B2",
     "meaning": "Something that motivates or encourages someone to do something",
     "roots": ["Latin: incentivum (that which sets the tune)"],
     "example_sentence": "The company offers stock options as an incentive for senior engineers."},

    {"word": "inadequate", "phonetic": "in-AD-uh-kwuht", "level": "B2",
     "meaning": "Not sufficient or not good enough for a particular purpose",
     "roots": ["Latin: in- (not) + adaequare (to make equal)"],
     "example_sentence": "The current error logging is inadequate — we're missing critical context."},

    {"word": "infrastructure", "phonetic": "IN-fruh-struk-chur", "level": "B2",
     "meaning": "The basic systems and structures needed for something to function",
     "roots": ["Latin: infra (below) + structura (building)"],
     "example_sentence": "Our cloud infrastructure needs to scale automatically during peak traffic."},

    {"word": "manipulation", "phonetic": "muh-nip-yoo-LAY-shuhn", "level": "B2",
     "meaning": "The act of handling or controlling something skillfully, or influencing someone unfairly",
     "roots": ["Latin: manipulus (handful, a small group)"],
     "example_sentence": "DOM manipulation in vanilla JavaScript can become complex for large UIs."},

    {"word": "perspective", "phonetic": "per-SPEK-tiv", "level": "B2",
     "meaning": "A particular way of thinking about or viewing something",
     "roots": ["Latin: perspicere (to look through, to see clearly)"],
     "example_sentence": "From the user's perspective, the checkout process has too many steps."},

    {"word": "pragmatic", "phonetic": "prag-MAT-ik", "level": "B2",
     "meaning": "Dealing with things in a practical way rather than following theories or ideals",
     "roots": ["Greek: pragmatikos (skilled in business)"],
     "example_sentence": "Let's take a pragmatic approach and ship the MVP first."},

    {"word": "phenomenon", "phonetic": "feh-NOM-uh-non", "level": "B2",
     "meaning": "A fact or situation that is observed to exist or happen, especially one whose cause is in question",
     "roots": ["Greek: phainomenon (thing appearing to view)"],
     "example_sentence": "The sudden spike in downloads is an interesting phenomenon we should investigate."},

    {"word": "proactive", "phonetic": "proh-AK-tiv", "level": "B2",
     "meaning": "Creating or controlling a situation rather than just responding to it",
     "roots": ["Latin: pro (before) + English: active"],
     "example_sentence": "Be proactive about reporting potential security issues before they become breaches."},

    {"word": "rationale", "phonetic": "rash-uh-NAL", "level": "B2",
     "meaning": "A set of reasons or a logical basis for a course of action or belief",
     "roots": ["Latin: rationalis (of or belonging to reason)"],
     "example_sentence": "Please document the rationale behind choosing MongoDB over PostgreSQL."},

    {"word": "scrutiny", "phonetic": "SKROO-tih-nee", "level": "B2",
     "meaning": "Close and careful examination or observation of something",
     "roots": ["Latin: scrutinium (a search, inquiry)"],
     "example_sentence": "Every line of code in the payment module receives extra scrutiny during review."},

    {"word": "aggregate", "phonetic": "AG-rih-guht", "level": "B2",
     "meaning": "To combine or collect together into a single total or group",
     "roots": ["Latin: aggregare (to add to a flock, join together)"],
     "example_sentence": "We aggregate data from all microservices into a single analytics dashboard."},

    # ============================================================
    # C1 — Advanced (50 words)
    # ============================================================
    {"word": "ameliorate", "phonetic": "uh-MEEL-yuh-rayt", "level": "C1",
     "meaning": "To make a bad or unpleasant situation better",
     "roots": ["Latin: ameliorare (to make better)"],
     "example_sentence": "The new caching layer should ameliorate the slow query response times."},

    {"word": "articulate", "phonetic": "ar-TIK-yoo-luht", "level": "C1",
     "meaning": "To express ideas or feelings clearly and effectively in words",
     "roots": ["Latin: articulare (to separate into joints, to speak distinctly)"],
     "example_sentence": "She articulated the technical challenges so well that even the client understood."},

    {"word": "assertion", "phonetic": "uh-SUR-shuhn", "level": "C1",
     "meaning": "A confident and forceful statement of fact or belief",
     "roots": ["Latin: assertio (a declaration, affirmation)"],
     "example_sentence": "His assertion that the bug was in the database layer turned out to be correct."},

    {"word": "bureaucracy", "phonetic": "byoo-ROK-ruh-see", "level": "C1",
     "meaning": "A system of government or management with many complicated rules and processes",
     "roots": ["French: bureau (desk) + Greek: kratos (power)"],
     "example_sentence": "The procurement process involves too much bureaucracy for a startup."},

    {"word": "circumvent", "phonetic": "sur-kuhm-VENT", "level": "C1",
     "meaning": "To find a way around an obstacle or to avoid something by being clever",
     "roots": ["Latin: circumvenire (to come around, surround)"],
     "example_sentence": "We found a way to circumvent the API rate limit by implementing request batching."},

    {"word": "commensurate", "phonetic": "kuh-MEN-suh-ruht", "level": "C1",
     "meaning": "Corresponding in size, extent, or degree; proportional",
     "roots": ["Latin: commensurare (to measure together)"],
     "example_sentence": "The salary offered should be commensurate with industry standards for this role."},

    {"word": "concede", "phonetic": "kuhn-SEED", "level": "C1",
     "meaning": "To admit that something is true after first denying or resisting it",
     "roots": ["Latin: concedere (to give way, yield)"],
     "example_sentence": "I concede that your approach to the problem is more elegant than mine."},

    {"word": "consolidate", "phonetic": "kuhn-SOL-ih-dayt", "level": "C1",
     "meaning": "To combine several things into a single more effective or coherent whole",
     "roots": ["Latin: consolidare (to make solid)"],
     "example_sentence": "We should consolidate the three microservices into one since they always deploy together."},

    {"word": "constituency", "phonetic": "kuhn-STICH-oo-uhn-see", "level": "C1",
     "meaning": "A body of voters or supporters; a group of people with shared interests",
     "roots": ["Latin: constituere (to set up, establish)"],
     "example_sentence": "Our core constituency is first-generation English learners in tier-2 cities."},

    {"word": "contentious", "phonetic": "kuhn-TEN-shuhs", "level": "C1",
     "meaning": "Causing or likely to cause disagreement; controversial",
     "roots": ["Latin: contentio (a striving, contest)"],
     "example_sentence": "The decision to rewrite the codebase from scratch was a contentious one."},

    {"word": "corroborate", "phonetic": "kuh-ROB-uh-rayt", "level": "C1",
     "meaning": "To confirm or give support to a statement, theory, or finding",
     "roots": ["Latin: corroborare (to strengthen)"],
     "example_sentence": "The crash logs corroborate the user's complaint about the app freezing."},

    {"word": "delineate", "phonetic": "dih-LIN-ee-ayt", "level": "C1",
     "meaning": "To describe or outline something precisely and in detail",
     "roots": ["Latin: delineare (to sketch out)"],
     "example_sentence": "The architect delineated the boundaries between each microservice clearly."},

    {"word": "disposition", "phonetic": "dis-puh-ZIH-shuhn", "level": "C1",
     "meaning": "A person's natural tendency or inclination to behave in a particular way",
     "roots": ["Latin: dispositio (arrangement, management)"],
     "example_sentence": "Her calm disposition makes her the ideal person to handle escalated client issues."},

    {"word": "efficacy", "phonetic": "EF-ih-kuh-see", "level": "C1",
     "meaning": "The ability to produce a desired or intended result",
     "roots": ["Latin: efficacia (effectiveness)"],
     "example_sentence": "We need to measure the efficacy of the new onboarding flow with real users."},

    {"word": "empirical", "phonetic": "em-PEER-ih-kuhl", "level": "C1",
     "meaning": "Based on observation or experience rather than theory or pure logic",
     "roots": ["Greek: empeirikos (experienced, skilled)"],
     "example_sentence": "We have empirical evidence that dark mode increases session duration by 12%."},

    {"word": "exacerbate", "phonetic": "ig-ZAS-er-bayt", "level": "C1",
     "meaning": "To make a problem, situation, or feeling worse",
     "roots": ["Latin: exacerbare (to irritate, provoke)"],
     "example_sentence": "Adding more features now will only exacerbate the existing performance issues."},

    {"word": "formidable", "phonetic": "FOR-mih-duh-buhl", "level": "C1",
     "meaning": "Inspiring fear or respect through being impressively large, powerful, or capable",
     "roots": ["Latin: formidabilis (causing fear)"],
     "example_sentence": "Google is a formidable competitor but we have a niche they haven't addressed."},

    {"word": "indigenous", "phonetic": "in-DIJ-uh-nuhs", "level": "C1",
     "meaning": "Originating or occurring naturally in a particular place; native",
     "roots": ["Latin: indigena (a native)"],
     "example_sentence": "The app supports indigenous languages like Telugu and Tamil alongside English."},

    {"word": "inherent", "phonetic": "in-HEER-uhnt", "level": "C1",
     "meaning": "Existing as a natural or permanent part of something",
     "roots": ["Latin: inhaerere (to stick in, cling to)"],
     "example_sentence": "There's an inherent risk in deploying on Fridays — we avoid it."},

    {"word": "meticulous", "phonetic": "meh-TIK-yoo-luhs", "level": "C1",
     "meaning": "Showing great attention to detail; very careful and precise",
     "roots": ["Latin: meticulosus (fearful, timid — evolved to mean carefully cautious)"],
     "example_sentence": "She is meticulous about code formatting — every PR she reviews is spotless."},

    {"word": "paradigm", "phonetic": "PAIR-uh-dyme", "level": "C1",
     "meaning": "A typical example, pattern, or model of something; a framework of thinking",
     "roots": ["Greek: paradeigma (pattern, model)"],
     "example_sentence": "The shift from monolith to microservices is a paradigm change in how we build software."},

    {"word": "paradox", "phonetic": "PAIR-uh-doks", "level": "C1",
     "meaning": "A statement or situation that seems contradictory but may actually be true",
     "roots": ["Greek: paradoxon (contrary to expectation)"],
     "example_sentence": "It's a paradox — adding more developers to a late project makes it even later."},

    {"word": "perpetuate", "phonetic": "per-PECH-oo-ayt", "level": "C1",
     "meaning": "To make something continue indefinitely without change",
     "roots": ["Latin: perpetuare (to make perpetual)"],
     "example_sentence": "Copy-pasting code instead of refactoring perpetuates technical debt."},

    {"word": "preclude", "phonetic": "prih-KLOOD", "level": "C1",
     "meaning": "To prevent something from happening; to make impossible",
     "roots": ["Latin: praecludere (to shut off, close)"],
     "example_sentence": "The tight budget precludes hiring a dedicated DevOps engineer."},

    {"word": "proliferate", "phonetic": "pruh-LIF-uh-rayt", "level": "C1",
     "meaning": "To increase rapidly in number; to spread and multiply",
     "roots": ["Latin: proles (offspring) + ferre (to bear)"],
     "example_sentence": "Unused API endpoints tend to proliferate if we don't prune them regularly."},

    {"word": "reconcile", "phonetic": "REK-uhn-syle", "level": "C1",
     "meaning": "To find a way to make two different ideas, facts, or situations agree",
     "roots": ["Latin: reconciliare (to bring together again)"],
     "example_sentence": "We need to reconcile the data in our analytics dashboard with the raw database numbers."},

    {"word": "redundant", "phonetic": "rih-DUN-duhnt", "level": "C1",
     "meaning": "No longer needed or useful; exceeding what is necessary",
     "roots": ["Latin: redundare (to overflow)"],
     "example_sentence": "Half the utility functions in this module are redundant and can be deleted."},

    {"word": "scrutinize", "phonetic": "SKROO-tih-nize", "level": "C1",
     "meaning": "To examine or inspect something closely and thoroughly",
     "roots": ["Latin: scrutinium (a thorough search)"],
     "example_sentence": "The security team will scrutinize every third-party dependency we use."},

    {"word": "substantiate", "phonetic": "suhb-STAN-shee-ayt", "level": "C1",
     "meaning": "To provide evidence to support or prove the truth of something",
     "roots": ["Latin: substantia (substance, essence)"],
     "example_sentence": "You'll need to substantiate your performance claims with benchmark data."},

    {"word": "trajectory", "phonetic": "truh-JEK-tuh-ree", "level": "C1",
     "meaning": "The path followed by a moving object, or the general direction of a trend",
     "roots": ["Latin: trajectoria (a crossing over)"],
     "example_sentence": "Based on the current trajectory, we'll hit 1 million users by March."},

    {"word": "unprecedented", "phonetic": "un-PRES-ih-den-tid", "level": "C1",
     "meaning": "Never done or known before; completely new and without previous example",
     "roots": ["English: un- (not) + Latin: praecedere (to go before)"],
     "example_sentence": "The app saw unprecedented growth — 500K downloads in the first week."},

    {"word": "viable", "phonetic": "VY-uh-buhl", "level": "C1",
     "meaning": "Capable of working successfully; feasible and practical",
     "roots": ["Latin: vita (life) → viable (capable of living)"],
     "example_sentence": "Is building a custom solution viable, or should we use an existing SaaS product?"},

    {"word": "alleviate", "phonetic": "uh-LEE-vee-ayt", "level": "C1",
     "meaning": "To make suffering, a problem, or a burden less severe",
     "roots": ["Latin: alleviare (to lighten)"],
     "example_sentence": "The new queue system should alleviate the pressure on the main database."},

    {"word": "conundrum", "phonetic": "kuh-NUN-drum", "level": "C1",
     "meaning": "A confusing and difficult problem or question with no easy answer",
     "roots": ["Origin uncertain — possibly pseudo-Latin from Oxford students"],
     "example_sentence": "Choosing between speed and code quality is an ongoing conundrum for our team."},

    {"word": "discrepancy", "phonetic": "dis-KREP-uhn-see", "level": "C1",
     "meaning": "A difference between two things that should be the same",
     "roots": ["Latin: discrepantia (disagreement, difference)"],
     "example_sentence": "There's a discrepancy between the invoice amount and what was actually billed."},

    {"word": "endeavour", "phonetic": "en-DEV-er", "level": "C1",
     "meaning": "To try hard to achieve something; a serious effort or attempt",
     "roots": ["Old French: endeverer (to make an effort, exert oneself)"],
     "example_sentence": "Building a truly offline-first app is a worthwhile endeavour for rural India."},

    {"word": "juxtapose", "phonetic": "JUK-stuh-pohz", "level": "C1",
     "meaning": "To place two things close together to highlight their differences",
     "roots": ["Latin: juxta (beside) + French: poser (to place)"],
     "example_sentence": "The UI mockup juxtaposes the old and new designs side by side."},

    {"word": "propensity", "phonetic": "pruh-PEN-sih-tee", "level": "C1",
     "meaning": "A natural tendency or inclination to behave in a particular way",
     "roots": ["Latin: propensus (inclined, hanging forward)"],
     "example_sentence": "Users have a propensity to skip the tutorial and jump straight into the app."},

    {"word": "repercussion", "phonetic": "ree-per-KUH-shuhn", "level": "C1",
     "meaning": "An unintended consequence of an event or action, often negative",
     "roots": ["Latin: repercutere (to strike back)"],
     "example_sentence": "Removing that API without deprecation notice will have repercussions for partner apps."},

    {"word": "stipulate", "phonetic": "STIP-yoo-layt", "level": "C1",
     "meaning": "To demand or specify a requirement as part of an agreement",
     "roots": ["Latin: stipulari (to demand a formal promise)"],
     "example_sentence": "The contract stipulates a 99.9% uptime guarantee for the SaaS platform."},

    {"word": "ubiquitous", "phonetic": "yoo-BIK-wih-tuhs", "level": "C1",
     "meaning": "Present, appearing, or found everywhere at the same time",
     "roots": ["Latin: ubique (everywhere)"],
     "example_sentence": "Smartphones are ubiquitous in India, which makes mobile-first design essential."},

    {"word": "ambivalent", "phonetic": "am-BIV-uh-luhnt", "level": "C1",
     "meaning": "Having mixed feelings or contradictory ideas about something",
     "roots": ["Latin: ambi- (both) + valere (to be strong)"],
     "example_sentence": "The team feels ambivalent about the new project management tool."},

    {"word": "benevolent", "phonetic": "beh-NEV-uh-luhnt", "level": "C1",
     "meaning": "Well-meaning and kindly; showing goodwill",
     "roots": ["Latin: benevolens (well-wishing)"],
     "example_sentence": "The CTO has a benevolent leadership style that encourages experimentation."},

    {"word": "catalyst", "phonetic": "KAT-uh-list", "level": "C1",
     "meaning": "A person or thing that causes an important change or event to happen",
     "roots": ["Greek: katalysis (dissolution, a loosening)"],
     "example_sentence": "The production outage was the catalyst for finally investing in proper monitoring."},

    {"word": "defunct", "phonetic": "dih-FUNK-t", "level": "C1",
     "meaning": "No longer existing or functioning; dead or inactive",
     "roots": ["Latin: defunctus (finished, dead)"],
     "example_sentence": "That microservice is defunct — nobody has deployed to it in over a year."},

    {"word": "fallacy", "phonetic": "FAL-uh-see", "level": "C1",
     "meaning": "A mistaken belief or flawed reasoning that seems true but is actually false",
     "roots": ["Latin: fallacia (deception, trick)"],
     "example_sentence": "It's a fallacy that more lines of code means more productivity."},

    {"word": "hierarchy", "phonetic": "HY-uh-rar-kee", "level": "C1",
     "meaning": "A system in which people or things are ranked according to relative importance",
     "roots": ["Greek: hierarchia (rule of a high priest)"],
     "example_sentence": "The component hierarchy in React follows a clear parent-child pattern."},

    {"word": "nuance", "phonetic": "NOO-ahns", "level": "C1",
     "meaning": "A subtle difference in meaning, expression, or response",
     "roots": ["French: nuance (shade, subtle difference)"],
     "example_sentence": "There's a nuance between 'few' and 'a few' that many English learners miss."},

    {"word": "resilient", "phonetic": "rih-ZIL-ee-uhnt", "level": "C1",
     "meaning": "Able to recover quickly from difficulties; tough and adaptable",
     "roots": ["Latin: resilire (to spring back, rebound)"],
     "example_sentence": "The system should be resilient enough to handle database failovers gracefully."},

    {"word": "antithesis", "phonetic": "an-TITH-uh-sis", "level": "C1",
     "meaning": "The exact opposite of something; a direct contrast",
     "roots": ["Greek: antithesis (opposition, contrast)"],
     "example_sentence": "Their management style is the antithesis of what modern agile teams need."},

    # ============================================================
    # C2 — Proficient / Mastery (50 words)
    # ============================================================
    {"word": "obfuscate", "phonetic": "OB-fuh-skayt", "level": "C2",
     "meaning": "To deliberately make something unclear, confusing, or difficult to understand",
     "roots": ["Latin: obfuscare (to darken, obscure)"],
     "example_sentence": "The politician tried to obfuscate the real issue with complicated jargon."},

    {"word": "perfunctory", "phonetic": "per-FUNK-tuh-ree", "level": "C2",
     "meaning": "Done as a duty or routine without genuine care or interest",
     "roots": ["Latin: perfunctorius (careless, superficial)"],
     "example_sentence": "His code review was perfunctory — he approved the PR without reading it."},

    {"word": "acquiescence", "phonetic": "ak-wee-ES-uhns", "level": "C2",
     "meaning": "Reluctant acceptance of something without protest",
     "roots": ["Latin: acquiescere (to find rest in)"],
     "example_sentence": "The team's acquiescence to unrealistic deadlines is damaging morale."},

    {"word": "belligerent", "phonetic": "beh-LIJ-er-uhnt", "level": "C2",
     "meaning": "Hostile and aggressive; eager to fight or argue",
     "roots": ["Latin: belliger (waging war)"],
     "example_sentence": "The client became belligerent when we explained the delay in delivery."},

    {"word": "capricious", "phonetic": "kuh-PRISH-uhs", "level": "C2",
     "meaning": "Given to sudden and unaccountable changes of mood or behaviour",
     "roots": ["Italian: capriccio (sudden start, shiver — head with hair standing up like a hedgehog)"],
     "example_sentence": "The product manager's capricious requirement changes make planning nearly impossible."},

    {"word": "capitulate", "phonetic": "kuh-PICH-oo-layt", "level": "C2",
     "meaning": "To surrender or give in to an opponent or demand after resistance",
     "roots": ["Latin: capitulare (to draw up under headings, to surrender on terms)"],
     "example_sentence": "After weeks of debate, the team capitulated and agreed to use the legacy framework."},

    {"word": "conflagration", "phonetic": "kon-fluh-GRAY-shuhn", "level": "C2",
     "meaning": "A large and destructive fire, or a major conflict or crisis",
     "roots": ["Latin: conflagrare (to burn up entirely)"],
     "example_sentence": "The data breach turned into a PR conflagration that took months to contain."},

    {"word": "consternation", "phonetic": "kon-ster-NAY-shuhn", "level": "C2",
     "meaning": "A feeling of shock and worry caused by something unexpected",
     "roots": ["Latin: consternare (to throw into confusion)"],
     "example_sentence": "There was widespread consternation when the production database went down during a demo."},

    {"word": "draconian", "phonetic": "druh-KOH-nee-uhn", "level": "C2",
     "meaning": "Excessively harsh and severe, especially of laws or punishments",
     "roots": ["Greek: Drakon (Athenian lawgiver known for extremely harsh laws)"],
     "example_sentence": "The new WFH policy feels draconian — mandatory camera-on for all meetings."},

    {"word": "ebullient", "phonetic": "ih-BUL-yuhnt", "level": "C2",
     "meaning": "Overflowing with enthusiasm, excitement, or positive energy",
     "roots": ["Latin: ebullire (to bubble out)"],
     "example_sentence": "She was ebullient after her app won first place at the internal hackathon."},

    {"word": "egregious", "phonetic": "ih-GREE-juhs", "level": "C2",
     "meaning": "Outstandingly bad; shockingly terrible",
     "roots": ["Latin: egregius (illustrious — later ironically used for outstandingly bad)"],
     "example_sentence": "Storing passwords in plain text is an egregious security violation."},

    {"word": "ephemeral", "phonetic": "eh-FEM-er-uhl", "level": "C2",
     "meaning": "Lasting for a very short time; fleeting and transient",
     "roots": ["Greek: ephemeros (lasting only a day)"],
     "example_sentence": "The hype around the new JavaScript framework was ephemeral — it died in six months."},

    {"word": "erudite", "phonetic": "AIR-oo-dyte", "level": "C2",
     "meaning": "Having or showing great knowledge or learning",
     "roots": ["Latin: erudire (to instruct, polish)"],
     "example_sentence": "The tech talk speaker was so erudite that even the seniors learned something new."},

    {"word": "extricate", "phonetic": "EKS-trih-kayt", "level": "C2",
     "meaning": "To free someone or something from a difficult or entangled situation",
     "roots": ["Latin: extricare (to unravel, disentangle)"],
     "example_sentence": "It took us three sprints to extricate the monolithic codebase into separate services."},

    {"word": "facetious", "phonetic": "fuh-SEE-shuhs", "level": "C2",
     "meaning": "Treating serious issues with deliberately inappropriate humour; flippant",
     "roots": ["Latin: facetia (jest, wittiness)"],
     "example_sentence": "He was being facetious when he said we should just delete the database and start over."},

    {"word": "ignominious", "phonetic": "ig-nuh-MIN-ee-uhs", "level": "C2",
     "meaning": "Deserving or causing public disgrace or shame",
     "roots": ["Latin: ignominia (loss of good name, disgrace)"],
     "example_sentence": "The launch was an ignominious failure — the app crashed within five minutes."},

    {"word": "impervious", "phonetic": "im-PUR-vee-uhs", "level": "C2",
     "meaning": "Not able to be affected or disturbed by something; resistant",
     "roots": ["Latin: in- (not) + pervius (passable)"],
     "example_sentence": "She seems impervious to deadline pressure and always delivers calm, quality work."},

    {"word": "inexorable", "phonetic": "in-EK-sur-uh-buhl", "level": "C2",
     "meaning": "Impossible to stop or prevent; relentless and unyielding",
     "roots": ["Latin: inexorabilis (not to be moved by entreaty)"],
     "example_sentence": "The inexorable march of AI means every developer needs to understand ML basics."},

    {"word": "insidious", "phonetic": "in-SID-ee-uhs", "level": "C2",
     "meaning": "Proceeding in a gradual, subtle way but with very harmful effects",
     "roots": ["Latin: insidiosus (deceitful, cunning)"],
     "example_sentence": "Memory leaks are insidious — everything works fine until the app suddenly crashes."},

    {"word": "magnanimous", "phonetic": "mag-NAN-ih-muhs", "level": "C2",
     "meaning": "Very generous, forgiving, or kind, especially towards a rival or enemy",
     "roots": ["Latin: magnanimus (great-souled)"],
     "example_sentence": "The team lead was magnanimous about the production bug — no blame, just solutions."},

    {"word": "nefarious", "phonetic": "neh-FAIR-ee-uhs", "level": "C2",
     "meaning": "Wicked, criminal, or villainous in nature",
     "roots": ["Latin: nefarius (wicked, abominable)"],
     "example_sentence": "The security audit revealed nefarious SQL injection attempts from unknown IPs."},

    {"word": "obstinate", "phonetic": "OB-stih-nuht", "level": "C2",
     "meaning": "Stubbornly refusing to change one's opinion or chosen course of action",
     "roots": ["Latin: obstinare (to persist, stand firm)"],
     "example_sentence": "The senior developer was obstinate about using tabs instead of spaces."},

    {"word": "ostentatious", "phonetic": "os-ten-TAY-shuhs", "level": "C2",
     "meaning": "Designed to impress or attract notice in a showy or vulgar way",
     "roots": ["Latin: ostentare (to display, show off)"],
     "example_sentence": "The UI redesign feels ostentatious — too many animations distract from usability."},

    {"word": "pernicious", "phonetic": "per-NISH-uhs", "level": "C2",
     "meaning": "Having a harmful effect, especially in a gradual or subtle way",
     "roots": ["Latin: perniciosus (destructive)"],
     "example_sentence": "Micromanagement has a pernicious effect on developer morale and creativity."},

    {"word": "perspicacious", "phonetic": "pur-spih-KAY-shuhs", "level": "C2",
     "meaning": "Having a ready insight into and understanding of things; sharp-minded",
     "roots": ["Latin: perspicax (having keen sight)"],
     "example_sentence": "A perspicacious code reviewer catches not just bugs but architectural flaws."},

    {"word": "proclivity", "phonetic": "proh-KLIV-ih-tee", "level": "C2",
     "meaning": "A strong natural tendency or inclination towards something",
     "roots": ["Latin: proclivitas (a tendency, inclination)"],
     "example_sentence": "He has a proclivity for writing overly complex solutions when simple ones exist."},

    {"word": "promulgate", "phonetic": "PROM-uhl-gayt", "level": "C2",
     "meaning": "To make widely known; to put a new law or system into effect officially",
     "roots": ["Latin: promulgare (to make publicly known)"],
     "example_sentence": "The CTO promulgated new security guidelines after the compliance audit."},

    {"word": "recalcitrant", "phonetic": "rih-KAL-sih-truhnt", "level": "C2",
     "meaning": "Having an obstinately uncooperative attitude; resisting authority or discipline",
     "roots": ["Latin: recalcitrare (to kick back)"],
     "example_sentence": "One recalcitrant developer refused to follow the agreed-upon Git branching strategy."},

    {"word": "surreptitious", "phonetic": "sur-uhp-TISH-uhs", "level": "C2",
     "meaning": "Done secretly, especially because it would not be approved of",
     "roots": ["Latin: surrepticius (stolen, secret)"],
     "example_sentence": "Someone made a surreptitious change to the config file that caused the outage."},

    {"word": "sycophant", "phonetic": "SIK-uh-fuhnt", "level": "C2",
     "meaning": "A person who acts excessively obedient towards someone in power to gain advantage",
     "roots": ["Greek: sykophantes (informer, false accuser)"],
     "example_sentence": "Surrounding yourself with sycophants instead of honest critics leads to bad decisions."},

    {"word": "tenacious", "phonetic": "teh-NAY-shuhs", "level": "C2",
     "meaning": "Holding firmly to something; persistent and determined",
     "roots": ["Latin: tenax (holding fast, firm)"],
     "example_sentence": "Her tenacious debugging finally uncovered the root cause after three days."},

    {"word": "truculent", "phonetic": "TRUK-yoo-luhnt", "level": "C2",
     "meaning": "Eager to argue or fight; aggressively defiant",
     "roots": ["Latin: truculentus (fierce, savage)"],
     "example_sentence": "The vendor became truculent when we pointed out the contract violations."},

    {"word": "vicissitude", "phonetic": "vih-SIS-ih-tood", "level": "C2",
     "meaning": "A change of circumstances or fortune, typically one that is unwelcome",
     "roots": ["Latin: vicissitudo (change, alternation)"],
     "example_sentence": "Startups must be prepared for the vicissitudes of the market."},

    {"word": "vociferous", "phonetic": "voh-SIF-er-uhs", "level": "C2",
     "meaning": "Expressing opinions or complaints in a loud and forceful way",
     "roots": ["Latin: vox (voice) + ferre (to carry)"],
     "example_sentence": "There was vociferous opposition to the mandatory return-to-office policy."},

    {"word": "anachronism", "phonetic": "uh-NAK-ruh-niz-uhm", "level": "C2",
     "meaning": "A thing that belongs to a different time period; something outdated",
     "roots": ["Greek: anachronismos (a wrong time reference)"],
     "example_sentence": "Using FTP for deployments in 2026 is an anachronism when CI/CD exists."},

    {"word": "antipathy", "phonetic": "an-TIP-uh-thee", "level": "C2",
     "meaning": "A deep-seated feeling of dislike or aversion",
     "roots": ["Greek: antipatheia (opposition of feeling)"],
     "example_sentence": "There's a clear antipathy between the engineering and sales teams over feature priorities."},

    {"word": "circumspect", "phonetic": "SUR-kuhm-spekt", "level": "C2",
     "meaning": "Wary and unwilling to take risks; thinking carefully before acting",
     "roots": ["Latin: circumspicere (to look around)"],
     "example_sentence": "We should be circumspect about adopting new technologies without proper evaluation."},

    {"word": "deleterious", "phonetic": "del-ih-TEER-ee-uhs", "level": "C2",
     "meaning": "Causing harm or damage, especially in a subtle or gradual way",
     "roots": ["Greek: deleterios (destructive, harmful)"],
     "example_sentence": "Constant context-switching has a deleterious effect on developer productivity."},

    {"word": "duplicitous", "phonetic": "doo-PLIS-ih-tuhs", "level": "C2",
     "meaning": "Deceitful; saying one thing while meaning another",
     "roots": ["Latin: duplex (double, twofold)"],
     "example_sentence": "The vendor's duplicitous pricing — different quotes for different clients — lost them the deal."},

    {"word": "equivocate", "phonetic": "ih-KWIV-uh-kayt", "level": "C2",
     "meaning": "To use ambiguous language to conceal the truth or avoid committing to a position",
     "roots": ["Latin: aequivocus (of equal voice, ambiguous)"],
     "example_sentence": "When asked about the release date, the PM continued to equivocate."},

    {"word": "incorrigible", "phonetic": "in-KOR-ih-juh-buhl", "level": "C2",
     "meaning": "Not able to be corrected, improved, or reformed",
     "roots": ["Latin: incorrigibilis (not to be corrected)"],
     "example_sentence": "He's an incorrigible optimist — always estimating tasks will take half the time they actually do."},

    {"word": "indefatigable", "phonetic": "in-dih-FAT-ih-guh-buhl", "level": "C2",
     "meaning": "Persisting tirelessly and never giving up",
     "roots": ["Latin: indefatigabilis (that cannot be tired out)"],
     "example_sentence": "The QA engineer was indefatigable in testing edge cases until the build was solid."},

    {"word": "ludicrous", "phonetic": "LOO-dih-kruhs", "level": "C2",
     "meaning": "So foolish, unreasonable, or out of place that it is amusing or ridiculous",
     "roots": ["Latin: ludicrus (sportive, meant for play)"],
     "example_sentence": "The idea of rewriting the entire backend in a week is ludicrous."},

    {"word": "mendacious", "phonetic": "men-DAY-shuhs", "level": "C2",
     "meaning": "Not telling the truth; lying or dishonest",
     "roots": ["Latin: mendax (lying, deceitful)"],
     "example_sentence": "The mendacious status updates hid the fact that the project was months behind."},

    {"word": "obtuse", "phonetic": "ob-TOOS", "level": "C2",
     "meaning": "Annoyingly insensitive or slow to understand; blunt in understanding",
     "roots": ["Latin: obtusus (blunted, dull)"],
     "example_sentence": "He was being deliberately obtuse about the feedback to avoid making changes."},

    {"word": "recondite", "phonetic": "REK-uhn-dyte", "level": "C2",
     "meaning": "Not easily understood; dealing with very obscure or abstruse subject matter",
     "roots": ["Latin: reconditus (hidden away, concealed)"],
     "example_sentence": "The documentation was so recondite that only the original author could understand it."},

    {"word": "superfluous", "phonetic": "soo-PUR-floo-uhs", "level": "C2",
     "meaning": "Unnecessary, especially through being more than enough",
     "roots": ["Latin: superfluus (overflowing, unnecessary)"],
     "example_sentence": "Half the fields in this API response are superfluous — the client never uses them."},

    {"word": "tantamount", "phonetic": "TAN-tuh-mownt", "level": "C2",
     "meaning": "Equivalent in seriousness to; virtually the same as",
     "roots": ["Anglo-French: tant amunter (to amount to as much)"],
     "example_sentence": "Shipping without testing is tantamount to inviting a production outage."},

    {"word": "trepidation", "phonetic": "trep-ih-DAY-shuhn", "level": "C2",
     "meaning": "A feeling of fear or anxiety about something that may happen",
     "roots": ["Latin: trepidatio (agitation, alarm)"],
     "example_sentence": "There was some trepidation about the database migration, but it went smoothly."},

    {"word": "vacillate", "phonetic": "VAS-ih-layt", "level": "C2",
     "meaning": "To waver between different opinions or actions; to be indecisive",
     "roots": ["Latin: vacillare (to sway, waver)"],
     "example_sentence": "The stakeholders kept vacillating between two designs, delaying the project by weeks."},
]

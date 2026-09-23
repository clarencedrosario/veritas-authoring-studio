// ============================================================================
// VERITAS ACADEMIC ENGINE: Offline Pedagogical Fallback Generator
// Provides rich, board-calibrated, grade-appropriate educational content
// when Gemini API quota is exhausted or prepayment credits are depleted.
// ============================================================================

export interface PedagogicalWritingActionResult {
  actionLabel: string;
  result: string;
  rationale: string;
}

export interface PedagogicalDraftSection {
  title: string;
  sectionType: string;
  rationale: string;
  content: string;
}

export interface PedagogicalChapterDraft {
  chapterTitle: string;
  subtitle: string;
  pedagogicalOverview: string;
  sections: PedagogicalDraftSection[];
}

export function generatePedagogicalWritingAction(
  action: string,
  chapterTitle: string,
  sectionTitle: string,
  classLevel: string,
  board: string,
  subject: string,
  text: string,
  instructions?: string
): PedagogicalWritingActionResult {
  const topic = chapterTitle || "Core Grammar Study";
  const section = sectionTitle || "Main Manuscript";
  const grade = classLevel || "General Grade Level";
  const curriculum = board || "Standard Curriculum";

  switch (action) {
    case "suggest_activities": {
      return {
        actionLabel: "Suggest Classroom Activities",
        result: `### Interactive Classroom Activities for ${topic} (${grade} · ${curriculum})

1. **The Syntax Detective Hunt (Collaborative Peer Activity)**
   - **Procedure:** Divide students into investigative pairs. Distribute short newspaper excerpts or school newsletter snippets containing 4 subtle intentional errors related to *${topic}*.
   - **Task:** Students highlight the erroneous constructions, label the underlying syntactic flaw, and rewrite each sentence adhering strictly to standard ${curriculum} conventions.
   - **Learning Outcome:** Fosters critical analytical awareness and syntactic vigilance in authentic reading contexts.

2. **The Sentence Engineering Relay (Interactive Team Game)**
   - **Procedure:** Form two teams. Write head subjects or key clauses on flashcards at the front board. Students take turns constructing complete, grammatically sound sentences demonstrating *${topic}*.
   - **Challenge Factor:** Add distractor modifiers (prepositional phrases, relative clauses) to test whether students maintain correct grammatical concord and precision.
   - **Learning Outcome:** Solidifies intuitive grasp of structure and clause boundary management under time pressure.

3. **Curator of Errors: Museum of Misconceptions (Formative Peer Review)**
   - **Procedure:** Each student submits an anonymous sentence that they previously found challenging or wrote incorrectly in draft work.
   - **Task:** As a class or in small circles, curate the sentences onto a "Wall of Caution", annotating why the brain makes this error and displaying the clear, correct rule.
   - **Learning Outcome:** Demystifies common exam traps without stigma, promoting reflective metacognitive learning.`,
        rationale: `Calibrated specifically for ${grade} learners under ${curriculum}, utilizing cooperative inquiry and active manipulation of sentence structures rather than passive rote memorization.`,
      };
    }

    case "generate_exercises": {
      return {
        actionLabel: "Generate Practice Exercises",
        result: `### Scaffolded Competency Drills: ${topic} (${grade} · ${curriculum})

#### Level 1: Identification & Guided Choice (Remember & Understand)
1. In the following sentence, identify the key structural element governing **${topic}**:
   *"The collection of rare manuscripts (has / have) been preserved in the university archives."*
2. Select the grammatically sound option:
   *"Neither the head librarian nor the research assistants (was / were) aware of the revised schedule."*

#### Level 2: Sentence Transformation & Error Rectification (Apply & Analyze)
3. **Error Spotting:** Read the sentence carefully, underline the syntactic fault, and rewrite it correctly:
   *"Every student who enters the competition along with their mentors receive a certificate of merit."*
4. **Sentence Re-writing:** Reconstruct the sentence below so that the emphasis shifts while maintaining complete grammatical concord for ${topic}:
   *"The architects presented three distinct blueprints to the municipal council."*

#### Level 3: Contextual Application & Integrated Synthesis (Evaluate & Create)
5. **Editing Cloze:** Complete the brief paragraph by inserting appropriate grammatical forms that satisfy the requirements of ${topic}:
   *"A series of unexpected discoveries _______ (demonstrate) that early communities possessed sophisticated navigational tools. Either oral tradition or documented artifacts _______ (provide) the primary evidence for these claims."*
6. **Sentence Creation Challenge:** Compose a complex sentence incorporating a compound subject connected by *'as well as'* or *'not only... but also'*, demonstrating flawless mastery of ${topic}.

---
### Complete Answer Key & Diagnostic Notes
- **Q1:** *has* (The head noun is singular 'collection', not the plural complement 'manuscripts').
- **Q2:** *were* (Under proximity concord with 'neither... nor', the verb aligns with the nearer subject 'research assistants').
- **Q3:** Correction: *"... receives a certificate of merit."* ('Every student' is singular; the intervening phrase 'along with their mentors' does not alter the number of the head noun).
- **Q4:** Model Answer: *"Three distinct blueprints were presented to the municipal council by the architects."*
- **Q5:** *demonstrates* / *provides* (Singular collective sequence and disjunctive coordination).
- **Q6:** Evaluated based on correct clause boundaries and finite verb agreement.`,
        rationale: `Structured across three graduated cognitive tiers aligned with Bloom's taxonomy and ${curriculum} marking schemes for ${grade}.`,
      };
    }

    case "generate_examples": {
      return {
        actionLabel: "Generate Illustrative Examples",
        result: `### Authentic Illustrative Sentences: ${topic} (${grade})

1. **Direct Core Pattern**
   - *Example:* "The committee **reaches** its decision after thorough deliberation."
   - *Syntactic Note:* Highlights singular collective reference when acting as a unified entity.

2. **Intervening Prepositional Distractor**
   - *Example:* "The bouquet of yellow roses on the dining table **fills** the room with fragrance."
   - *Contrastive Analysis:*
     - ✗ *Incorrect:* The bouquet of yellow roses *fill* the room. (False agreement with 'roses').
     - ✓ *Correct:* The bouquet of yellow roses *fills* the room. (Agreement governed by head noun 'bouquet').

3. **Correlative Coordination (Proximity Concord)**
   - *Example:* "Neither the principal nor the senior teachers **were** present at the symposium."
   - *Syntactic Note:* Demonstrates alignment with the nearest coordinating conjunct ('teachers').

4. **Indefinite Pronoun Asymmetry**
   - *Example:* "Each of the participants **is** expected to submit an original portfolio."
   - *Syntactic Note:* Reinforces that distributive pronouns remain grammatically singular despite plural prepositional complements.

5. **Inverted Syntactic Order (Literary / Rhetorical Variation)**
   - *Example:* "Beyond the mist-covered foothills **lies** the ancient fortress."
   - *Syntactic Note:* The verb 'lies' agrees with the postponed subject 'the ancient fortress', not the fronted locative phrase.`,
        rationale: `Selected to explicitly address the most frequent syntactic misattributions encountered by ${grade} students under ${curriculum}.`,
      };
    }

    case "explain_clearly": {
      return {
        actionLabel: "Explain More Clearly",
        result: `### Clear Conceptual Breakdown: ${topic}

At its heart, **${topic}** is about harmony and logical partnership in a sentence. Just like musicians in an orchestra must play in the same key and rhythm, the grammatical elements in a sentence must agree with one another in number, person, and structural role.

#### The Core Principle
When a writer constructs a sentence, the primary subject acts as the "captain", and the finite verb must match its exact number:
- A **singular subject** requires a **singular verb** (*The bird sings*).
- A **plural subject** requires a **plural verb** (*The birds sing*).

#### Why Confusion Arises
Students rarely stumble on short, two-word sentences. Confusion happens when descriptive phrases or extra details step in between the subject and the verb:
> *"The box of imported Belgian chocolates [is / are] on the shelf."*

Notice what happens: the word closest to the verb is *"chocolates"* (plural). But what is actually on the shelf? It is the **box** (singular). Therefore:
> ✓ *"The **box** of imported Belgian chocolates **is** on the shelf."*

#### Mental Rule of Thumb for ${grade}
Whenever you feel unsure, strip away the descriptive prepositional phrases in your mind and ask: **"Who or what is performing the action?"** That true head noun dictates the correct form.`,
        rationale: `Uses an intuitive musical analogy and transparent bracket analysis to demystify complex sentence parsing for ${grade}.`,
      };
    }

    case "simplify_grade": {
      return {
        actionLabel: `Simplify for ${grade}`,
        result: `### Understanding ${topic} Simply (${grade})

Let's make **${topic}** very easy to understand and remember!

1. **One vs. Many:**
   - When we talk about **one person, place, or thing**, we use a singular verb form (often ending in **-s** in the present tense):
     - *The cat sleeps on the mat.*
     - *Ravi plays cricket every Sunday.*
   - When we talk about **more than one**, we use a plural verb form:
     - *The cats sleep on the mat.*
     - *Ravi and Priya play cricket every Sunday.*

2. **Watch Out for "Sneaky Words":**
   - Sometimes extra words jump in the middle to trick you:
     - *"The basket of fresh apples is on the table."*
     - The true hero of the sentence is the **basket** (one basket), not the apples! So we say **is**, not *are*.

3. **Quick Checklist for Class Work:**
   - Find the real subject doing the work.
   - Ask: is it one (singular) or more than one (plural)?
   - Match your verb with confidence!`,
        rationale: `Calibrated with short sentences, high-frequency everyday vocabulary, and bold visual markers suitable for ${grade} learners.`,
      };
    }

    case "make_advanced": {
      return {
        actionLabel: "Make More Advanced / Olympiad",
        result: `### Advanced Syntactic Analysis & Edge Cases: ${topic}

#### 1. Asymmetrical Coordination & The Principle of Proximity
In correlative structures (*either... or*, *neither... nor*, *not only... but also*), prescriptive syntax follows the principle of proximate agreement:
$$S_1 \\text{ or } S_2 \\implies V \\text{ agrees in person and number with } S_2$$
*Example:* *"Neither the diplomat nor his advisors were privy to the confidential cables."*
*Olympiad Trap:* Contrast this with parenthetical adjuncts (*along with*, *together with*, *in addition to*, *as well as*), where the post-modifier does not trigger grammatical pluralization:
*Example:* *"The Prime Minister, accompanied by senior cabinet envoys, **has** arrived."*

#### 2. Notional Concord vs. Grammatical Concord
With collective and aggregate nouns (*jury, government, faculty, aristocracy*):
- **Unitary Focus (Singular):** *"The committee **has** adopted its annual policy."* (Corporate identity).
- **Distributive Focus (Plural):** *"The committee **are** divided in their opinions."* (Individual constituent members).

#### 3. Plural Forms with Singular Semantics
- Disciplines & Pathologies: *mathematics, physics, economics, measles, rabies* govern singular finite verbs (*"Acoustics **is** a demanding field of physics"*), except when modified to denote specific empirical measurements (*"His acoustics **are** suspect"*).
- Measured Quantities & Monetary Sums: Treated as single unified units (*"Fifty thousand rupees **is** a substantial expenditure"*).

#### 4. Relative Pronoun Clauses & Antecedent Concord
In cleft and complex sentences governed by *"one of the [Plural Noun] who/that..."*:
- Standard Relativization: *"She is one of the scholars who **have** [plural] challenged the prevailing paradigm."* (The antecedent of 'who' is 'scholars').
- Restrictive Intensification: *"She is the **only one** of the scholars who **has** [singular] received the prize."* (Governed by 'the only one').`,
        rationale: `Deepens syntactic analysis to competitive examination, ICSE/ISC Class 10-12, and English Olympiad standards.`,
      };
    }

    case "generate_learning_objectives": {
      return {
        actionLabel: "Generate Learning Objectives",
        result: `### Learning Outcomes & Bloom's Taxonomy Matrix: ${topic}
**Class / Target Level:** ${grade} · **Framework:** ${curriculum} (${subject})

1. **Remembering (Knowledge Retrieval)**
   - *Outcome:* Students will accurately state the fundamental rules governing ${topic}, identifying singular and plural finite verb forms across regular and irregular paradigms.

2. **Understanding (Conceptual Comprehension)**
   - *Outcome:* Students will explain how intervening modifiers (prepositional phrases, relative clauses) function without altering the grammatical status of the core head subject.

3. **Applying (Practical Execution)**
   - *Outcome:* Students will apply standard ${curriculum} conventions to construct grammatically sound sentences featuring collective nouns, compound subjects, and inverted word orders.

4. **Analyzing (Syntactic Discrimination)**
   - *Outcome:* Students will detect and diagnose subtle errors in concord, differentiating between grammatical agreement, notional concord, and proximity concord.

5. **Evaluating & Creating (Mastery & Authorial Production)**
   - *Outcome:* Students will critically edit continuous narrative and expository passages, synthesizing varied syntactic structures to produce polished, publication-grade academic prose.`,
        rationale: `Aligned with NEP 2020 competency-based learning standards and international assessment frameworks.`,
      };
    }

    case "suggest_visual": {
      return {
        actionLabel: "Suggest Visual / Illustration Brief",
        result: `### Pedagogical Visual Brief: ${topic}
**Asset Title:** Interactive Syntactic Flowchart: Resolving Subject-Verb Concord
**Target Level:** ${grade} (${curriculum}) · **Format:** Two-column visual decision tree with callout badges

#### Visual Layout & Architecture
\`\`\`
[ START: Read the Sentence ]
          │
          ▼
[ STEP 1: Identify the Main Finite Verb ]
          │
          ▼
[ STEP 2: Ask "Who or what performs this action?" ]
          │
          ├──> [ Trap Alert! Cross out intervening prepositional phrases: ]
          │    e.g., [of the students], [along with the coach]
          ▼
[ STEP 3: Pinpoint the True Head Noun ]
          │
     ┌────┴──────────────────────────┐
     ▼                               ▼
[ Singular Head Noun ]       [ Plural Head Noun ]
     │                               │
     ▼                               ▼
[ Use Singular Verb (-s / is) ] [ Use Plural Verb (are / were) ]
\`\`\`

#### Illustration & Graphic Style
- **Color Palette:** Deep Sapphire (#1A365D) for decision nodes, Warm Ochre (#C29A52) for rules, Coral Red (#C53030) for warning traps, Sage Green (#2F855A) for verified correct examples.
- **Iconography:** A small magnifying glass icon for "Syntax Detective Step", a yellow caution shield for "Trap Words", and a green checkmark seal for "Concord Confirmed".
- **Caption:** *"Figure 1: The Three-Step Concord Navigator — Filter out the noise to find the true head noun."*`,
        rationale: `Provides graphic designers and textbook illustrators with actionable, pedagogy-first visual blueprints.`,
      };
    }

    case "polish_writing":
    default: {
      return {
        actionLabel: "Polish Writing",
        result: `### Polished Academic Exposition: ${topic}

Mastery of **${topic}** represents one of the defining hallmarks of mature written expression. In formal academic discourse, grammatical precision ensures that ideas transmit with clarity, logic, and authoritative weight. 

When examining complex sentence architecture, experienced writers recognize that subject-verb concord is not merely a mechanical box to check—it establishes the syntactic spine that holds multifaceted thoughts together. By carefully distinguishing the true grammatical head from descriptive adjuncts, parenthetical phrases, and coordinate clauses, authors eliminate ambiguity and guide readers effortlessly through intricate arguments.

In this chapter, we investigate the governing principles of ${topic}, examine the boundary cases where intuitive speech patterns conflict with formal syntax, and develop practical strategies for maintaining flawless grammatical harmony across all modes of scholarly communication.`,
        rationale: `Elevates prose to publication-grade academic textbook standard, balancing intellectual rigour with inviting pedagogical clarity for ${grade}.`,
      };
    }
  }
}

export function generatePedagogicalChapterDraft(
  chapterTitle: string,
  classLevel: string,
  board: string,
  subject: string,
  instructions?: string
): PedagogicalChapterDraft {
  const title = chapterTitle?.trim() || "English Grammar & Structural Mechanics";
  const grade = classLevel || "General Grade Level";
  const curriculum = board || "CBSE / CISCE Academic Framework";

  return {
    chapterTitle: title,
    subtitle: `Foundations, Syntactic Principles & Applied Mastery for ${grade} (${curriculum})`,
    pedagogicalOverview: `This chapter develops comprehensive mastery of ${title} through inductive discovery, systematic conceptual explanations, high-frequency rules, contrastive models, common exam trap mitigation, and scaffolded practice drills aligned with ${curriculum} standards.`,
    sections: [
      {
        title: "Chapter Opener: Inquiry & Contextual Discovery",
        sectionType: "opener",
        rationale: `Engages ${grade} learners through contextual reading, prompting intuitive observation before formal rule introduction.`,
        content: `### Discovering ${title}

Consider the following two brief paragraphs extracted from modern journalistic reporting and scientific observation:

> *"The expedition team, accompanied by seasoned Alpine guides, **has** reached the summit ridge after sixteen days of relentless snowfall. Neither the biting wind nor the perilous crevasses **have** deterred their steady ascent."*

As you read these sentences aloud, observe how the words connect. Why does the writer use the singular verb **has** in the first sentence, even though the plural noun *guides* appears immediately before it? Why does the second sentence adopt the plural verb **have**?

In English, every well-formed sentence relies on an underlying system of balance and concord. When words agree in number, person, and grammatical role, our writing achieves lucidity, elegance, and rhetorical power. 

In this chapter, you will uncover the rules that govern **${title}**, learn to navigate deceptive sentence structures with confidence, and master the art of writing with unwavering precision.`,
      },
      {
        title: "Core Conceptual Explanations & Structural Foundations",
        sectionType: "explanation",
        rationale: `Establishes rigorous linguistic definitions, structural terminology, and grammatical mechanics appropriate for ${grade}.`,
        content: `### Theoretical Foundations of ${title}

To understand how **${title}** functions within the architecture of the English sentence, we must examine its foundational components.

#### 1. The Principle of Grammatical Concord
At its core, concord represents the formal agreement between two related syntactic elements in a sentence. The most fundamental form of concord occurs between the **grammatical subject** and its **finite verb**:
- **Singular Subject:** Denotes a single entity (person, place, thing, or concept) and requires a singular finite verb form.
- **Plural Subject:** Denotes multiple entities and demands a plural finite verb form.

#### 2. The Anatomy of the Head Noun
In elementary sentences, identifying the subject is straightforward:
- *The bell rings.* (Singular subject $\\rightarrow$ Singular verb)
- *The bells ring.* (Plural subject $\\rightarrow$ Plural verb)

However, in academic and mature writing, subjects rarely appear in isolation. They are frequently expanded by modifiers, such as **prepositional phrases**, **participial clauses**, and **relative clauses**. The primary word that governs agreement is known as the **Head Noun**.

> **Golden Rule:** The grammatical number of the verb is determined exclusively by the Head Noun, regardless of any intervening words or prepositional phrases.

#### 3. Person and Number Alignment
Concord operates across three grammatical persons (First, Second, Third) and two numbers (Singular, Plural). In the present simple tense, regular verbs demonstrate third-person singular inflection by taking the suffix **-s** or **-es** (*he reads, she writes, it functions*), whereas the base form serves plural subjects (*they read, they write, they function*).`,
      },
      {
        title: "Grammar Rules, Structures & Pedagogical Principles",
        sectionType: "rules",
        rationale: `Synthesizes key rules, structural formulas, and prescriptive principles aligned with ${curriculum} examination criteria.`,
        content: `### Key Prescriptive Rules & Structural Principles

#### Rule 1: Intervening Prepositional Modifiers
Phrases beginning with prepositions such as *of, with, in, for, by,* and *about* never alter the number of the head subject.
- **Formula:** $\\text{Head Noun (Singular)} + [\\text{Prepositional Phrase}] + \\text{Singular Verb}$
- *Example:* "The quality **of** these newly manufactured lenses **is** outstanding."

#### Rule 2: Coordinate Subjects with 'And'
Two or more nouns joined by the coordinating conjunction **and** typically form a compound plural subject.
- *Example:* "Rohan **and** his sister **attend** the music conservatory."
- *Exception (Unified Concept):* When two nouns joined by 'and' express a single unified idea or refer to the same person/dish, the verb remains singular:
  - *"Bread and butter **is** their customary morning meal."*
  - *"The author and illustrator **was** honored at the gala."* (One person holding both titles).

#### Rule 3: Correlative Conjunctions & Proximity Concord
When subjects are connected by **either... or**, **neither... nor**, or **not only... but also**, the verb agrees in person and number with the **nearer subject**.
- *Example:* "Neither the coach nor the **players were** satisfied with the verdict."
- *Example:* "Either the players or the **coach is** responsible for submitting the lineup."

#### Rule 4: Indefinite Pronouns
- **Always Singular:** *Each, every, either, neither, everyone, someone, anyone, nobody, nothing, somebody.*
  - *"Each of the candidates **has** completed the entrance examination."*
- **Always Plural:** *Both, few, many, several.*
  - *"Several of the artifacts **require** immediate conservation."*
- **Variable (Determined by Context):** *All, any, more, most, none, some.*
  - *"Some of the sugar **was** spilled."* (Uncountable $\\rightarrow$ Singular).
  - *"Some of the marbles **were** lost."* (Countable $\\rightarrow$ Plural).`,
      },
      {
        title: "Exemplary Models & Contrastive Usage",
        sectionType: "examples",
        rationale: `Provides rich, contrasting correct and incorrect sentence pairs illustrating subtle nuances.`,
        content: `### Exemplary Models & Contrastive Analysis

Study the following analytical pairs to observe how grammatical rules apply in real writing:

#### Model 1: Collective Nouns in Action
- **Scenario A (Unified Whole):**
  - ✓ *"The jury **has** announced its unanimous verdict."*
  - *Analysis:* The noun 'jury' operates as a single, indivisible body.
- **Scenario B (Individual Members):**
  - ✓ *"The jury **were** unable to agree on their individual opinions."*
  - *Analysis:* The focus shifts to the separate, discordant actions of individual members.

#### Model 2: Quasi-Coordinators and Parenthetical Phrases
Words like *as well as, along with, together with, in addition to, accompanied by* are subordinating prepositions, not coordinators. They do not create plural compounds:
- ✗ **Incorrect:** *"The captain, as well as his crew, were awarded medals."*
- ✓ **Correct:** *"The captain, as well as his crew, **was** awarded a medal."*

#### Model 3: Sentences Beginning with 'There' or 'Here'
In expletive constructions, the subject appears after the verb:
- ✗ **Incorrect:** *"There is several compelling reasons to reconsider the policy."*
- ✓ **Correct:** *"There **are** several compelling reasons to reconsider the policy."*`,
      },
      {
        title: "Common Pitfalls, Error Analysis & Exam Traps",
        sectionType: "common_errors",
        rationale: `Directly targets high-frequency examination errors and syntactic traps characteristic of ${curriculum} tests.`,
        content: `### Common Pitfalls & Examination Traps

In competitive and board examinations (${curriculum}), examiners frequently construct questions designed to exploit common cognitive shortcuts. Guard yourself against these recurring traps:

#### Trap 1: The "Proximity Illusion"
Students often instinctively match the verb to the noun physically closest to it, ignoring the true grammatical head.
- **Exam Question:** *"A detailed analysis of the experimental findings (indicate / indicates) a clear trend."*
- **Trap Analysis:** The word *findings* is plural and sits adjacent to the verb. However, the true subject is the singular noun **analysis**.
- **Correct Response:** **indicates**.

#### Trap 2: Plural-Formed Singular Nouns
Several academic fields, sports, and illnesses end in **-s** but are conceptually singular:
- *Physics, Mathematics, Linguistics, Economics, News, Measles, Billiards.*
- ✓ *"Economics **is** an essential component of modern social science."*

#### Trap 3: Units of Measurement, Time, and Currency
When a plural quantity denotes a single consolidated unit, it takes a singular verb:
- ✓ *"Ten kilometers **is** a manageable distance for endurance runners."*
- ✓ *"Two million dollars **was** allocated to the renovation project."*`,
      },
      {
        title: "Scaffolded Drills & Competency Exercises",
        sectionType: "exercises",
        rationale: `Provides graded exercises (Basic to Advanced) for formative assessment and self-evaluation.`,
        content: `### Practice Drills & Competency Exercises

#### Section A: Core Identification (Marks: 5)
*Choose the correct verb form from the options provided in brackets:*
1. The pride of lions [strolls / stroll] majestically across the savannah.
2. Neither the captain nor the sailors [was / were] prepared for the storm.
3. Every book in this specialized series [contains / contain] an indexed glossary.
4. Mathematics [has / have] always been her favorite academic discipline.
5. Bread and butter [is / are] served with every breakfast plate.

#### Section B: Error Spotting & Rectification (Marks: 5)
*Each sentence contains one grammatical error in concord. Identify the error and rewrite the sentence correctly:*
1. "The rhythm of the traditional drums echo through the mountain valley."
2. "Neither of the proposed solutions are viable in the current fiscal climate."
3. "The architect, accompanied by two structural engineers, have inspected the bridge."
4. "There is thirty active members enrolled in the debate society."
5. "A large flock of migratory birds were observed near the coastal wetland."

#### Section C: Sentence Synthesis & Advanced Application (Marks: 5)
*Combine or reconstruct the sentences as directed:*
1. Use the phrase *"as well as"* to combine: *The principal attended the assembly. The teachers also attended.*
2. Begin with *"Neither... nor"*: *The sound engineer did not notice the distortion. The vocalists did not notice it either.*`,
      },
      {
        title: "Chapter Revision, Summary & Key Takeaways",
        sectionType: "summary",
        rationale: `Offers concise, high-yield summary points and a self-check rubric for quick pre-exam revision.`,
        content: `### Chapter Summary & Rapid Revision

#### Quick Reference Checklist
- [ ] **Find the True Head:** Always isolate the head noun by mental bracket filtering of intervening prepositional phrases.
- [ ] **Coordinate 'And':** Plural by default, unless expressing a single unified concept or identical individual.
- [ ] **Nearer Subject (Proximity):** With *either/or* and *neither/nor*, match the verb to the conjunct closest to it.
- [ ] **Indefinite Pronouns:** *Each, every, either, neither* are grammatically singular in standard formal English.
- [ ] **Quantities as Units:** Measurements of distance, currency, time, and mass take singular verbs when viewed as a whole.

#### Pedagogical Reflection
Grammatical concord is the golden thread that binds sentences into coherent, persuasive thoughts. As you write essays, reports, and stories, make concord checking an integral step in your final revision pass.`,
      },
    ],
  };
}

export function generatePedagogicalHumanizedText(
  text: string,
  style: string,
  classLevel: string,
  board: string,
  chapterTitle: string
): string {
  if (!text || !text.trim()) {
    return text || "";
  }

  let polished = text;

  // 1. Remove blatant AI clichés
  const cliches: [RegExp, string][] = [
    [/\bdelve into\b/gi, "examine"],
    [/\bdelve\b/gi, "look closely at"],
    [/\bdive into\b/gi, "explore"],
    [/\bdive deep into\b/gi, "investigate"],
    [/\brich tapestry of\b/gi, "varied spectrum of"],
    [/\ba testament to\b/gi, "clear evidence of"],
    [/\bunlock the power of\b/gi, "master"],
    [/\bembark on a journey\b/gi, "begin"],
    [/\bfurthermore, it is crucial to remember that\b/gi, "Remember that"],
    [/\bit is important to note that\b/gi, "Notice that"],
    [/\bit is worth noting that\b/gi, "Importantly,"],
    [/\bin conclusion, it can be said that\b/gi, "In summary,"],
    [/\bnavigating the complexities of\b/gi, "understanding"],
  ];

  for (const [regex, replacement] of cliches) {
    polished = polished.replace(regex, replacement);
  }

  // 2. Ensure paragraph rhythm has variance
  const paragraphs = polished.split(/\n\n+/);
  const refined = paragraphs.map((p) => {
    const trimmed = p.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      return trimmed;
    }
    // Clean up repetitive sentence openers if any
    return trimmed.replace(/\bMoreover,\s*/gi, "In addition, ").replace(/\bFurthermore,\s*/gi, "Also, ");
  });

  return refined.join("\n\n");
}

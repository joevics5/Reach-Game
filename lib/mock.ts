// Demo replies used when ANTHROPIC_API_KEY is not set, so the whole game flow can be tried without a key.
type Turn = { role: "user" | "assistant"; content: string };

export function mockReply(turns: Turn[], isReview: boolean) {
  if (isReview) {
    return {
      outcome: "success",
      headline: "Demo review",
      summary: "This is a demo review. Add ANTHROPIC_API_KEY to get a real, hidden evaluation of how you did.",
      well: ["You started with something easy to answer"],
      improve: ["Ask a follow-up question about what they said"],
      moment: { quote: "", why: "Demo mode has no real moments to show.", kind: "best" },
      skills: { opening: "solid", listening: "solid", tone: "solid", signals: "solid", timing: "solid", respect: "strong", recovery: "n/a" },
      herView: "Demo mode.",
      tryNext: "Add an API key and play again.",
    };
  }
  const n = Math.max(1, turns.filter((t) => t.role === "user").length - 1);
  const lines = [
    ["Ha, no, it is free.", "They glance up from their drink and smile slightly."],
    ["Mostly just waiting on a friend. You?", "They turn a little toward you."],
    ["Okay, that is fair. Go on then.", "They laugh and relax their shoulders."],
  ];
  const [say, cue] = lines[Math.min(n - 1, lines.length - 1)];
  const won = n >= 4;
  return {
    say: won ? "Sure, give me your phone." : say,
    cue: won ? "They type their number into your phone." : cue,
    interest: Math.min(80, 45 + n * 9),
    comfort: Math.min(75, 52 + n * 6),
    patience: 70,
    tag: "other",
    quality: "good",
    note: "Demo mode",
    hint: "Ask about their evening.",
    end: won ? "won" : null,
  };
}

export default function StoryPage() {
  const COLORS = {
    primary: "#A27C48",
    accent: "#C74C4C"
  };
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl" style={{ color: COLORS.primary }}>Our Story</h1>

      <section className="mt-6 space-y-4 text-neutral-800">
        <p>We met in Tokyo, in a small underground club at dawn. The music was fading, the lights were low, and the city outside was just beginning to wake. That’s where I first spoke with Michiko.</p>
        <p>She was born in Japan, to Chinese parents — two tea lineages carried quietly in one life. From China: the mountains, the harvests, the leaves themselves. From Japan: the stillness, the presence, the way tea is not performed but felt.</p>
        <p>Later, in her apartment, she made tea the same way she moved through the world — gently. No ceremony for show. No perfect teaware layout. No polished presentation.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>leaves chosen by hand,</li>
          <li>water heated with attention rather than measurement,</li>
          <li>cups passed without hurry,</li>
          <li>and conversation that didn’t need to fill the silence.</li>
        </ul>
        <p>It felt like being welcomed, not served.</p>
        <p>Michiko already shared her teas in Japan, slowly, one person at a time. I asked if we could share them here — in Europe — without losing that warmth. Not as a brand. Not as a trend. But as a way to make space for a slower, more human rhythm again.</p>
      </section>

      <h2 className="mt-10 font-serif text-2xl" style={{ color: COLORS.accent }}>What we believe</h2>
      <section className="mt-4 space-y-4 text-neutral-800">
        <p>Real tea asks you to slow down enough to meet yourself again. To feel your own pace. To take one breath that isn’t rushed. These teas do not demand attention — they offer it back to you.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Whole leaves, not dust.</li>
          <li>Places and hands you can name, not factories.</li>
          <li>Flavors that open slowly, infusion by infusion.</li>
          <li>Nothing added. Time and water do the work.</li>
        </ul>
        <p>This is not something to consume quickly. It is something to return to — again and again.</p>
      </section>
    </main>
  );
}


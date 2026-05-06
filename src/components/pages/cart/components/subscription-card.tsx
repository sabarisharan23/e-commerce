export function SubscriptionCard() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#e5bd09] bg-[#f2c813] p-6 shadow-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full border-[12px] border-[#f4da73]/50"
      />
      <div className="relative">
        <h2 className="text-[1.9rem] font-semibold tracking-tight text-[#2c3b10]">
          Healthy Living Subscription
        </h2>
        <p className="mt-4 text-[1.05rem] font-medium leading-8 text-[#49524c]">
          Receive your favorite millet flours, health mixes, and drink mixes
          regularly with exclusive subscriber savings.
        </p>
        <button
          type="button"
          className="mt-5 text-[1.05rem] font-semibold text-[#335f1f]"
        >
          Join Now →
        </button>
      </div>
    </section>
  );
}

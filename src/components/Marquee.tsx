const words = [
  "Dry cleaning",
  "Laundry",
  "Steam pressing",
  "Bridal lehengas",
  "Sherwanis",
  "Curtains",
  "Carpets",
  "Sofa cleaning at home",
  "Sneakers",
  "Soft toys",
  "Silk sarees",
  "Blankets & quilts",
];

function Row({ hidden, reverse }: { hidden?: boolean; reverse?: boolean }) {
  const list = reverse ? [...words].reverse() : words;
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {list.map((w) => (
        <li key={w} className="flex items-center">
          <span className="display px-6 text-3xl whitespace-nowrap md:text-4xl">{w}</span>
          <span className="flex flex-col gap-1" aria-hidden="true">
            <span className="block h-1.5 w-8 -skew-x-12 bg-current opacity-60" />
            <span className="ml-1 block h-1.5 w-6 -skew-x-12 bg-current opacity-60" />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Two crossing ribbons of services, like tapes on a parcel. */
export function Marquee() {
  return (
    <div className="relative -my-6 h-40 overflow-hidden md:h-48">
      <div className="absolute top-1/2 -right-10 -left-10 -translate-y-1/2 rotate-[3deg] bg-purple py-4 text-white/90 shadow-lg">
        <div className="marquee [animation-direction:reverse] [animation-duration:36s]">
          <Row reverse />
          <Row reverse hidden />
        </div>
      </div>
      <div className="absolute top-1/2 -right-10 -left-10 -translate-y-1/2 -rotate-[2deg] bg-mint py-4 text-purple-deep shadow-[0_20px_40px_-20px_rgba(92,35,123,0.5)]">
        <div className="marquee">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}

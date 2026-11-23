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

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((w) => (
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
  return (
    <div className="overflow-hidden bg-mint py-4 text-purple-deep">
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

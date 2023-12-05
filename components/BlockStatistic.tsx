import { JSX } from "preact/jsx-runtime";

interface BlockStatisticProps {
  title: string;
  text: string;
  icon?: JSX.Element;
  direction?: "left" | "right";
}

export function BlockStatistic(
  { title, text, icon, direction = "left" }: BlockStatisticProps,
) {
  const directionClass = direction === "left"
    ? "flex-row"
    : "flex-row-reverse text-right";

  return (
    <section class={`flex items-center gap-3 ${directionClass}`}>
      {icon &&
        (
          <div class="aspect-square h-32">
            {icon}
          </div>
        )}
      <div class="flex-grow">
        <h1 class="text-5xl md:text-7xl font-bold">
          <span class="font-bold">
            {title}
          </span>
        </h1>
        <p class="text-xl md:text-3xl mt-4 ">
          {text}
        </p>
      </div>
    </section>
  );
}

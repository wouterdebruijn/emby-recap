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
    <section class={`flex items-center my-32 gap-8 ${directionClass}`}>
      {icon &&
        (
          <div>
            {icon}
          </div>
        )}
      <div class="flex-grow">
        <h1 class="text-7xl font-bold">
          <span class="font-bold">
            {title}
          </span>
        </h1>
        <p class="mt-4 text-3xl">
          {text}
        </p>
      </div>
    </section>
  );
}

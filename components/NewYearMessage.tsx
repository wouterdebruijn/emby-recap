export function NewYearMessage() {
  const now = new Date();

  let element = null;

  if (now.getMonth() === 11 && now.getDate() > 25) {
    element = <h1 class="text-6xl">Happy {now.getFullYear() + 1}!</h1>;
  }

  if (now.getMonth() === 0 && now.getDate() < 5) {
    element = <h1 class="text-6xl">Happy {now.getFullYear()}</h1>;
  }

  return (
    element &&
    (
      <section class="text-center font-thin pt-16">
        {element}
      </section>
    )
  );
}

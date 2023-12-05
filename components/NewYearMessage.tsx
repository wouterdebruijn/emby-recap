export function NewYearMessage() {
  const now = new Date();
  if (now.getMonth() === 11 && now.getDate() > 25) {
    return <h1 class="text-6xl">Happy {now.getFullYear() + 1}!</h1>;
  }
  if (now.getMonth() === 0 && now.getDate() < 5) {
    return <h1 class="text-6xl">Happy {now.getFullYear()}</h1>;
  }
  return <></>;
}

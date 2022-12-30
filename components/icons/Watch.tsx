import { JSX } from "preact";

export function Watch(
  { size = 16 }: JSX.HTMLAttributes<HTMLButtonElement> & { size?: number },
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      height={size}
      width={size}
      class="inline"
    >
      <path
        fill="#31373D"
        d="M25 32c0 2.209-1.791 4-4 4h-6c-2.209 0-4-1.791-4-4V4c0-2.209 1.791-4 4-4h6c2.209 0 4 1.791 4 4v28z"
      />
      <path
        fill="#99AAB5"
        d="M32 18c0-1.104-.896-2-2-2h-1c-1.104 0-2 .896-2 2s.896 2 2 2h1c1.104 0 2-.896 2-2z"
      />
      <path
        fill="#CCD6DD"
        d="M6 18c0-6.627 5.373-12 12-12 6.628 0 12 5.373 12 12s-5.372 12-12 12c-6.627 0-12-5.373-12-12z"
      />
      <path
        fill="#F5F8FA"
        d="M10 18c0-4.418 3.582-8 8-8 4.419 0 8 3.582 8 8s-3.581 8-8 8c-4.418 0-8-3.582-8-8z"
      />
      <path
        fill="#66757F"
        d="M23 22c-.175 0-.353-.046-.514-.143l-5-3c-.301-.18-.486-.505-.486-.857v-7c0-.552.448-1 1-1s1 .448 1 1v6.434l4.516 2.708c.474.284.627.898.343 1.372-.188.313-.519.486-.859.486z"
      />
    </svg>
  );
}

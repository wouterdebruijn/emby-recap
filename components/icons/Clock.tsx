import { JSX } from "preact";

export function Clock(
  { props, index }: JSX.HTMLAttributes<HTMLButtonElement> & {
    props: JSX.HTMLAttributes<SVGSVGElement>;
    index: number;
  },
) {
  if (index === 1) {
    return <Clock1 {...props} />;
  }
  if (index === 2) {
    return <Clock2 {...props} />;
  }
  return <Clock3 {...props} />;
}

function Clock1(
  props: JSX.HTMLAttributes<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      alt="Clock icon"
      {...props}
    >
      <circle fill="#99AAB5" cx="18" cy="18" r="18" />
      <circle fill="#E1E8ED" cx="18" cy="18" r="14" />
      <path
        fill="#66757F"
        d="M19 18c0 .553-.447 1-1 1-.552 0-1-.447-1-1V7c0-.552.448-1 1-1 .553 0 1 .448 1 1v11z"
      />
      <path
        fill="#66757F"
        d="M26.66 23c-.275.479-.887.643-1.365.367l-7.795-4.5c-.478-.276-.642-.889-.366-1.367s.887-.642 1.366-.365l7.795 4.5c.478.276.642.887.365 1.365z"
      />
    </svg>
  );
}

function Clock2(
  props: JSX.HTMLAttributes<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      class="inline"
      {...props}
    >
      <circle fill="#99AAB5" cx="18" cy="18" r="18" />
      <circle fill="#E1E8ED" cx="18" cy="18" r="14" />
      <path
        fill="#67757F"
        d="M18 19c-.552 0-1-.447-1-1V6c0-.552.448-1 1-1 .553 0 1 .448 1 1v12c0 .553-.447 1-1 1z"
      />
      <path
        fill="#67757F"
        d="M18.001 19c-.367 0-.72-.202-.896-.553l-4-8c-.247-.494-.047-1.095.447-1.342.496-.248 1.095-.046 1.342.447l4 8c.247.494.047 1.095-.447 1.342-.143.072-.296.106-.446.106z"
      />
    </svg>
  );
}

function Clock3(
  props: JSX.HTMLAttributes<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      class="inline"
      {...props}
    >
      <circle fill="#99AAB5" cx="18" cy="18" r="18" />
      <circle fill="#E1E8ED" cx="18" cy="18" r="14" />
      <path
        fill="#66757F"
        d="M19 18c0 .553-.447 1-1 1-.552 0-1-.447-1-1V7c0-.552.448-1 1-1 .553 0 1 .448 1 1v11z"
      />
      <path
        fill="#66757F"
        d="M26.661 13c.276.479.112 1.09-.366 1.366l-7.795 4.5c-.478.276-1.089.112-1.365-.366s-.112-1.09.365-1.366l7.795-4.5c.478-.276 1.09-.112 1.366.366z"
      />
    </svg>
  );
}

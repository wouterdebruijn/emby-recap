import { minidenticon } from "minidenticons";

export function Minidenticon(
  { name, ...props }: { name: string } & JSX.HTMLAttributes<HTMLImageElement>,
) {
  const svgURI = "data:image/svg+xml;utf8," +
    encodeURIComponent(minidenticon(name));

  return (
    <img
      src={svgURI}
      alt="Profile Picture"
      {...props}
    />
  );
}

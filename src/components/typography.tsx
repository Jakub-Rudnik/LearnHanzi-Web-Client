import type { ReactNode } from "react";

export function TypographyH1({ children }: { children: ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  );
}

export function TypographyH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function TypographyH4({ children }: { children: ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function TypographyP({ children }: { children: ReactNode }) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function TypographyBlockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

export function TypographyTable({
  headers,
  content,
}: {
  headers: ReactNode[];
  content: ReactNode[][];
}) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            {headers.map((header, i) => (
              <th
                key={i}
                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((row, i) => (
            <tr key={i} className="m-0 border-t p-0 even:bg-muted">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TypographyList({ elements }: { elements: string[] }) {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      {elements.map((element, index) => (
        <li key={index}>{element}</li>
      ))}
    </ul>
  );
}

export function TypographyInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}

export function TypographyLead({ children }: { children: ReactNode }) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}

export function TypographyLarge({ children }: { children: ReactNode }) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function TypographySmall({ children }: { children: ReactNode }) {
  return <small className="text-sm leading-none font-medium">{children}</small>;
}

export function TypographyMuted({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

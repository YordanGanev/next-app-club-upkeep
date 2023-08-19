"use client";

import { useRouter } from "next/navigation";
import { forwardRef } from "react";

/*
Bug fix for client side caching and revalidation of page

for future reference if this gets fixed in next versions
use in /app/dashboard/layout.tsx: 

```
export const revalidate = 0;
```

*/

// eslint-disable-next-line react/display-name
const DynamicLink = forwardRef<
  HTMLAnchorElement,
  Omit<React.HTMLProps<HTMLAnchorElement>, "ref">
>(({ href, children, ...props }, ref) => {
  const router = useRouter();

  return (
    <a
      {...props}
      ref={ref}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        router.push(href as string);
        router.refresh();
      }}
    >
      {children}
    </a>
  );
});

export default DynamicLink;

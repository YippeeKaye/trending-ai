import { Button } from "@/components/ui/button"

type ButtonLinkProps = {
    href: string;
    name: string;
  };

  
export function ButtonLink({href, name}: ButtonLinkProps) {
  return (
    <Button variant="link" onClick={() => window.open(href, '_blank')}>
      {name}
    </Button>
  );
}

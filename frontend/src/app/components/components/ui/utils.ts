export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ") as string;
}

export default cn;

export function cn(...classes: any[]): string {
  if (!classes.length) return "";
  
  return classes
    .reduce((result, item) => {
      if (!item) return result;
      
      if (typeof item === "string") {
        return result + (result ? " " : "") + item;
      }
      
      if (typeof item === "object" && Array.isArray(item)) {
        return result + (result ? " " : "") + cn(...item);
      }
      
      if (typeof item === "object" && !Array.isArray(item)) {
        return (
          result +
          (result ? " " : "") +
          Object.keys(item)
            .filter((key) => item[key])
            .join(" ")
        );
      }
      
      return result;
    }, "");
}

export default cn;

export function validateImdbId(id: string): boolean {
  const regex = /^tt\d+$/;
  return regex.test(id);
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getSentimentColor(classification: string): string {
  switch (classification) {
    case "Positive":
      return "text-green-500 bg-green-500/10 border-green-500/30";
    case "Mixed":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
    case "Negative":
      return "text-red-500 bg-red-500/10 border-red-500/30";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/30";
  }
}

export function getSentimentBgColor(classification: string): string {
  switch (classification) {
    case "Positive":
      return "from-green-500/20 to-transparent";
    case "Mixed":
      return "from-yellow-500/20 to-transparent";
    case "Negative":
      return "from-red-500/20 to-transparent";
    default:
      return "from-gray-500/20 to-transparent";
  }
}

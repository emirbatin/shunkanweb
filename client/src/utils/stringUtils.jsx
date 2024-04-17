export function capitalizeFirstLetter(string) {
  if (!string) return string; // veya "Unknown" gibi bir placeholder döndürebilirsiniz.
  return string.charAt(0).toUpperCase() + string.slice(1);
}

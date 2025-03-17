export function convertBytesToDisplay(bytes: number, unitIndex = 0) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  if (bytes < 1024 || unitIndex === units.length - 1) {
    return `${bytes.toFixed(2)}${units[unitIndex]}`;
  }
  return convertBytesToDisplay(bytes / 1024, unitIndex + 1);
}

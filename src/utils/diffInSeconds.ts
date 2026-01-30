function diffInSeconds(date1: Date, date2: Date): number {
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
  const diffInSeconds = diffInMilliseconds / 1000;
  return diffInSeconds;
}

export { diffInSeconds };

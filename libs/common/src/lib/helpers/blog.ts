export const getReadingTime = (text: string) => {
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  console.log('readingTime: ', time);
  return time;
};

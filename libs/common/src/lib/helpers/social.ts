export const generateTwitterLink = (
  text: string,
  url: string,
  hashtags: string[]
) => {
  const hashtagString = hashtags?.join(',') || '';
  return `https://twitter.com/share?text=${text}&url=${url}&hashtags=${hashtagString}`;
};

export const generateFacebookLink = (url: string) => {
  return `https://www.facebook.com/share.php?u=${url}`;
};

export const generateLinkedInLink = (url: string) => {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
};

import { useCopyToClipboard } from 'usehooks-ts';

export const useClipboard = () => {
  const clipboard = useCopyToClipboard();
  return clipboard;
};

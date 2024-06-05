export const uniqueArray = (arr: string[]) => {
  return [...new Set(arr)];
};
function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object';
}

export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (!isObject(obj1) || !isObject(obj2)) {
    return false;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export const fileType = (fileName: string) => {
  return (
    fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) ||
    fileName
  );
};

export const camalise = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_m: string, chr: string) =>
      chr.toUpperCase()
    );
};

export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

// https://skribbl.io/?u44qMeq85gl2=

export const skribblioID = (link: string): { isValid: boolean; id: string } => {
  const test = /^https?:\/\/skribbl.io\/\?(.*)$/gi;
  const match = test.exec(link.trim());
  if (!match) return { isValid: false, id: '' };
  const [, group] = match;
  return { isValid: true, id: group };
};

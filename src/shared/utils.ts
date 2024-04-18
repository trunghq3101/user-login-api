export const mockDateOrigin = new Date('2021-01-01T00:00:00Z');

export const minutesLater = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

export const minutesAgo = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() - minutes * 60 * 1000);
};

export const minutesAgoFromNow = (mins: number) => minutesAgo(new Date(), mins);

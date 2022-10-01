export const formatTime = (time: number, mode: string = 'default') => {
  const presicionTime = time;
  time = time / 1000;

  if (mode === 'presicion') return presicionTime + 'ms';

  if (time < 7 * 24 * 60 * 60) {
    const temp = time / (24 * 60 * 60);
    return temp.toFixed(0) + 'd';
  }
  if (time < 24 * 60 * 60) {
    const temp = time / (60 * 60);
    return temp.toFixed(0) + (temp > 1 ? 'hrs' : 'hr');
  }
  if (time < 60 * 60) {
    const temp = time / 60;
    return temp.toFixed(0) + 'm';
  }
  if (time < 60) return time.toFixed(0) + 's';

  return time;
};

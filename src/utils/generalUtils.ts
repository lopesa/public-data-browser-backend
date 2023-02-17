export const diff_hours = (dt2: number, dt1: number) => {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

export function formatDate(timestamp: number) {
  const today = new Date(timestamp);
  const yyyy = today.getFullYear();
  let mm: any = today.getMonth() + 1;
  let dd: any = today.getDate();

  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${mm}/${dd}/${yyyy} `;
}

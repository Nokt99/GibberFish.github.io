function getCurrentPeriodKey(date) {
  const now = date || new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return year + "_" + (month < 10 ? "0" + month : month);
}

module.exports = {
  getCurrentPeriodKey
};

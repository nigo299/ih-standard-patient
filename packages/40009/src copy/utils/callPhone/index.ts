export default (phoneNumber: string) => {
  window.location.href = `tel:${phoneNumber}`;
};

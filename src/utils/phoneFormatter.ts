export const formatUzbekPhone = (input: string): string => {
  let digits = input.replace(/\D/g, '');
  
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  } else if (digits.length <= 3 && '998'.startsWith(digits)) {
    digits = '';
  }
  
  // Maximum 9 digits after +998
  digits = digits.slice(0, 9);
  
  if (digits.length === 0) {
    return '+998 ';
  }
  
  let formatted = '+998 ' + digits.slice(0, 2);
  if (digits.length > 2) {
    formatted += ' ' + digits.slice(2, 5);
  }
  if (digits.length > 5) {
    formatted += '-' + digits.slice(5, 7);
  }
  if (digits.length > 7) {
    formatted += '-' + digits.slice(7, 9);
  }
  
  return formatted;
};

export const getPhoneDigitsCount = (phone: string): number => {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }
  return Math.min(digits.length, 9);
};

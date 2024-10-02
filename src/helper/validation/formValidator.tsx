export const validateEmail = (data: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(data);
  };
  export const validatePassword = (data: string) => {
    return data.length >= 8;
  };
  export const validateField = (data: string) => {
    return data.trim() !== "";
  };
  export const validateName = (data: string) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(data.trim()) && data.trim().length > 0;
  };
  export const validateDate = (date: string) => {
    const inputDate = new Date(date);
    const today = new Date();
  
    // Reset the time part of the dates for accurate comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
  
    return inputDate >= today;
  };
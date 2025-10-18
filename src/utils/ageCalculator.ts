export function calculateAge(birthDate: string): { years: number; months: number; days: number } {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

export function formatAge(birthDate: string): string {
  const { years, months, days } = calculateAge(birthDate);
  
  if (years > 0) {
    return months > 0 
      ? `${years} ano${years > 1 ? 's' : ''} e ${months} ${months > 1 ? 'meses' : 'mês'}`
      : `${years} ano${years > 1 ? 's' : ''}`;
  }
  
  if (months > 0) {
    return days > 0
      ? `${months} ${months > 1 ? 'meses' : 'mês'} e ${days} ${days > 1 ? 'dias' : 'dia'}`
      : `${months} ${months > 1 ? 'meses' : 'mês'}`;
  }
  
  return `${days} ${days > 1 ? 'dias' : 'dia'}`;
}

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

export function getRatCategory(rat: any): string {
  // Ratos falecidos
  if (rat.status === "Falecido") {
    return "RIP";
  }
  
  // Ratos aposentados
  if (rat.status === "Aposentado") {
    if (rat.sex === "Fêmea") {
      return "Matrizes Aposentadas";
    } else {
      return "Padreadores Aposentados";
    }
  }
  
  // Ratos vendidos ou doados
  if (rat.destination === "Vendido") {
    return "Vendidos";
  }
  if (rat.destination === "Doado") {
    return "Doados";
  }
  
  // Ratos para fora da criação (à venda, para adoção)
  if (rat.destination === "À venda" || rat.destination === "Para adoção") {
    return "Para Fora da Criação";
  }
  
  // Padreadores ativos
  if (rat.destination === "Padreador") {
    return "Padreadores";
  }
  
  // Matrizes ativas
  if (rat.destination === "Matriz") {
    return "Matrizes";
  }
  
  // Filhotes (até 4 meses)
  const age = calculateAge(rat.dateOfBirth);
  const totalMonths = age.years * 12 + age.months;
  
  if (totalMonths <= 4) {
    return rat.sex === "Macho" ? "Filhotes Machos" : "Filhotes Fêmeas";
  }
  
  // Outros ratos (mais de 4 meses)
  return rat.sex === "Macho" ? "Outros Machos" : "Outras Fêmeas";
}
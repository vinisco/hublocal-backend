function digit(numbers: string): number {
  let index = 2;

  const sum = [...numbers].reverse().reduce((buffer, number) => {
    buffer += Number(number) * index;
    index = index === 9 ? 2 : index + 1;
    return buffer;
  }, 0);

  const mod = sum % 11;

  return mod < 2 ? 0 : 11 - mod;
}

export function validate(cnpj: string | number): boolean {
  const cleaned = cnpj.toString().replace(/[\.\/\-]/g, '');

  if (!cleaned || cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  let registration = cleaned.substring(0, 12);
  registration += digit(registration);
  registration += digit(registration);

  return registration.slice(-2) === cleaned.slice(-2);
}

export function format(cnpj: string | number): string {
  return cnpj
    .toString()
    .replace(/[^\d]/g, '')
    .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function generate(): string {
  let cnpj = '';
  let i = 12;

  while (i--) {
    cnpj += Math.floor(Math.random() * 9);
  }

  cnpj += digit(cnpj);
  cnpj += digit(cnpj);

  return format(cnpj);
}

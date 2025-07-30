
const uf = [
  { id: '12', sigla: 'AC', regiao: 'Norte' },
  { id: '27', sigla: 'AL', regiao: 'Nordeste' },
  { id: '13', sigla: 'AM', regiao: 'Norte' },
  { id: '16', sigla: 'AP', regiao: 'Norte' },
  { id: '29', sigla: 'BA', regiao: 'Nordeste' },
  { id: '23', sigla: 'CE', regiao: 'Nordeste' },
  { id: '53', sigla: 'DF', regiao: 'Centro-Oeste' },
  { id: '32', sigla: 'ES', regiao: 'Sudeste' },
  { id: '52', sigla: 'GO', regiao: 'Centro-Oeste' },
  { id: '21', sigla: 'MA', regiao: 'Nordeste' },
  { id: '31', sigla: 'MG', regiao: 'Sudeste' },
  { id: '50', sigla: 'MS', regiao: 'Centro-Oeste' },
  { id: '51', sigla: 'MT', regiao: 'Centro-Oeste' },
  { id: '15', sigla: 'PA', regiao: 'Norte' },
  { id: '25', sigla: 'PB', regiao: 'Nordeste' },
  { id: '26', sigla: 'PE', regiao: 'Nordeste' },
  { id: '22', sigla: 'PI', regiao: 'Nordeste' },
  { id: '41', sigla: 'PR', regiao: 'Sul' },
  { id: '33', sigla: 'RJ', regiao: 'Sudeste' },
  { id: '24', sigla: 'RN', regiao: 'Nordeste' },
  { id: '43', sigla: 'RS', regiao: 'Sul' },
  { id: '11', sigla: 'RO', regiao: 'Norte' },
  { id: '14', sigla: 'RR', regiao: 'Norte' },
  { id: '42', sigla: 'SC', regiao: 'Sul' },
  { id: '28', sigla: 'SE', regiao: 'Nordeste' },
  { id: '35', sigla: 'SP', regiao: 'Sudeste' },
  { id: '17', sigla: 'TO', regiao: 'Norte' }
].sort((a, b) => a.sigla.localeCompare(b.sigla));

export const picklist = {
  uf,
}

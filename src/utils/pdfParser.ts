import pdfParse from 'pdf-parse'

// function normalizeNumber(number: string) {
//   const numberWithDot = number.replace(',', '.')
//   return numberWithDot
// }

function normalizeNumber(inputString: string) {
  // Remove periods
  const cleanedString = inputString.replace(/\./g, '')

  // Replace comma with dot
  const normalizedNumber = parseFloat(cleanedString.replace(',', '.'))

  return normalizedNumber
}

export interface ClientData {
  clientNumber: string
  monthYear: string
  date: string
  amount: number
  eletricEnergy: {
    kwh: string
    tarif: string
    value: string
  }
  energySCEEE: {
    kwh: string
    tarif: string
    value: string
  }
  energyCompensation: {
    kwh: string
    tarif: string
    value: string
  }
  iluminationTax: {
    value: string
  }
}

export function parsePDF(buffer: Buffer) {
  const clientData = pdfParse(buffer)
    .then(function (data) {
      const text = data.text
      const numberPattern = /^-?[\d,.]+$/

      const arrayLines = text.split('\n')
      const clientData: ClientData = {
        clientNumber: '0',
        monthYear: '0',
        date: '0',
        amount: 0,
        eletricEnergy: {
          kwh: '0',
          tarif: '0',
          value: '0',
        },
        energySCEEE: {
          kwh: '0',
          tarif: '0',
          value: '0',
        },
        energyCompensation: {
          kwh: '0',
          tarif: '0',
          value: '0',
        },
        iluminationTax: {
          value: '0',
        },
      }

      arrayLines.forEach((line, index) => {
        if (line.includes('Nº DO CLIENTE')) {
          const clientNumberLine = arrayLines[index + 1]
          const numbers = clientNumberLine.match(/\d+/g)
          if (numbers && numbers.length > 0) {
            const clientNumber = numbers[0]
            clientData.clientNumber = clientNumber
          } else {
            console.log('Client Number not found.')
          }
        }

        if (line.includes('Referente a')) {
          const referenceData = arrayLines[index + 1].split('     ')

          const filteredData = referenceData
            .map((item) => item.trim())
            .filter((item) => item !== '')

          // Regex patterns for detection
          const monthYearPattern = /^[A-Z]{3}\/\d{4}$/ // e.g., JAN/2023
          const datePattern = /^\d{2}\/\d{2}\/\d{4}$/ // e.g., 11/02/2023
          const numericPattern = /^\d{1,3}(\.\d{3})*(,\d{2})?$/ // e.g., 508,76

          filteredData.forEach((item) => {
            if (monthYearPattern.test(item)) {
              clientData.monthYear = item
            } else if (datePattern.test(item)) {
              clientData.date = item
            } else if (numericPattern.test(item)) {
              clientData.amount = normalizeNumber(item)
            }
          })
        }

        if (line.includes('Energia ElétricakWh')) {
          const rawdata = line.split(' ')
          // const numberPattern = /^[\d,.]+$/;
          const numbersOnly = rawdata
            .filter((element) => numberPattern.test(element))
            .map((item) => item.replace(',', '.'))
          clientData.eletricEnergy.kwh = numbersOnly[0]
          clientData.eletricEnergy.tarif = numbersOnly[1]
          clientData.eletricEnergy.value = numbersOnly[2]
        }

        if (line.includes('Energia SCEE')) {
          const rawdata = line.split(' ')
          // const numberPattern = /^[\d,.]+$/;
          const numbersOnly = rawdata
            .filter((element) => numberPattern.test(element))
            .map((item) => item.replace(',', '.'))
          clientData.energySCEEE.kwh = numbersOnly[0]
          clientData.energySCEEE.tarif = numbersOnly[1]
          clientData.energySCEEE.value = numbersOnly[2]
        }

        if (line.includes('Energia compensada GD')) {
          const rawdata = line.split(' ')
          // const numberPattern = /^-?[\d,.]+$/;
          const numbersOnly = rawdata
            .filter((element) => numberPattern.test(element))
            .map((item) => item.replace(',', '.'))
          clientData.energyCompensation.kwh = numbersOnly[0]
          clientData.energyCompensation.tarif = numbersOnly[1]
          clientData.energyCompensation.value = numbersOnly[2]
        }

        if (line.includes('Contrib Ilum Publica Municipal')) {
          const rawdata = line.split(' ')
          // const numberPattern = /^[\d,.]+$/;
          const numbersOnly = rawdata
            .filter((element) => numberPattern.test(element))
            .map((item) => item.replace(',', '.'))
          clientData.iluminationTax.value = numbersOnly[0]
        }
      })
      console.log('Client Data:', clientData)
      return clientData
    })
    .catch(function (error) {
      console.error('Error parsing PDF:', error)
    })

  return clientData
}

const SIZE_STRINGS = [
  "B",
  "KB",
  "MB",
  "GB"
]

export const createSizeString = (fileSize: number) => {

  let removed = 0;
  while (fileSize >= 10) {
    removed++;
    fileSize = fileSize / 10
  }

  const beforeDecimal = removed % 3;
  const unitScale = Math.floor(removed / 3)
  let afterDecimal = 2 - beforeDecimal

  // as a personal preference, if we didn't even go up a unit scale just don't have anything after decimal
  // This just means 1 byte is formated as 1 B instead of 1.00 B
  if (unitScale < 1) {
    afterDecimal = 0
  }

  fileSize = fileSize * (10 ** beforeDecimal)

  const unit = SIZE_STRINGS[unitScale]
  const numberString = fileSize.toFixed(afterDecimal)

  return `${numberString} ${unit}`


}

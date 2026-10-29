// Split letters are separate boxes, so the font's pair kerning is lost.
// Measure each pair with the same font and put the difference back as margin.

const MEASURE_SIZE = 100;

export async function restoreKerning(word) {
  const letters = [...word.children];
  const style = getComputedStyle(word);
  const font = `${style.fontWeight} ${MEASURE_SIZE}px ${style.fontFamily}`;
  await document.fonts.load(font, word.textContent);

  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = font;
  const width = (text) => ctx.measureText(text).width;

  letters.slice(1).forEach((letter, index) => {
    const before = letters[index].textContent;
    const pair = width(before + letter.textContent) - width(before) - width(letter.textContent);
    letter.style.marginInlineStart = `${pair / MEASURE_SIZE}em`;
  });
}

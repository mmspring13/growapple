import colors from 'tailwindcss/colors';

/**
 * Returns a random hex/color value from a random Tailwind palette.
 */
const getRandomTailwindColor = (): string => {
  // 1. Get all keys that are objects (palettes like 'red', 'blue', etc.)
  const paletteNames = Object.keys(colors).filter(
    (name) => typeof colors[name] === 'object' && colors[name] !== null
  );

  // 2. Select a random palette
  const randomPalette = colors[paletteNames[Math.floor(Math.random() * paletteNames.length)]];

  // 3. Select a random shade from that palette
  const shades = Object.values(randomPalette) as string[];
  return shades[Math.floor(Math.random() * shades.length)] || '';
};

export default getRandomTailwindColor;

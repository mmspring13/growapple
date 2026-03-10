import colors from 'tailwindcss/colors';

const getRandomTailwindColor = (): string => {
  const paletteNames = Object.keys(colors).filter(
    (name) => typeof colors[name] === 'object' && colors[name] !== null
  );
  colors.red["50"] = '#54dba7';
  const randomPalette = colors[paletteNames[Math.floor(Math.random() * paletteNames.length)]];

  const shades = Object.values(randomPalette) as string[];
  return shades[Math.floor(Math.random() * shades.length)] || '';
};

export default getRandomTailwindColor;

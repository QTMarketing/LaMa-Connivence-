export type DrinkPromoRate = {
  quantity: number;
  total: number;
  display: string;
};

export type DrinkPromo = {
  id: string;
  brand: string;
  name: string;
  rate: DrinkPromoRate;
  remarks?: string;
};

// Parse "2F5.50" -> { quantity: 2, total: 5.5, display: "2 for $5.50" }
function parseRate(raw: string): DrinkPromoRate {
  const match = raw.match(/^(\d+)F(\d+(?:\.\d+)?)$/i);
  if (!match) {
    const total = Number(raw) || 0;
    return {
      quantity: 1,
      total,
      display: total ? `$${total.toFixed(2)}` : raw,
    };
  }

  const quantity = Number(match[1]);
  const total = Number(match[2]);

  return {
    quantity,
    total,
    display: `${quantity} for $${total.toFixed(2)}`,
  };
}

// Infer a brand name from the raw promotion string
function inferBrand(promoName: string): string {
  const upper = promoName.toUpperCase();

  if (upper.includes('MONSTER')) return 'Monster';
  if (upper.includes('RED BULL')) return 'Red Bull';
  if (upper.includes('CELSIUS')) return 'Celsius';
  if (upper.includes('GHOST')) return 'Ghost';
  if (upper.includes('C4')) return 'C4';
  if (upper.includes('ALANI')) return 'Alani Nu';
  if (upper.includes('BANG') || upper.includes('REIGN')) return 'Bang & Reign';
  if (upper.includes('BODY ARMOR') || upper.includes('BODYARMOR')) return 'BodyArmor';
  if (upper.includes('GATORADE')) return 'Gatorade';
  if (upper.includes('GATORLYTE')) return 'Gatorlyte';
  if (upper.includes('PEPSI')) return 'Pepsi';
  if (upper.includes('COKE')) return 'Coke';
  if (upper.includes('ROCKSTAR')) return 'Rockstar';
  if (upper.includes('STARBUCKS')) return 'Starbucks';
  if (upper.includes('POWERADE')) return 'Powerade';
  if (upper.includes('SMARTWATER')) return 'Smartwater';
  if (upper.includes('VITAMIN')) return 'Vitamin Water';

  return 'Other';
}

export const drinkPromos: DrinkPromo[] = [
  {
    id: 'alani-nu-energy-12oz-2f5',
    brand: inferBrand('ALANI NU ENERGY 12OZ'),
    name: 'ALANI NU ENERGY 12OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'bang-reign-16oz-2f550',
    brand: inferBrand('BANG & REIGN 16OZ'),
    name: 'BANG & REIGN 16OZ',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'body-armor-1-5l-water-2f6',
    brand: inferBrand('BODY ARMOR 1.5L WATER'),
    name: 'BODY ARMOR 1.5L WATER',
    rate: parseRate('2F6'),
  },
  {
    id: 'body-armor-16oz-2f450',
    brand: inferBrand('BODY ARMOR 16OZ'),
    name: 'BODY ARMOR 16OZ',
    rate: parseRate('2F4.50'),
  },
  {
    id: 'body-armor-1l-2f5',
    brand: inferBrand('BODY ARMOR 1LTR'),
    name: 'BODY ARMOR 1LTR',
    rate: parseRate('2F5'),
  },
  {
    id: 'bodyarmor-28oz-2f6',
    brand: inferBrand('BODYARMOR 28OZ'),
    name: 'BODYARMOR 28OZ',
    rate: parseRate('2F6'),
  },
  {
    id: 'bodyarmor-flash-iv-20oz-2f6',
    brand: inferBrand('BODYARMOR FLASH I.V. 20OZ'),
    name: 'BODYARMOR FLASH I.V. 20OZ',
    rate: parseRate('2F6'),
  },
  {
    id: 'bodyarmor-sportwater-700ml-2f4',
    brand: inferBrand('BODYARMOR SPORTWATER 700ML'),
    name: 'BODYARMOR SPORTWATER 700ML',
    rate: parseRate('2F4'),
  },
  {
    id: 'celsius-12oz-2f5',
    brand: inferBrand('CELSIUS 12OZ'),
    name: 'CELSIUS 12OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'celsius-essentials-16oz-2f6',
    brand: inferBrand('CELSIUS ESSENTIALS 16OZ'),
    name: 'CELSIUS ESSENTIALS 16OZ',
    rate: parseRate('2F6'),
  },
  {
    id: 'coke-16oz-cans-2f350',
    brand: inferBrand('COKE 16OZ CANS'),
    name: 'COKE 16OZ CANS',
    rate: parseRate('2F3.50'),
  },
  {
    id: 'core-water-30-40oz-2f4',
    brand: inferBrand('CORE WATER 30.40OZ'),
    name: 'CORE WATER 30.40OZ',
    rate: parseRate('2F4'),
  },
  {
    id: 'dasani-16-9oz-24pk-2f10',
    brand: inferBrand('DASANI 16.9OZ 24 PACK'),
    name: 'DASANI 16.9OZ 24 PACK',
    rate: parseRate('2F10'),
  },
  {
    id: 'electrolit-21oz-2f6',
    brand: inferBrand('ELECTROLIT 21OZ'),
    name: 'ELECTROLIT 21OZ',
    rate: parseRate('2F6'),
  },
  {
    id: 'gatorade-28oz-2f5',
    brand: inferBrand('GATORADE 28OZ'),
    name: 'GATORADE 28OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'gatorade-28oz-2f550',
    brand: inferBrand('GATORADE 28OZ'),
    name: 'GATORADE 28OZ',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'gatorade-28oz-3f6',
    brand: inferBrand('GATORADE 28OZ'),
    name: 'GATORADE 28OZ',
    rate: parseRate('3F6'),
  },
  {
    id: 'gatorlyte-20oz-2f5',
    brand: inferBrand('GATORLYTE 20OZ'),
    name: 'GATORLYTE 20OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'gatorlyte-20oz-2f550',
    brand: inferBrand('GATORLYTE 20OZ'),
    name: 'GATORLYTE 20OZ',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'ghost-energy-16oz-2f550',
    brand: inferBrand('GHOST ENERGY 16OZ'),
    name: 'GHOST ENERGY 16OZ',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'java-monster-15oz-2f6',
    brand: inferBrand('JAVA MONSTER 15OZ'),
    name: 'JAVA MONSTER 15OZ',
    rate: parseRate('2F6'),
  },
  {
    id: 'kdp-20oz-core-2f450',
    brand: inferBrand('KDP 20OZ CORE'),
    name: 'KDP 20OZ CORE',
    rate: parseRate('2F4.50'),
  },
  {
    id: 'kdp-20oz-core-2f5',
    brand: inferBrand('KDP 20OZ CORE'),
    name: 'KDP 20OZ CORE',
    rate: parseRate('2F5'),
  },
  {
    id: 'kdp-c4-performance-16oz-2f550',
    brand: inferBrand('KDP C4 PERFORMANCE 16OZ'),
    name: 'KDP C4 PERFORMANCE 16OZ',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'kdp-deja-blue-20oz-2f2',
    brand: inferBrand('KDP DEJA BLUE 200Z'),
    name: 'KDP DEJA BLUE 200Z',
    rate: parseRate('2F2'),
  },
  {
    id: 'kdp-snapple-16oz-2f3',
    brand: inferBrand('KDP SNAPPLE 16OZ'),
    name: 'KDP SNAPPLE 16OZ',
    rate: parseRate('2F3'),
  },
  {
    id: 'kdp-venom-16oz-2f222',
    brand: inferBrand('KDP VENOM 16OZ CANS'),
    name: 'KDP VENOM 16OZ CANS',
    rate: parseRate('2F2.22'),
  },
  {
    id: 'lipton-brisk-1l-2f350',
    brand: inferBrand('LIPTON BRISK 1LTR'),
    name: 'LIPTON BRISK 1LTR',
    rate: parseRate('2F3.50'),
  },
  {
    id: 'md-kickstart-12-16oz-2f350',
    brand: inferBrand('MD KICKSTART 12/16OZ'),
    name: 'MD KICKSTART 12/16OZ',
    rate: parseRate('2F3.50'),
  },
  {
    id: 'monster-energy-nos-ft-16oz-2f550',
    brand: inferBrand('MONSTER ENERGY, NOS, FT 16/15.5OZ CN'),
    name: 'MONSTER ENERGY, NOS, FT 16/15.5OZ CN',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'naked-15-2oz-2f6',
    brand: inferBrand('NAKED 15.2 OZ'),
    name: 'NAKED 15.2 OZ',
    rate: parseRate('2F6'),
  },
  {
    id: 'naked-15-2oz-2f7',
    brand: inferBrand('NAKED 15.2 OZ'),
    name: 'NAKED 15.2 OZ',
    rate: parseRate('2F7'),
  },
  {
    id: 'penafiel-600ml-2f3',
    brand: inferBrand('PENAFIEL 600ML 2F3'),
    name: 'PENAFIEL 600ML 2F3',
    rate: parseRate('2F3'),
  },
  {
    id: 'pepsi-12pk-cn-2f16',
    brand: inferBrand('PEPSI 12 PK CN'),
    name: 'PEPSI 12 PK CN',
    rate: parseRate('2F16'),
  },
  {
    id: 'pepsi-16oz-cn-2f350',
    brand: inferBrand('PEPSI 16OZ CN'),
    name: 'PEPSI 16OZ CN',
    rate: parseRate('2F3.50'),
  },
  {
    id: 'pepsi-1l-2f550',
    brand: inferBrand('PEPSI 1LTR'),
    name: 'PEPSI 1LTR',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'pepsi-20oz-core-2f4',
    brand: inferBrand('PEPSI 20OZ CORE'),
    name: 'PEPSI 20OZ CORE',
    rate: parseRate('2F4'),
  },
  {
    id: 'pepsi-20oz-core-2f450',
    brand: inferBrand('PEPSI 20OZ CORE'),
    name: 'PEPSI 20OZ CORE',
    rate: parseRate('2F4.50'),
  },
  {
    id: 'pepsi-20oz-flavors-2f333',
    brand: inferBrand('PEPSI 20OZ FLAVORS'),
    name: 'PEPSI 20OZ FLAVORS',
    rate: parseRate('2F3.33'),
  },
  {
    id: 'pepsi-20oz-flavors-2f4',
    brand: inferBrand('PEPSI 20OZ FLAVORS'),
    name: 'PEPSI 20OZ FLAVORS',
    rate: parseRate('2F4'),
  },
  {
    id: 'pepsi-2l-2f6',
    brand: inferBrand('PEPSI 2LTR'),
    name: 'PEPSI 2LTR',
    rate: parseRate('2F6'),
  },
  {
    id: 'poppi-12oz-2f450',
    brand: inferBrand('POPPI 12OZ'),
    name: 'POPPI 12OZ',
    rate: parseRate('2F4.50'),
  },
  {
    id: 'poppi-12oz-2f5',
    brand: inferBrand('POPPI 12OZ'),
    name: 'POPPI 12OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'powerade-28oz-2f4',
    brand: inferBrand('POWERADE 28OZ'),
    name: 'POWERADE 28OZ',
    rate: parseRate('2F4'),
  },
  {
    id: 'red-bull-12oz-2f6',
    brand: inferBrand('RED BULL 12OZ'),
    name: 'RED BULL 12OZ',
    rate: parseRate('2F6'),
  },
  {
    id: 'red-bull-8-4oz-2f5',
    brand: inferBrand('RED BULL 8.4OZ'),
    name: 'RED BULL 8.4OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'reign-total-body-fuel-12oz-3f6',
    brand: inferBrand('REIGN TOTAL BODY FULE 12OZ'),
    name: 'REIGN TOTAL BODY FULE 12OZ',
    rate: parseRate('3F6'),
  },
  {
    id: 'reign-total-body-fuel-16oz-2f550',
    brand: inferBrand('REIGN TOTAL BODY FULE 16OZ'),
    name: 'REIGN TOTAL BODY FULE 16OZ',
    rate: parseRate('2F5.50'),
  },
  {
    id: 'rockstar-12oz-2f4',
    brand: inferBrand('ROCKSTAR 12OZ'),
    name: 'ROCKSTAR 12OZ',
    rate: parseRate('2F4'),
  },
  {
    id: 'rockstar-16oz-2f450',
    brand: inferBrand('ROCKSTAR 16OZ'),
    name: 'ROCKSTAR 16OZ',
    rate: parseRate('2F4.50'),
  },
  {
    id: 'rockstar-16oz-2f5',
    brand: inferBrand('ROCKSTAR 16OZ'),
    name: 'ROCKSTAR 16OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'smartwater-1l-2f5',
    brand: inferBrand('SMARTWATER 1L'),
    name: 'SMARTWATER 1L',
    rate: parseRate('2F5'),
  },
  {
    id: 'starbucks-frappuccino-13-7oz-2f7',
    brand: inferBrand('STARBUCKS FRAPPUCCINO 13.7OZ'),
    name: 'STARBUCKS FRAPPUCCINO 13.7OZ',
    rate: parseRate('2F7'),
  },
  {
    id: 'starbucks-iced-energy-12oz-2f5',
    brand: inferBrand('STARBUCKS ICED ENERGY 12OZ'),
    name: 'STARBUCKS ICED ENERGY 12OZ',
    rate: parseRate('2F5'),
  },
  {
    id: 'starbucks-varieties-2f6',
    brand: inferBrand('STARBUCKS VARITIES'),
    name: 'STARBUCKS VARITIES',
    rate: parseRate('2F6'),
    remarks:
      'Includes FRAPPUCCINO 13.7OZ, DOUBLESHOT ENERGY 15OZ, TRIPLESHOT ENERGY 11OZ, COCONUT MILK 14OZ',
  },
  {
    id: 'vitamin-20oz-2f425',
    brand: inferBrand('VITAMIN 20OZ'),
    name: 'VITAMIN 20OZ',
    rate: parseRate('2F4.25'),
  },
];


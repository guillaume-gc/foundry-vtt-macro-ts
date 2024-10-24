export const translatePf1 = (value: string): string => {
  const translationMap: Record<string, string> = {
    untyped: 'Non Typé',
    slashing: 'Tranchant',
    piercing: 'Perçant',
    bludgeoning: 'Contondant',
    fire: 'Feu',
    electric: 'Electricité',
    cold: 'Froid',
    acid: 'Acid',
    sonic: 'Sonique',
    force: 'Force',
    negative: 'Énergie Négative',
    positive: 'Énergie Postive',
    precision: 'Précision',
    nonlethal: 'Non Léthal',
    energyDrain: "Absortion d'Énergy",
    fear: 'Apeuré(e)',
    blind: 'Aveuglé(e)',
    confuse: 'Confus(e)',
    deathEffects: 'Effets de Mort',
    dazzle: 'Ébloui(e)',
    mindAffecting: 'Effects Mentaux',
    stun: 'Étourdi(e)',
    fatigue: 'Fatigué(e)',
    sicken: 'Fiévreux(se)',
    daze: 'Hébété(e)',
    disease: 'Maladie',
    paralyze: 'Paralysé(e)',
    petrify: 'Pétrifié(e)',
    poison: 'Poison',
    bleed: 'Saignement',
    sleep: 'Sommeil',
    deaf: 'Sourd(e)',
  }

  return translationMap[value.toLowerCase()] ?? value
}

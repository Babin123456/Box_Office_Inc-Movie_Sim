/**
 * Agency Packaging Engine
 * Generates dynamic agency package offerings, calculates bundle discounts,
 * and determines packaging synergy bonuses for film productions.
 */

export const MAJOR_AGENCIES = [
  {
    name: "Creative Artists Agency",
    specialty: "Blockbuster Tentpoles & Superstar Actors",
    perk: "+15% Initial Box Office Opening Hype",
    baseRelationship: 50,
  },
  {
    name: "William Morris Endeavor",
    specialty: "Visionary Directors & Multi-Platform Talent",
    perk: "+12% Production Quality Multiplier",
    baseRelationship: 50,
  },
  {
    name: "United Talent Agency",
    specialty: "High-Concept Screenwriters & Comedy/Genre Stars",
    perk: "-20% Script Acquisition & Re-write Delays",
    baseRelationship: 50,
  },
  {
    name: "Gersh Agency",
    specialty: "Prestige Drama Actors & Award-Winning Composers",
    perk: "+10% Critical Review & Festival Jury Rating",
    baseRelationship: 50,
  },
];

export const AGENCY_PACKAGES_CATALOG = [
  {
    id: "pkg_tentpole_elite",
    title: "Summer Blockbuster Power Package",
    agencyName: "Creative Artists Agency",
    tierRequired: "STANDARD",
    talentCount: 3,
    packageValue: 8000000,
    description: "Includes an A-List action hero actor, veteran stunt director, and top visual storyteller.",
    synergyBonus: { hypeBoost: 15, qualityBoost: 10, budgetEfficiency: 0.15 },
  },
  {
    id: "pkg_auteur_vision",
    title: "Auteur Director & Award Winner Duo",
    agencyName: "William Morris Endeavor",
    tierRequired: "STANDARD",
    talentCount: 2,
    packageValue: 5500000,
    description: "Pairs an acclaimed auteur filmmaker with an award-winning dramatic lead.",
    synergyBonus: { hypeBoost: 8, qualityBoost: 18, budgetEfficiency: 0.10 },
  },
  {
    id: "pkg_franchise_starter",
    title: "High-Concept Worldbuilder Bundle",
    agencyName: "United Talent Agency",
    tierRequired: "STANDARD",
    talentCount: 3,
    packageValue: 4500000,
    description: "Fast-tracks world-building with an elite sci-fi screenwriter and charismatic co-leads.",
    synergyBonus: { hypeBoost: 12, qualityBoost: 8, budgetEfficiency: 0.20 },
  },
  {
    id: "pkg_prestige_indie",
    title: "Festival Contender Ensemble",
    agencyName: "Gersh Agency",
    tierRequired: "STANDARD",
    talentCount: 2,
    packageValue: 3000000,
    description: "Crafted specifically for awards season with character actors and an orchestral composer.",
    synergyBonus: { hypeBoost: 5, qualityBoost: 20, budgetEfficiency: 0.12 },
  },
];

export function getPackagesForAgency(agencyName, relationshipScore = 50) {
  return AGENCY_PACKAGES_CATALOG.filter((pkg) => pkg.agencyName === agencyName).map((pkg) => {
    const isUnlocked = relationshipScore >= 40;
    const discountMultiplier = relationshipScore >= 80 ? 0.20 : relationshipScore >= 60 ? 0.10 : 0.05;
    const finalPrice = Math.round(pkg.packageValue * (1 - discountMultiplier));

    return {
      ...pkg,
      isUnlocked,
      discountPercentage: Math.round(discountMultiplier * 100),
      finalPrice,
      commissionCost: Math.round(finalPrice * 0.10),
    };
  });
}

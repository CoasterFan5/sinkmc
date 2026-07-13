export const taxonomy = {
  platforms: [
    "Paper",
    "Spigot",
    "Bukkit",
    "Folia",
    "Purpur",
    "Sponge",
    "Waterfall",
    "Velocity",
    "BungeeCord",
  ],
  categories: [
    "Administration",
    "Tools",
    "Security",
    "Social",
    "Optimization",
    "Mechanics",
    "Libraries",
    "World Generation",
    "Economy",
    "Cosmetics",
    "Minigames",
  ],
} as const;

export const categories = taxonomy.categories;
export const platforms = taxonomy.platforms;

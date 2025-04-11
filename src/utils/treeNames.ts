
import { TreeName } from "@/types";

export const treeAdjectives: string[] = [
  "Ancient", "Whispering", "Silent", "Dancing", "Mighty", "Gentle", 
  "Towering", "Peaceful", "Serene", "Wild", "Radiant", "Humble",
  "Wise", "Noble", "Vibrant", "Majestic", "Graceful", "Resilient"
];

export const treeSpecies: string[] = [
  "Oak", "Pine", "Maple", "Cedar", "Birch", "Willow", 
  "Aspen", "Redwood", "Cypress", "Elm", "Spruce", "Juniper",
  "Sequoia", "Sycamore", "Hemlock", "Poplar", "Cherry", "Alder"
];

export function generateTreeName(): TreeName {
  const randomAdjectiveIndex = Math.floor(Math.random() * treeAdjectives.length);
  const randomSpeciesIndex = Math.floor(Math.random() * treeSpecies.length);
  
  return {
    prefix: treeAdjectives[randomAdjectiveIndex],
    name: treeSpecies[randomSpeciesIndex]
  };
}

export function getFullTreeName(tree: TreeName): string {
  return `${tree.prefix} ${tree.name}`;
}

export const ringColors = [
  "bg-forest-wave-red",
  "bg-forest-wave-green",
  "bg-forest-wave-amber",
  "bg-forest-wave-blue",
];

export function getRandomRingColor(): string {
  return ringColors[Math.floor(Math.random() * ringColors.length)];
}

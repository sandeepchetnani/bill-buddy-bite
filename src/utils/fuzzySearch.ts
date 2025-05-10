
import fuzzysort from 'fuzzysort';

export interface Searchable {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Performs a fuzzy search on an array of items
 * 
 * @param items - The array of items to search through
 * @param searchQuery - The search query string
 * @param keys - The object keys to search in (defaults to ['name'])
 * @param threshold - The minimum score threshold (lower = more results but less accurate)
 * @returns Array of matched items sorted by relevance
 */
export const fuzzySearch = <T extends Searchable>(
  items: T[], 
  searchQuery: string,
  keys: string[] = ['name'],
  threshold: number = -5000
): T[] => {
  if (!searchQuery.trim()) {
    return items; // Return all items if search query is empty
  }

  const options = {
    threshold,
    keys,
    all: true, // Return all items even if they don't match
  };

  const result = fuzzysort.go(searchQuery, items, options);
  
  // Sort results by score (higher is better)
  return result
    .filter(res => res.score !== null)
    .sort((a, b) => b.score - a.score)
    .map(res => res.obj);
};

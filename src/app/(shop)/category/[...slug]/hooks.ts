import { useMemo } from "react";
import { Category } from "@/state/categories-api";

/**
 * Flattens a nested category tree into a single array.
 * Useful for searching categories by slug or ID regardless of nesting depth.
 * 
 * @param cats - Nested array of categories with possible children
 * @returns Flat array of all categories in the tree
 * 
 * @example
 * const flat = flattenCategories(nestedCategories);
 * const walletCategory = flat.find(c => c.slug === 'wallets');
 */
export const flattenCategories = (cats: Category[]): Category[] => {
  return cats.flatMap(cat => 
    [cat, ...(cat.children?.length ? flattenCategories(cat.children) : [])]
  );
};

/**
 * Builds a breadcrumb path from the root category to the current category.
 * Traverses up the category tree using parent_id relationships.
 * 
 * @param categories - Flat array of all categories for lookup
 * @param current - The target category to build path to
 * @returns Array representing the path from root to current category
 * 
 * @example
 * const path = buildCategoryPath(flatCategories, currentCategory);
 * // Returns: [root, parent, child, current]
 */
export const buildCategoryPath = (categories: Category[], current: Category): Category[] => {
  const path: Category[] = [];
  let node = current;
  while (node) {
    path.unshift(node);
    const parent = categories.find(c => c.id === node.parent_id);
    if (!parent) break;
    node = parent;
  }
  return path;
};

/**
 * Memoized hook to flatten a nested category tree into a single array.
 * Useful for searching categories by slug or ID regardless of nesting depth.
 * 
 * @param categories - Nested array of categories with possible children
 * @returns Flat array of all categories in the tree
 * 
 * @example
 * const flatCategories = useFlatCategories(nestedCategories);
 * const walletCategory = flatCategories.find(c => c.slug === 'wallets');
 */
export const useFlatCategories = (categories: Category[] | undefined) => {
  return useMemo(() => 
    categories ? flattenCategories(categories) : [], 
  [categories]);
};

/**
 * Memoized hook that converts selected subcategory slugs to their corresponding IDs.
 * Used for API calls that require category IDs rather than slugs.
 * 
 * @param flatCategories - Flat array of all categories for lookup
 * @param selectedSubcategorySlugs - Array of category slugs selected by user
 * @returns Array of category IDs or undefined if no valid selections
 * 
 * @example
 * const subcategoryIds = useSelectedSubcategoryIds(flatCategories, ['wallets', 'belts']);
 * // Returns: [1, 5] if wallets.id=1 and belts.id=5
 */
export const useSelectedSubcategoryIds = (
  flatCategories: Category[], 
  selectedSubcategorySlugs: string[]
) => {
  return useMemo(() => {
    if (!flatCategories.length || !selectedSubcategorySlugs.length) return undefined;
    const ids = selectedSubcategorySlugs
      .map(slug => flatCategories.find(c => c.slug === slug)?.id)
      .filter((id): id is number => id !== undefined);
    return ids.length > 0 ? ids : undefined;
  }, [flatCategories, selectedSubcategorySlugs.join(",")]);
};

/**
 * Memoized hook that builds a breadcrumb path from root to current category.
 * Used for navigation breadcrumbs and category hierarchy display.
 * 
 * @param flatCategories - Flat array of all categories for parent lookup
 * @param currentCategory - The current category to build path for
 * @returns Array representing path from root to current category
 * 
 * @example
 * const categoryPath = useCategoryPath(flatCategories, currentCategory);
 * // Returns: [{name: 'Fashion'}, {name: 'Accessories'}, {name: 'Wallets'}]
 */
export const useCategoryPath = (
  flatCategories: Category[], 
  currentCategory: Category | undefined
) => {
  return useMemo(() => {
    if (!flatCategories.length || !currentCategory) return [];
    return buildCategoryPath(flatCategories, currentCategory);
  }, [flatCategories, currentCategory]);
};

/**
 * Memoized hook that gets direct child categories of the current category.
 * Used for displaying subcategory filters and navigation options.
 * 
 * @param currentCategory - The parent category to get children from
 * @returns Array of direct child categories or empty array if none
 * 
 * @example
 * const childCategories = useChildCategories(currentCategory);
 * // Returns: [{name: 'Bi-fold'}, {name: 'Slim-wallets'}] for parent 'Wallets'
 */
export const useChildCategories = (currentCategory: Category | undefined) => {
  return useMemo(() => {
    if (!currentCategory) return [];
    return currentCategory.children ?? [];
  }, [currentCategory]);
};
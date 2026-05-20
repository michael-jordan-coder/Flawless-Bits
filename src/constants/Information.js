/**
 * @typedef {'Components'} Category
 */
export const VARIANTS = ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'];

/**
 * @typedef {'JS-CSS' | 'JS-TW' | 'TS-CSS' | 'TS-TW'} Variant
 */

/**
 * @typedef {Object} ComponentMetadata
 * @property {string} description
 * @property {Category} category
 * @property {string} name
 * @property {string[]} tags
 * @property {Variant[]} [variants]
 * @property {Record<string, string>} [meta]
 */

/**
 * @type {Record<string, ComponentMetadata>}
 */
export const componentMetadata = {
  'Components/FillButton': {
    description: 'A pill button with a radial GSAP fill that reveals from the cursor entry point and retreats from the exit.',
    category: 'Components',
    name: 'FillButton',
    tags: ['button', 'cta', 'gsap', 'hover']
  }
};

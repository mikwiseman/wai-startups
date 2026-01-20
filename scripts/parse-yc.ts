/**
 * YC Companies Parser
 * Uses Algolia API to fetch Y Combinator companies
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Algolia credentials from YC's public directory
const ALGOLIA_APP_ID = '45BWZJ1SGC';
const ALGOLIA_API_KEY = 'MjBjYjRiMzY0NzdhZWY0NjExY2NhZjYxMGIxYjc2MTAwNWFkNTkwNTc4NjgxYjU0YzFhYTY2ZGQ5OGY5NDMxZnJlc3RyaWN0SW5kaWNlcz0lNUIlMjJZQ0NvbXBhbnlfcHJvZHVjdGlvbiUyMiUyQyUyMllDQ29tcGFueV9CeV9MYXVuY2hfRGF0ZV9wcm9kdWN0aW9uJTIyJTVEJnRhZ0ZpbHRlcnM9JTVCJTIyeWNkY19wdWJsaWMlMjIlNUQmYW5hbHl0aWNzVGFncz0lNUIlMjJ5Y2RjJTIyJTVE';
const ALGOLIA_INDEX = 'YCCompany_production';

// Years from 2020 onwards
const MIN_YEAR = 2020;

interface AlgoliaHit {
  name: string;
  one_liner: string;
  long_description?: string;
  website?: string;
  all_locations?: string;
  team_size?: number;
  batch?: string;
  industry?: string;
  industries?: string[];
  subindustry?: string;
  top_company?: boolean;
  isHiring?: boolean;
  status?: string;
  slug?: string;
  small_logo_thumb_url?: string;
  stage?: string;
  tags?: string[];
  regions?: string[];
}

interface YCCompany {
  id: string;
  name: string;
  website: string;
  description: string;
  batch: string;
  location: string;
  teamSize: number | null;
  industries: string[];
  subindustry: string;
  isTopCompany: boolean;
  status: string;
  stage: string;
  tags: string[];
  regions: string[];
}

// Batch names to query
const BATCHES_TO_FETCH = [
  'Winter 2020', 'Summer 2020',
  'Winter 2021', 'Summer 2021',
  'Winter 2022', 'Summer 2022',
  'Winter 2023', 'Summer 2023',
  'Winter 2024', 'Summer 2024', 'Fall 2024',
  'Winter 2025', 'Spring 2025', 'Summer 2025', 'Fall 2025',
  'Winter 2026', 'Spring 2026'
];

async function fetchAlgoliaByBatch(batch: string, hitsPerPage: number = 1000): Promise<{ hits: AlgoliaHit[], nbPages: number, nbHits: number }> {
  const url = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX}/query`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      'X-Algolia-API-Key': ALGOLIA_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      params: `hitsPerPage=${hitsPerPage}&facetFilters=["batch:${batch}"]`
    })
  });

  if (!response.ok) {
    throw new Error(`Algolia request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchAllYCCompanies(): Promise<YCCompany[]> {
  const companies: YCCompany[] = [];

  console.log('Fetching YC companies from Algolia by batch...');

  for (const batch of BATCHES_TO_FETCH) {
    console.log(`Fetching batch: ${batch}...`);

    try {
      const result = await fetchAlgoliaByBatch(batch);
      console.log(`  Got ${result.hits.length} companies`);

      for (const hit of result.hits) {
        // Filter active/public companies only (exclude dead/acquired/inactive)
        const status = (hit.status || '').toLowerCase();
        if (status === 'inactive' || status === 'dead' || status === 'acquired') continue;

        const company: YCCompany = {
          id: `yc-${hit.slug || hit.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: hit.name,
          website: hit.website || '',
          description: hit.one_liner || hit.long_description || '',
          batch: hit.batch || batch,
          location: hit.all_locations || '',
          teamSize: hit.team_size || null,
          industries: hit.industries || [hit.industry].filter(Boolean),
          subindustry: hit.subindustry || '',
          isTopCompany: hit.top_company || false,
          status: hit.status || 'Active',
          stage: hit.stage || '',
          tags: hit.tags || [],
          regions: hit.regions || [],
        };

        companies.push(company);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`  Error fetching batch ${batch}:`, error);
    }
  }

  return companies;
}

async function main() {
  try {
    const companies = await fetchAllYCCompanies();

    console.log(`\nTotal YC companies (2020+, Active): ${companies.length}`);

    // Count by batch
    const batchCounts: Record<string, number> = {};
    for (const company of companies) {
      batchCounts[company.batch] = (batchCounts[company.batch] || 0) + 1;
    }
    console.log('\nBy batch:', batchCounts);

    // Count by industry
    const industryCounts: Record<string, number> = {};
    for (const company of companies) {
      for (const industry of company.industries) {
        industryCounts[industry] = (industryCounts[industry] || 0) + 1;
      }
    }
    console.log('\nBy industry:', industryCounts);

    // Save to file
    const outputPath = join(__dirname, 'yc-companies.json');
    writeFileSync(outputPath, JSON.stringify(companies, null, 2));
    console.log(`\nSaved to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

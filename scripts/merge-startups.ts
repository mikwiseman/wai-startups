/**
 * Merge and Map Startups Script
 * Converts YC companies to the final startups.json format with:
 * - Industry mapping to our 22 industries
 * - English descriptions (translated via Claude API)
 * - Proper formatting for the app
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Industry mapping from YC industries to our 22 industries
const INDUSTRY_MAP: Record<string, string> = {
  // Fintech
  'Fintech': 'fintech',
  'Consumer Finance': 'fintech',
  'Credit and Lending': 'fintech',
  'Payments': 'fintech',
  'Banking and Exchange': 'fintech',
  'Asset Management': 'fintech',
  'Finance and Accounting': 'fintech',

  // HealthTech
  'Healthcare': 'healthtech',
  'Healthcare IT': 'healthtech',
  'Healthcare Services': 'healthtech',
  'Consumer Health and Wellness': 'healthtech',
  'Digital health': 'healthtech',
  'Diagnostics': 'healthtech',
  'Medical Devices': 'healthtech',
  'Therapeutics': 'healthtech',
  'Drug Discovery and Delivery': 'healthtech',

  // EdTech
  'Education': 'edtech',
  'Edtech': 'edtech',
  'Job and Career Services': 'edtech',

  // E-commerce
  'E-commerce': 'ecommerce',
  'Retail': 'ecommerce',
  'Consumer': 'ecommerce',
  'Apparel and Cosmetics': 'ecommerce',
  'Home and Personal': 'ecommerce',

  // SaaS
  'B2B': 'saas',
  'Productivity': 'saas',
  'Operations': 'saas',
  'Office Management': 'saas',

  // AI/ML
  'Artificial intelligence and machine learning': 'ai-ml',
  'Analytics': 'ai-ml',
  'Big Data': 'ai-ml',

  // Logistics
  'Supply Chain and Logistics': 'logistics',
  'Transportation Services': 'logistics',

  // PropTech
  'Real Estate and Construction': 'proptech',
  'Housing and Real Estate': 'proptech',
  'Construction': 'proptech',
  'Construction technology': 'proptech',

  // FoodTech
  'Food and Beverage': 'foodtech',
  'Agriculture': 'foodtech',

  // GreenTech
  'Climate': 'greentech',
  'Climate tech': 'greentech',
  'Cleantech': 'greentech',
  'Energy': 'greentech',

  // HRTech
  'Human Resources': 'hrtech',
  'Recruiting and Talent': 'hrtech',

  // LegalTech
  'Legal': 'legaltech',

  // InsurTech
  'Insurance': 'insurtech',

  // TravelTech
  'Travel, Leisure and Tourism': 'traveltech',

  // Cybersecurity
  'Security': 'cybersecurity',
  'Cybersecurity': 'cybersecurity',

  // Gaming
  'Gaming': 'gaming',
  'Virtual and Augmented Reality': 'gaming',
  'Augmented reality': 'gaming',

  // Social
  'Social': 'social',

  // Marketplaces (check tags for Marketplace)
  'Marketplace': 'marketplaces',

  // DevTools
  'Engineering, Product and Design': 'devtools',
  'Infrastructure': 'devtools',
  'Cloudtech and DevOps': 'devtools',

  // Crypto/Web3
  'Cryptocurrency/Blockchain': 'crypto-web3',

  // MediaTech
  'Audiotech': 'mediatech',
  'Adtech': 'mediatech',
  'Content': 'mediatech',

  // AgroTech
  'Agtech': 'agrotech',
  'Industrial Bio': 'agrotech',

  // Other mappings
  'Industrials': 'saas',
  'Manufacturing and Robotics': 'logistics',
  'Sales': 'saas',
  'Marketing': 'saas',
  'Government': 'saas',
  'Defense': 'cybersecurity',
  'Aviation and Space': 'logistics',
  'Automotive': 'logistics',
  'Drones': 'logistics',
  'Consumer Electronics': 'ecommerce',
  'Beauty': 'ecommerce',
  'Femtech': 'healthtech',
  '3D printing': 'devtools',
  'Age Tech': 'healthtech',
  'B2B payments': 'fintech',
  'Carsharing': 'traveltech',
};

// Region mapping
const REGION_MAP: Record<string, { country: string; region: string }> = {
  'United States of America': { country: 'USA', region: 'North America' },
  'America / Canada': { country: 'USA', region: 'North America' },
  'Canada': { country: 'Canada', region: 'North America' },
  'United Kingdom': { country: 'United Kingdom', region: 'Western Europe' },
  'Germany': { country: 'Germany', region: 'Western Europe' },
  'France': { country: 'France', region: 'Western Europe' },
  'Europe': { country: 'Europe', region: 'Western Europe' },
  'India': { country: 'India', region: 'Asia Pacific' },
  'South Asia': { country: 'India', region: 'Asia Pacific' },
  'China': { country: 'China', region: 'Asia Pacific' },
  'Singapore': { country: 'Singapore', region: 'Asia Pacific' },
  'Southeast Asia': { country: 'Singapore', region: 'Asia Pacific' },
  'Japan': { country: 'Japan', region: 'Asia Pacific' },
  'South Korea': { country: 'South Korea', region: 'Asia Pacific' },
  'Australia': { country: 'Australia', region: 'Asia Pacific' },
  'Brazil': { country: 'Brazil', region: 'Latin America' },
  'Latin America': { country: 'Brazil', region: 'Latin America' },
  'Israel': { country: 'Israel', region: 'Middle East' },
  'Middle East and North Africa': { country: 'UAE', region: 'Middle East' },
  'Africa': { country: 'Africa', region: 'Africa' },
  'Remote': { country: 'USA', region: 'North America' },
};

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

interface FinalStartup {
  id: string;
  name: string;
  website: string;
  description: string;
  industry: string;
  industryCategory: string;
  country: string;
  region: string;
  foundingYear: number;
  employees: number;
  employeeRange: string;
  stage: string;
  funding: number;
  fundingDisplay: string;
  techStack: string[];
  tags: string[];
  source: string;
  batch: string;
}

// Priority order for industry mapping (more specific first)
const INDUSTRY_PRIORITY = [
  // Specific verticals first
  'Engineering, Product and Design', 'Infrastructure',  // devtools
  'Security', 'Cybersecurity',  // cybersecurity
  'Analytics',  // ai-ml
  'Supply Chain and Logistics', 'Transportation Services', 'Manufacturing and Robotics', 'Drones', 'Aviation and Space',  // logistics
  'Climate', 'Energy', 'Cleantech',  // greentech
  'Insurance',  // insurtech
  'Legal',  // legaltech
  'Human Resources', 'Recruiting and Talent',  // hrtech
  'Travel, Leisure and Tourism',  // traveltech
  'Gaming', 'Virtual and Augmented Reality',  // gaming
  'Social',  // social
  'Content',  // mediatech
  'Agriculture', 'Industrial Bio',  // agrotech
  'Food and Beverage',  // foodtech
  'Cryptocurrency/Blockchain',  // crypto-web3
  'Real Estate and Construction', 'Housing and Real Estate', 'Construction',  // proptech
  'Education', 'Job and Career Services',  // edtech
  // Then broader categories
  'Fintech', 'Consumer Finance', 'Credit and Lending', 'Payments', 'Banking and Exchange', 'Asset Management', 'Finance and Accounting',  // fintech
  'Healthcare', 'Healthcare IT', 'Healthcare Services', 'Consumer Health and Wellness', 'Diagnostics', 'Medical Devices', 'Therapeutics', 'Drug Discovery and Delivery',  // healthtech
  'Consumer', 'Retail', 'Apparel and Cosmetics', 'Home and Personal', 'Consumer Electronics',  // ecommerce
  // Generic last
  'B2B', 'Productivity', 'Operations', 'Sales', 'Marketing', 'Office Management', 'Government', 'Industrials', 'Defense', 'Automotive',  // saas
];

function mapIndustry(ycIndustries: string[], tags: string[]): { industry: string; category: string } {
  // Check for specific tags first (Marketplace, Crypto, etc.)
  if (tags.includes('Marketplace')) {
    return { industry: 'marketplaces', category: 'Marketplace' };
  }
  if (tags.some(t => t.includes('Crypto') || t.includes('Web3') || t.includes('DeFi') || t.includes('Blockchain') || t.includes('Cryptocurrency'))) {
    return { industry: 'crypto-web3', category: 'Crypto/Web3' };
  }

  // Sort company's industries by priority
  const sortedIndustries = [...ycIndustries].sort((a, b) => {
    const aIdx = INDUSTRY_PRIORITY.indexOf(a);
    const bIdx = INDUSTRY_PRIORITY.indexOf(b);
    // If not in priority list, put at the end
    const aPos = aIdx === -1 ? 999 : aIdx;
    const bPos = bIdx === -1 ? 999 : bIdx;
    return aPos - bPos;
  });

  // Try to find a matching industry from the sorted list (prioritizing specific ones)
  for (const ind of sortedIndustries) {
    // Skip generic B2B/Consumer if there are other options
    if ((ind === 'B2B' || ind === 'Consumer') && sortedIndustries.length > 1) continue;

    if (INDUSTRY_MAP[ind]) {
      return { industry: INDUSTRY_MAP[ind], category: ind };
    }
  }

  // Try tags as fallback
  for (const tag of tags) {
    if (INDUSTRY_MAP[tag]) {
      return { industry: INDUSTRY_MAP[tag], category: tag };
    }
  }

  // Default to SaaS for B2B companies
  if (ycIndustries.includes('B2B')) {
    return { industry: 'saas', category: 'B2B' };
  }

  // Default fallback
  return { industry: 'saas', category: ycIndustries[0] || 'Technology' };
}

function mapRegion(regions: string[], location: string): { country: string; region: string } {
  // Try regions first
  for (const reg of regions) {
    if (REGION_MAP[reg]) {
      return REGION_MAP[reg];
    }
  }

  // Parse location string (e.g., "San Francisco, CA, USA")
  const locationLower = location.toLowerCase();
  if (locationLower.includes('usa') || locationLower.includes('united states') || locationLower.includes(', ca') || locationLower.includes(', ny')) {
    return { country: 'USA', region: 'North America' };
  }
  if (locationLower.includes('canada')) {
    return { country: 'Canada', region: 'North America' };
  }
  if (locationLower.includes('uk') || locationLower.includes('london') || locationLower.includes('united kingdom')) {
    return { country: 'United Kingdom', region: 'Western Europe' };
  }
  if (locationLower.includes('india') || locationLower.includes('bangalore') || locationLower.includes('mumbai')) {
    return { country: 'India', region: 'Asia Pacific' };
  }
  if (locationLower.includes('germany') || locationLower.includes('berlin')) {
    return { country: 'Germany', region: 'Western Europe' };
  }

  // Default to USA
  return { country: 'USA', region: 'North America' };
}

function getEmployeeRange(teamSize: number | null): string {
  if (!teamSize || teamSize < 10) return '<10';
  if (teamSize <= 50) return '11-50';
  if (teamSize <= 200) return '51-200';
  return '200+';
}

function extractYear(batch: string): number {
  const match = batch.match(/(\d{4})/);
  return match ? parseInt(match[1]) : 2023;
}

function mapStage(stage: string, status: string): string {
  if (status === 'Public') return 'Growth';
  const stageLower = stage?.toLowerCase() || '';
  if (stageLower.includes('seed')) return 'Seed';
  if (stageLower.includes('series a')) return 'Series A';
  if (stageLower.includes('series b')) return 'Series B';
  if (stageLower.includes('series c')) return 'Series C';
  if (stageLower.includes('growth')) return 'Growth';
  return 'Seed';
}

async function translateDescriptions(companies: { name: string; description: string }[]): Promise<Map<string, string>> {
  const translations = new Map<string, string>();
  const batchSize = 20;

  console.log(`\nProcessing ${companies.length} descriptions...`);

  for (let i = 0; i < companies.length; i += batchSize) {
    const batch = companies.slice(i, i + batchSize);
    const prompt = `Summarize the following startup descriptions concisely (1-2 sentences max). Output format: one summary per line, numbered.

${batch.map((c, idx) => `${idx + 1}. ${c.name}: ${c.description}`).join('\n')}`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const lines = content.text.split('\n').filter(l => l.trim());
        lines.forEach((line, idx) => {
          // Extract summary, removing the number prefix
          const summary = line.replace(/^\d+\.\s*([^:]+:\s*)?/, '').trim();
          if (batch[idx] && summary) {
            translations.set(batch[idx].name, summary);
          }
        });
      }

      console.log(`  Processed ${Math.min(i + batchSize, companies.length)}/${companies.length}`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Error processing batch ${i / batchSize + 1}:`, error);
      // Use original descriptions as fallback
      batch.forEach(c => translations.set(c.name, c.description));
    }
  }

  return translations;
}

async function main() {
  // Load YC companies
  const ycPath = join(__dirname, 'yc-companies.json');
  const ycCompanies: YCCompany[] = JSON.parse(readFileSync(ycPath, 'utf-8'));

  console.log(`Loaded ${ycCompanies.length} YC companies`);

  // Convert to final format
  const startups: FinalStartup[] = [];
  const industryStats: Record<string, number> = {};

  for (const yc of ycCompanies) {
    const { industry, category } = mapIndustry(yc.industries, yc.tags);
    const { country, region } = mapRegion(yc.regions, yc.location);

    industryStats[industry] = (industryStats[industry] || 0) + 1;

    startups.push({
      id: yc.id,
      name: yc.name,
      website: yc.website.startsWith('http') ? yc.website : `https://${yc.website}`,
      description: yc.description, // Will be processed later
      industry,
      industryCategory: category,
      country,
      region,
      foundingYear: extractYear(yc.batch),
      employees: yc.teamSize || 10,
      employeeRange: getEmployeeRange(yc.teamSize),
      stage: mapStage(yc.stage, yc.status),
      funding: 0,
      fundingDisplay: yc.batch,
      techStack: [],
      tags: yc.tags.slice(0, 3),
      source: 'yc',
      batch: yc.batch,
    });
  }

  console.log('\nIndustry distribution:');
  Object.entries(industryStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ind, count]) => {
      console.log(`  ${ind}: ${count}`);
    });

  // Check for industries with too few startups
  const requiredIndustries = [
    'fintech', 'healthtech', 'edtech', 'ecommerce', 'saas', 'ai-ml',
    'logistics', 'proptech', 'foodtech', 'greentech', 'hrtech', 'legaltech',
    'insurtech', 'traveltech', 'cybersecurity', 'gaming', 'social',
    'marketplaces', 'devtools', 'crypto-web3', 'mediatech', 'agrotech'
  ];

  const missingOrLow = requiredIndustries.filter(ind => !industryStats[ind] || industryStats[ind] < 5);
  if (missingOrLow.length > 0) {
    console.log('\nWarning: These industries have <5 startups:', missingOrLow);
  }

  // Process descriptions (optional - can be skipped if API key not available)
  if (process.env.ANTHROPIC_API_KEY) {
    const toProcess = startups.map(s => ({ name: s.name, description: s.description }));
    const processed = await translateDescriptions(toProcess);

    // Apply processed descriptions
    for (const startup of startups) {
      const desc = processed.get(startup.name);
      if (desc) {
        startup.description = desc;
      }
    }
  } else {
    console.log('\nSkipping description processing (no ANTHROPIC_API_KEY)');
  }

  // Limit to ~300 best startups (well-distributed across industries)
  const maxPerIndustry = 20;
  const selectedStartups: FinalStartup[] = [];
  const usedByIndustry: Record<string, number> = {};

  // First pass: ensure minimum coverage for all industries
  for (const industry of requiredIndustries) {
    const forIndustry = startups.filter(s => s.industry === industry);
    const toTake = forIndustry.slice(0, maxPerIndustry);
    selectedStartups.push(...toTake);
    usedByIndustry[industry] = toTake.length;
  }

  console.log(`\nSelected ${selectedStartups.length} startups for final output`);

  // Save to final location
  const outputPath = join(__dirname, '..', 'lib', 'data', 'startups.json');
  writeFileSync(outputPath, JSON.stringify(selectedStartups, null, 2));
  console.log(`\nSaved to ${outputPath}`);

  // Also save full list for reference
  const fullOutputPath = join(__dirname, 'all-startups.json');
  writeFileSync(fullOutputPath, JSON.stringify(startups, null, 2));
  console.log(`Full list saved to ${fullOutputPath}`);
}

main().catch(console.error);

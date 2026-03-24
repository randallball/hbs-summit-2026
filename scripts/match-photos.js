#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const scheduleFile = path.join(__dirname, '../data/schedule.json')
const inputDir = process.argv[2] || path.join(__dirname, '../input-photos')
const outputDir = path.join(__dirname, '../public/speakers')

// Levenshtein distance
function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
  }
  return dp[m][n]
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function nameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Load schedule
const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf-8'))
const speakers = []
for (const event of schedule) {
  for (const speaker of event.speakers || []) {
    if (!speakers.find(s => s.name === speaker.name)) {
      speakers.push(speaker)
    }
  }
}

// Scan input dir
if (!fs.existsSync(inputDir)) {
  console.log(`Input directory not found: ${inputDir}`)
  console.log('Usage: node match-photos.js [input-directory]')
  process.exit(1)
}

const imageFiles = fs.readdirSync(inputDir).filter(f =>
  /\.(jpg|jpeg|png|webp)$/i.test(f)
)

if (imageFiles.length === 0) {
  console.log('No image files found in input directory.')
  process.exit(0)
}

// Ensure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const matched = []
const unmatched = []

for (const file of imageFiles) {
  const basename = path.parse(file).name
  const normalizedFile = normalize(basename)

  let bestMatch = null
  let bestDist = Infinity

  for (const speaker of speakers) {
    const normalizedName = normalize(speaker.name)
    const dist = levenshtein(normalizedFile, normalizedName)
    const ratio = dist / Math.max(normalizedFile.length, normalizedName.length)
    if (ratio < 0.4 && dist < bestDist) {
      bestDist = dist
      bestMatch = speaker
    }
  }

  if (bestMatch) {
    const ext = path.extname(file).toLowerCase().replace('.jpeg', '.jpg')
    const destName = nameToSlug(bestMatch.name) + ext
    const srcPath = path.join(inputDir, file)
    const destPath = path.join(outputDir, destName)
    fs.copyFileSync(srcPath, destPath)
    matched.push({ src: file, dest: destName, speaker: bestMatch.name, dist: bestDist })
    console.log(`✓ ${file} → ${destName} (${bestMatch.name}, dist=${bestDist})`)
  } else {
    unmatched.push(file)
  }
}

console.log(`\nMatched: ${matched.length}/${imageFiles.length}`)
if (unmatched.length > 0) {
  console.log(`Unmatched: ${unmatched.join(', ')}`)
}

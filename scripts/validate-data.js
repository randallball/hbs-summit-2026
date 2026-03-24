#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const scheduleFile = path.join(__dirname, '../data/schedule.json')
const photosDir = path.join(__dirname, '../public/speakers')

const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf-8'))

let warnings = 0
let errors = 0

function warn(msg) {
  console.warn(`⚠  ${msg}`)
  warnings++
}

function error(msg) {
  console.error(`✗  ${msg}`)
  errors++
}

// Collect all speakers
const allSpeakers = []
const speakerNames = new Set()

for (const event of schedule) {
  for (const speaker of event.speakers || []) {
    // Check for duplicates
    if (speakerNames.has(speaker.name)) {
      warn(`Duplicate speaker name: "${speaker.name}"`)
    } else {
      speakerNames.add(speaker.name)
      allSpeakers.push({ ...speaker, eventId: event.id })
    }
  }
}

// Check each speaker
for (const speaker of allSpeakers) {
  if (!speaker.bio) {
    warn(`Missing bio: ${speaker.name} (event: ${speaker.eventId})`)
  }

  if (speaker.company && !speaker.companyDesc) {
    warn(`Missing companyDesc for ${speaker.name} (company: ${speaker.company})`)
  }

  if (speaker.companyUrl) {
    try {
      new URL(speaker.companyUrl)
    } catch {
      error(`Invalid companyUrl for ${speaker.name}: ${speaker.companyUrl}`)
    }
  }

  if (speaker.linkedin) {
    try {
      new URL(speaker.linkedin)
    } catch {
      error(`Invalid linkedin URL for ${speaker.name}: ${speaker.linkedin}`)
    }
  }
}

// Check photo files
if (fs.existsSync(photosDir)) {
  function nameToSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const photoFiles = fs.readdirSync(photosDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
  const slugSet = new Set(allSpeakers.map(s => nameToSlug(s.name)))

  for (const file of photoFiles) {
    const slug = path.parse(file).name
    if (!slugSet.has(slug)) {
      warn(`Photo file has no matching speaker: ${file}`)
    }
  }

  // Report speakers with photos
  const hasPhoto = new Set(photoFiles.map(f => path.parse(f).name))
  const withPhoto = allSpeakers.filter(s => hasPhoto.has(nameToSlug(s.name)))
  console.log(`📷 ${withPhoto.length}/${allSpeakers.length} speakers have photos`)
}

console.log(`\n${allSpeakers.length} speakers across ${schedule.length} events`)

if (errors > 0) {
  console.error(`\n${errors} error(s), ${warnings} warning(s)`)
  process.exit(1)
} else if (warnings > 0) {
  console.log(`\n0 errors, ${warnings} warning(s)`)
} else {
  console.log('\n✓ All checks passed!')
}

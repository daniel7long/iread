import type { Pattern, WordEntry } from '@/types'
import { syllabify } from '@/lib/syllables'

type Extra = { base?: [string, string]; suffix?: [string, string] }

function w(
  word: string,
  syl: string,
  definition: string,
  example: string,
  pattern: Pattern = 'syllables',
  extra: Extra = {},
): WordEntry {
  return {
    word,
    syllables: syl.split('·'),
    definition,
    example,
    pattern,
    base: extra.base ? { word: extra.base[0], meaning: extra.base[1] } : undefined,
    suffix: extra.suffix ? { text: extra.suffix[0], meaning: extra.suffix[1] } : undefined,
  }
}

export const WORDS: WordEntry[] = [
  w('shadows', 'sha·dows', 'Dark shapes made when something blocks the light.', 'The trees cast dark shadows on the ground.', 'syllables', {
    base: ['shadow', 'a dark shape cast by light'],
    suffix: ['-s', 'more than one'],
  }),
  w('nocturnal', 'noc·tur·nal', 'Active at night and asleep during the day.', 'Owls are nocturnal birds.'),
  w('gliding', 'glid·ing', 'Moving smoothly and quietly without effort.', 'The owl was gliding over the field.', 'syllables', {
    base: ['glide', 'to move smoothly'],
    suffix: ['-ing', 'happening now'],
  }),
  w('whiskers', 'whis·kers', 'Long, stiff hairs on an animal’s face that help it feel.', 'The cat twitched its whiskers.', 'syllables', {
    base: ['whisker', 'one long stiff hair'],
    suffix: ['-s', 'more than one'],
  }),
  w('branches', 'branch·es', 'The arms of a tree that grow out from the trunk.', 'A small bird sat on the branches.', 'syllables', { base: ['branch', 'an arm of a tree'], suffix: ['-es', 'more than one'] }),
  w('feathers', 'feath·ers', 'The soft, light parts that cover a bird.', 'Soft feathers keep the owl warm.', 'syllables', { base: ['feather', 'one part of a bird’s coat'], suffix: ['-s', 'more than one'] }),
  w('moonlight', 'moon·light', 'The light that shines from the moon.', 'The pond glowed in the moonlight.'),
  w('hunt', 'hunt', 'To look for animals to eat.', 'Foxes hunt at night.'),
  w('quietly', 'qui·et·ly', 'Making very little sound.', 'She walked quietly past the nest.', 'affix', { base: ['quiet', 'with no noise'], suffix: ['-ly', 'in a way'] }),
  w('talons', 'tal·ons', 'The sharp claws of a bird that hunts.', 'The owl’s talons gripped the branch.'),
  w('burrow', 'bur·row', 'A hole in the ground where an animal lives.', 'The rabbit hid in its burrow.'),
  w('planet', 'plan·et', 'A big round world that moves around a star.', 'Mars is the red planet.'),
  w('explore', 'ex·plore', 'To travel somewhere new to find out about it.', 'We want to explore the cave.', 'silentE'),
  w('crater', 'cra·ter', 'A big bowl-shaped hole in the ground.', 'The rover rolled into the crater.', 'silentE'),
  w('shelter', 'shel·ter', 'A safe place that keeps you out of the weather.', 'They found shelter from the rain.'),
  w('distance', 'dis·tance', 'How far one place is from another.', 'Mountains rose in the distance.'),
  w('ocean', 'o·cean', 'A very large body of salt water.', 'Whales live in the ocean.'),
  w('blowhole', 'blow·hole', 'The hole on top of a whale’s head used for breathing.', 'The whale breathed out of its blowhole.'),
  w('breathes', 'breathes', 'Takes air in and lets it out.', 'A whale breathes air at the surface.', 'silentE'),
  w('spout', 'spout', 'A jet of water and mist blown up into the air.', 'We saw the whale’s spout.'),
  w('coast', 'coast', 'The land right next to the sea.', 'The pod swam along the coast.'),
  w('robot', 'ro·bot', 'A machine that can do jobs on its own.', 'The robot swept the floor.'),
  w('patient', 'pa·tient', 'Able to wait calmly.', 'Be patient while the seed grows.'),
  w('lantern', 'lan·tern', 'A light with a handle that you can carry.', 'He lit the lantern at dusk.'),
  w('mystery', 'mys·ter·y', 'Something strange that nobody can explain yet.', 'The missing key was a mystery.'),
  w('hollow', 'hol·low', 'Empty on the inside.', 'A fox slept in the hollow log.'),
  w('cellar', 'cel·lar', 'A room under a house, below the ground.', 'We keep apples in the cellar.'),
  w('carved', 'carved', 'Cut into a shape from stone or wood.', 'They carved a face in the stone.', 'silentE', { base: ['carve', 'to cut a shape'], suffix: ['-ed', 'already done'] }),
  w('bridges', 'brid·ges', 'Roads built to cross over water or valleys.', 'Old bridges link the two sides of town.', 'syllables', { base: ['bridge', 'a way across'], suffix: ['-s', 'more than one'] }),
  w('towers', 'tow·ers', 'Very tall, narrow buildings.', 'Stone towers stood above the walls.', 'syllables', { base: ['tower', 'a tall building'], suffix: ['-s', 'more than one'] }),
  w('ruins', 'ru·ins', 'What is left of old buildings.', 'We walked through the ruins.', 'syllables', { base: ['ruin', 'something broken down'], suffix: ['-s', 'more than one'] }),
  w('silent', 'si·lent', 'Making no sound at all.', 'The night was silent.'),
]

const BY_WORD = new Map(WORDS.map((e) => [e.word, e]))

export function clean(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z']/g, '')
}

export function lookupWord(raw: string): WordEntry {
  const key = clean(raw)
  const hit = BY_WORD.get(key)
  if (hit) return hit
  return {
    word: key,
    syllables: syllabify(key),
    definition: 'Tap the speaker to hear this word, then say it out loud.',
    example: '',
    pattern: 'syllables',
  }
}

export function hasEntry(raw: string): boolean {
  return BY_WORD.has(clean(raw))
}

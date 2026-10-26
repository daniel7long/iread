import type { Book, LevelId, TopicId, Trophy } from '@/types'

export const LEVELS: LevelId[] = ['A', 'B', 'C', 'D', 'E', 'F']
export const PHONICS_TAGS = ['Short vowels', 'Silent e', 'Digraphs', 'R-controlled', 'Prefixes/Suffixes'] as const

export const TOPICS: { id: TopicId; name: string; tone: string }[] = [
  { id: 'wildlife', name: 'Wildlife', tone: 'green' },
  { id: 'space', name: 'Space', tone: 'blue' },
  { id: 'tech', name: 'Tech', tone: 'sky' },
  { id: 'mysteries', name: 'Mysteries', tone: 'violet' },
  { id: 'history', name: 'History', tone: 'sand' },
  { id: 'ocean', name: 'Ocean', tone: 'teal' },
]

export const BOOKS: Book[] = [
  {
    id: 'creatures-of-the-night',
    title: 'Creatures of the Night',
    blurb: 'Discover the animals that wake up when the sun goes down.',
    topic: 'wildlife',
    level: 'D',
    focus: "Silent 'e' & Digraphs (CVCe)",
    tags: ['Silent e', 'Digraphs'],
    cover: { from: '#0f1a2e', to: '#26364f', icon: '🦉' },
    pages: [
      ['The sun sinks low behind the hills.', 'Soon the sky turns dark and the moon begins to rise.'],
      ['Most of us sleep when the night comes.', 'But some animals are just waking up.'],
      ['These are nocturnal animals.', 'They sleep all day and are busy all night.'],
      [
        'When the last light leaves the sky, the forest becomes quiet and still.',
        'Some animals hunt in the dark, moving softly through the shadows.',
        'Wide eyes help them see at night, and careful ears hear every sound.',
      ],
      ['Owls go gliding on silent wings between the branches.', 'Soft feathers hide the sound of their flight.'],
      ['Bats swoop low and catch insects mid-flight.', 'They use sound to find their prey in total darkness.', 'By day, bats rest in dark caves.'],
      ['Foxes and hedgehogs hunt along the ground.', 'Whiskers help them feel their way past rocks and roots.'],
      ['Soon the sky glows pink and gold.', 'The night animals tuck away to rest, and a new day begins.'],
    ],
    hard: ['nocturnal', 'shadows', 'gliding', 'branches', 'feathers', 'whiskers', 'silent'],
    practice: ['shadows', 'nocturnal', 'gliding', 'whiskers', 'branches', 'feathers'],
    quiz: {
      question: 'Where do bats rest during daylight?',
      options: [
        { id: 'caves', label: 'In dark caves', icon: '🕳️' },
        { id: 'trees', label: 'High in trees', icon: '🌳' },
        { id: 'water', label: 'Near the water', icon: '🌊' },
      ],
      answer: 'caves',
    },
    trophy: 'night-owl',
  },
  {
    id: 'the-brave-little-rover',
    title: 'The Brave Little Rover',
    blurb: 'A small robot explores a red planet and outruns a storm.',
    topic: 'space',
    level: 'C',
    focus: 'R-controlled vowels',
    tags: ['R-controlled'],
    cover: { from: '#9a3f10', to: '#d9792b', icon: '🚀' },
    pages: [
      ['Rover is a little robot on a red planet.', 'Her job is to explore.'],
      ['She starts each morning with a soft whirr.', 'Her wheels turn over the dusty ground.'],
      ['A storm swirls in the far distance.', 'Rover must find shelter before it arrives.'],
      ['She spots a deep crater with a rocky ledge.', 'It is a perfect place to hide from the storm.'],
      ['The storm passes and the sky glows orange.', 'Rover sends a picture home to Earth. Mission complete!'],
    ],
    hard: ['robot', 'planet', 'explore', 'distance', 'shelter', 'crater'],
    practice: ['planet', 'explore', 'crater', 'shelter', 'distance'],
    quiz: {
      question: 'Where does Rover hide from the storm?',
      options: [
        { id: 'crater', label: 'In a crater', icon: '🌑' },
        { id: 'tree', label: 'Under a tree', icon: '🌳' },
        { id: 'water', label: 'In the water', icon: '🌊' },
      ],
      answer: 'crater',
    },
    trophy: 'rover',
  },
  {
    id: 'whales-of-the-deep',
    title: 'Whales of the Deep',
    blurb: 'Meet the giant singers that glide through the deep blue sea.',
    topic: 'ocean',
    level: 'D',
    focus: 'Vowel digraphs (ea/oa)',
    tags: ['Digraphs'],
    cover: { from: '#0b3b5c', to: '#1b7f9e', icon: '🐋' },
    pages: [
      ['Far out in the deep ocean, a whale glides through the blue.', 'Her skin is smooth and gray.'],
      ['She breathes air through a blowhole on top of her head.', 'Each breath makes a tall, misty spout.'],
      ['Whales sing long songs that travel far through the sea.', 'Other whales can hear them from miles away.'],
      ['A baby calf swims close to its mother.', 'It drinks her milk and grows big and strong.'],
      ['At the end of the day, the pod swims toward the coast.', 'The sea is quiet, and the moon shines on the waves.'],
    ],
    hard: ['ocean', 'breathes', 'blowhole', 'spout', 'coast'],
    practice: ['ocean', 'breathes', 'blowhole', 'spout', 'coast'],
    quiz: {
      question: 'How does a whale breathe air?',
      options: [
        { id: 'blowhole', label: 'Through a blowhole', icon: '💨' },
        { id: 'gills', label: 'Through gills', icon: '🐟' },
        { id: 'tail', label: 'With its tail', icon: '🐳' },
      ],
      answer: 'blowhole',
    },
    trophy: 'deep-diver',
  },
  {
    id: 'the-robot-who-learned-to-wait',
    title: 'The Robot Who Learned to Wait',
    blurb: 'Zip zooms through every day, until a tiny plant teaches him patience.',
    topic: 'tech',
    level: 'B',
    focus: 'Short vowels',
    tags: ['Short vowels'],
    cover: { from: '#2a4f9c', to: '#5f8fe0', icon: '🤖' },
    pages: [
      ['Zip is a robot who likes to rush.', 'He zips and zaps and never sits still.'],
      ['One day his friend Nell asks him to wait.', 'Zip taps his foot. Tick, tick, tick.'],
      ['At last a bud pops open on the plant.', 'It is red and bright and full of life.'],
      ['Zip lets out a happy hum.', 'Some good things just take a little time.'],
    ],
    hard: ['robot', 'patient'],
    practice: ['robot', 'patient'],
    quiz: {
      question: 'What did Zip wait for?',
      options: [
        { id: 'flower', label: 'A flower to open', icon: '🌸' },
        { id: 'bus', label: 'A bus to come', icon: '🚌' },
        { id: 'storm', label: 'A storm to pass', icon: '⛈️' },
      ],
      answer: 'flower',
    },
    trophy: 'lightning',
  },
  {
    id: 'the-missing-lantern',
    title: 'The Missing Lantern',
    blurb: 'Chen and Beth follow wet paw prints to solve a small mystery.',
    topic: 'mysteries',
    level: 'C',
    focus: 'Digraphs (ch/sh/th)',
    tags: ['Digraphs', 'Short vowels'],
    cover: { from: '#4b2f7e', to: '#8a63c7', icon: '🔍' },
    pages: [
      ['Someone has taken the lantern from the shed.', 'Chen and Beth set out to find it.'],
      ['They check the thick bush and the old shed.', 'Only a trail of wet prints is left.'],
      ['The prints end at a hollow log.', 'Something shiny peeks out of it.'],
      ['It is the lantern, and a sleepy cat is curled up beside it!', 'The cat wanted a warm bed. Mystery solved.'],
    ],
    hard: ['lantern', 'mystery', 'hollow'],
    practice: ['lantern', 'mystery', 'hollow', 'cellar'],
    quiz: {
      question: 'Who took the lantern?',
      options: [
        { id: 'cat', label: 'A sleepy cat', icon: '🐱' },
        { id: 'fox', label: 'A sly fox', icon: '🦊' },
        { id: 'wind', label: 'The wind', icon: '💨' },
      ],
      answer: 'cat',
    },
    trophy: 'explorer',
  },
  {
    id: 'builders-of-the-old-city',
    title: 'Builders of the Old City',
    blurb: 'How people long ago raised towers and bridges from stone.',
    topic: 'history',
    level: 'E',
    focus: 'Prefixes & suffixes',
    tags: ['Prefixes/Suffixes'],
    cover: { from: '#8a6a3b', to: '#c9a26a', icon: '🏛️' },
    pages: [
      ['Long ago, people built a city from stone.', 'They carved every block by hand.'],
      ['Workers dragged the heavy stones up a ramp.', 'It took many years of careful work.'],
      ['They built towers, walls, and wide bridges.', 'Each building was made to last.'],
      ['Today we can still walk through the ruins.', 'They remind us how much people can build together.'],
    ],
    hard: ['carved', 'towers', 'bridges', 'ruins'],
    practice: ['carved', 'towers', 'bridges', 'ruins'],
    quiz: {
      question: 'What did workers drag up the ramp?',
      options: [
        { id: 'stones', label: 'Heavy stones', icon: '🪨' },
        { id: 'boats', label: 'Little boats', icon: '⛵' },
        { id: 'trees', label: 'Tall trees', icon: '🌲' },
      ],
      answer: 'stones',
    },
    trophy: 'globetrotter',
  },
]

export const FOCUS_OPTIONS = [
  { id: 'all', label: 'All patterns' },
  ...Array.from(new Set(BOOKS.map((b) => b.focus))).map((f) => ({ id: f, label: f })),
]

export function getBook(id: string | undefined): Book | undefined {
  return BOOKS.find((b) => b.id === id)
}

export function readingMinutes(book: Book): number {
  const words = book.pages.flat().join(' ').split(/\s+/).length
  return Math.max(2, Math.round(words / 60) + 3)
}

export function bookLength(book: Book): 'short' | 'medium' | 'long' {
  return book.pages.length <= 4 ? 'short' : book.pages.length <= 5 ? 'medium' : 'long'
}

export const TROPHIES: Trophy[] = [
  { id: 'night-owl', name: 'Night Owl', icon: '🦉', tone: 'yellow', how: 'Finish “Creatures of the Night”.' },
  { id: 'rover', name: 'Rover', icon: '🚀', tone: 'blue', how: 'Finish “The Brave Little Rover”.' },
  { id: 'deep-diver', name: 'Deep Diver', icon: '🐋', tone: 'green', how: 'Finish “Whales of the Deep”.' },
  { id: 'explorer', name: 'Explorer', icon: '🧭', tone: 'yellow', how: 'Finish “The Missing Lantern”.' },
  { id: 'lightning', name: 'Lightning', icon: '⚡', tone: 'blue', how: 'Finish “The Robot Who Learned to Wait”.' },
  { id: 'globetrotter', name: 'Globetrotter', icon: '🌍', tone: 'green', how: 'Finish “Builders of the Old City”.' },
]

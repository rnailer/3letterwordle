// Placeholder word lists. Replace with curated lists before launch.
// All entries must be lowercase, exactly 3 letters, a-z only.

export const ANSWERS: readonly string[] = [
  'cat', 'dog', 'bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat', 'tap',
  'top', 'tip', 'pop', 'pup', 'pup', 'cup', 'cub', 'bud', 'bug', 'bus',
  'run', 'sun', 'fun', 'gun', 'bun', 'nun', 'pun', 'ran', 'man', 'can',
  'ban', 'fan', 'pan', 'tan', 'van', 'dig', 'fig', 'big', 'wig', 'jig',
  'bed', 'red', 'led', 'fed', 'wed', 'box', 'fox', 'mix', 'six', 'fix',
];

const GUESSES_EXTRA: readonly string[] = [
  'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'ale', 'all',
  'amp', 'and', 'ant', 'any', 'ape', 'apt', 'arc', 'are', 'ark', 'arm',
  'art', 'ash', 'ask', 'ate', 'awe', 'bad', 'bag', 'bar', 'bay', 'bee',
  'beg', 'bet', 'bid', 'bin', 'bit', 'bob', 'bog', 'boo', 'bop', 'bow',
  'boy', 'bra', 'bro', 'buy', 'bye', 'cab', 'cap', 'car', 'cop', 'cow',
  'cry', 'cue', 'cut', 'dad', 'dam', 'day', 'den', 'dew', 'did', 'die',
  'dim', 'din', 'dip', 'doe', 'don', 'dot', 'dry', 'dub', 'due', 'dug',
  'duo', 'dye', 'ear', 'eat', 'ebb', 'eel', 'egg', 'ego', 'elf', 'elk',
  'elm', 'emu', 'end', 'era', 'eve', 'eye', 'far', 'fee', 'few', 'fib',
  'fin', 'fir', 'fit', 'flu', 'fly', 'foe', 'fog', 'for', 'fro', 'fry',
  'gap', 'gas', 'gel', 'gem', 'get', 'gig', 'gin', 'god', 'got', 'gum',
  'gut', 'guy', 'gym', 'had', 'ham', 'has', 'hay', 'hem', 'hen', 'her',
  'hey', 'hid', 'him', 'hip', 'his', 'hit', 'hog', 'hop', 'hot', 'how',
  'hub', 'hue', 'hug', 'hum', 'hut', 'ice', 'icy', 'ilk', 'ill', 'imp',
  'ink', 'inn', 'ion', 'ire', 'irk', 'its', 'ivy', 'jab', 'jam', 'jar',
  'jaw', 'jay', 'jet', 'job', 'jog', 'jot', 'joy', 'jug', 'keg', 'key',
  'kid', 'kin', 'kit', 'lab', 'lad', 'lag', 'lap', 'law', 'lay', 'lea',
  'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'lob', 'log', 'lot', 'low',
  'mad', 'map', 'max', 'may', 'med', 'men', 'met', 'mid', 'mob', 'mod',
  'mom', 'mop', 'mud', 'mug', 'mum', 'nab', 'nag', 'nap', 'nay', 'net',
  'new', 'nib', 'nip', 'nit', 'nod', 'nor', 'not', 'now', 'nub', 'nut',
  'oaf', 'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oil', 'old', 'one',
  'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own', 'pad', 'paw', 'pay',
  'pea', 'pen', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod',
  'pot', 'pow', 'pox', 'pro', 'pry', 'pub', 'put', 'rag', 'raw', 'ray',
  'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'roe', 'rot', 'row',
  'rub', 'rug', 'rum', 'rut', 'rye', 'sad', 'sag', 'sap', 'saw', 'say',
  'sea', 'see', 'set', 'she', 'shy', 'sin', 'sip', 'sir', 'sit', 'ski',
  'sky', 'sly', 'son', 'sow', 'soy', 'spa', 'spy', 'sty', 'sub', 'sum',
  'tab', 'tad', 'tag', 'tar', 'tax', 'tea', 'ten', 'the', 'thy', 'tic',
  'tie', 'tin', 'toe', 'ton', 'too', 'toy', 'try', 'tub', 'tug', 'two',
  'urn', 'use', 'vat', 'vet', 'via', 'vie', 'vow', 'wag', 'war', 'was',
  'wax', 'way', 'web', 'wet', 'who', 'why', 'win', 'wit', 'woe', 'wok',
  'won', 'woo', 'wow', 'wry', 'yak', 'yam', 'yap', 'yaw', 'yea', 'yen',
  'yep', 'yes', 'yet', 'you', 'yum', 'zap', 'zip', 'zit', 'zoo',
];

export const VALID_GUESSES: ReadonlySet<string> = new Set<string>([
  ...ANSWERS,
  ...GUESSES_EXTRA,
]);

export function isValidGuess(word: string): boolean {
  return VALID_GUESSES.has(word.toLowerCase());
}

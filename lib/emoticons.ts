'use client';

export const EMOTICONS = [
  'ʕ•ᴥ•ʔ',    // Bear
  '(=^･^=)',   // Cat
  '(◕(ｪ)◕)',   // Puppy
  '(･ｪ-)',     // Winking Bear
  '(^◕ᴥ◕^)',   // Happy Dog
  '(・⊝・)',    // Bird
  '(=｀ω´=)',   // Grumpy Cat
  'ʕ·ᴥ·　ʔ',  // Curious Bear
  '(^◡^)',     // Happy Hamster
  '(´･ᴥ･`)',  // Friendly Dog
  'ʕ •ᴥ•ʔ',   // Gentle Bear
  '(=^･ｪ･^=)', // Sweet Cat
  '(･ω･)',     // Hamster
  '(≧◡≦)',     // Happy Bunny
  'ʕ￫ᴥ￩ʔ',    // Shy Bear
];

export function getRandomEmoticon() {
  if (typeof window === 'undefined') {
    return EMOTICONS[0]; // Return a consistent emoticon on server
  }
  return EMOTICONS[Math.floor(Math.random() * EMOTICONS.length)];
} 
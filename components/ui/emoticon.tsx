'use client';

import { useEffect, useState } from 'react';
import { EMOTICONS } from '@/lib/emoticons';

export function RandomEmoticon() {
  const [emoticon, setEmoticon] = useState(EMOTICONS[0]);

  useEffect(() => {
    setEmoticon(EMOTICONS[Math.floor(Math.random() * EMOTICONS.length)]);
  }, []);

  return <span>{emoticon}</span>;
} 
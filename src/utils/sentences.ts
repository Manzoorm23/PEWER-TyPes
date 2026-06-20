export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "world", "school", "still", "try", "last", "ask", "need", "too", "feel", "three",
  "state", "never", "become", "between", "high", "really", "something", "most", "another", "much",
  "family", "own", "leave", "put", "old", "while", "mean", "on", "keep", "student",
  "why", "let", "great", "same", "big", "group", "begin", "seem", "country", "help",
  "talk", "where", "turn", "problem", "every", "start", "hand", "might", "show", "part",
  "about", "against", "place", "over", "such", "again", "few", "case", "most", "week",
  "company", "system", "each", "right", "program", "hear", "so", "question", "during", "play",
  "government", "run", "small", "number", "off", "always", "move", "like", "night", "live",
  "Mr", "point", "believe", "hold", "today", "bring", "happen", "next", "without", "before",
  "large", "all", "million", "must", "home", "under", "water", "room", "write", "mother",
  "area", "national", "money", "story", "young", "fact", "month", "different", "lot", "right",
  "study", "book", "eye", "job", "word", "though", "business", "issue", "side", "kind",
  "four", "head", "far", "black", "long", "both", "little", "house", "yes", "since",
  "provide", "service", "around", "friend", "important", "father", "sit", "away", "until", "power",
  "hour", "game", "often", "yet", "line", "political", "end", "among", "ever", "stand",
  "bad", "lose", "however", "member", "pay", "law", "meet", "car", "city", "almost",
  "include", "continue", "set", "later", "community", "much", "name", "five", "once", "white",
  "least", "president", "learn", "real", "change", "team", "minute", "best", "several", "idea",
  "kid", "body", "information", "nothing", "ago", "right", "lead", "social", "understand", "whether",
  "watch", "together", "follow", "parent", "stop", "face", "anything", "create", "public", "already",
  "speak", "others", "read", "level", "allow", "add", "office", "spend", "door", "health",
  "person", "art", "sure", "war", "history", "party", "within", "grow", "result", "open",
  "morning", "walk", "reason", "low", "win", "research", "girl", "guy", "early", "food",
  "moment", "himself", "air", "teacher", "force", "off", "offer", "enough", "both", "education"
];

export const basicSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "Fortune favors the bold.",
  "Honesty is the best policy.",
  "Actions speak louder than words.",
  "Beauty is in the eye of the beholder.",
  "Knowledge is power.",
  "When life gives you lemons, make lemonade.",
  "The early bird catches the worm.",
  "Don't count your chickens before they hatch.",
  "A picture is worth a thousand words.",
  "Better late than never.",
  "Necessity is the mother of invention.",
  "Practice makes perfect.",
  "Rome wasn't built in a day.",
  "A watched pot never boils.",
  "Brevity is the soul of wit.",
  "Good things come to those who wait.",
  "Haste makes waste.",
  "If it ain't broke, don't fix it.",
  "You can't have your cake and eat it too.",
  "Two wrongs don't make a right.",
  "An apple a day keeps the doctor away.",
  "Where there's smoke, there's fire.",
  "A penny saved is a penny earned.",
  "You can't judge a book by its cover.",
  "If you want something done right, do it yourself.",
  "Laughter is the best medicine.",
  "When the going gets tough, the tough get going.",
  "Every cloud has a silver lining.",
  "The pen is mightier than the sword.",
  "Hope for the best, prepare for the worst.",
  "Don't put all your eggs in one basket.",
  "Strike while the iron is hot.",
  "A chain is only as strong as its weakest link.",
  "Birds of a feather flock together.",
  "Keep your friends close and your enemies closer.",
  "A rolling stone gathers no moss.",
  "A stitch in time saves nine.",
  "Out of sight, out of mind.",
  "Seeing is believing.",
  "There's no place like home.",
  "Time flies when you're having fun.",
  "Too many cooks spoil the broth."
];

export interface Quote {
  text: string;
  source: string;
  length: "short" | "medium" | "long";
}

export const quotes: Quote[] = [
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    source: "Franklin D. Roosevelt",
    length: "short"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    source: "Mahatma Gandhi",
    length: "short"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    source: "Winston Churchill",
    length: "short"
  },
  {
    text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    source: "Martin Luther King Jr.",
    length: "medium"
  },
  {
    text: "That which does not kill us makes us stronger.",
    source: "Friedrich Nietzsche",
    length: "short"
  },
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    source: "Ralph Waldo Emerson",
    length: "medium"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    source: "Aristotle",
    length: "short"
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    source: "Ralph Waldo Emerson",
    length: "medium"
  },
  {
    text: "Two roads diverged in a wood, and I—I took the one less traveled by, and that has made all the difference.",
    source: "Robert Frost",
    length: "medium"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    source: "Nelson Mandela",
    length: "medium"
  },
  {
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    source: "Mother Teresa",
    length: "medium"
  },
  {
    text: "You miss one hundred percent of the shots you don't take, and in hockey, you can never score if you don't shoot the puck at the net.",
    source: "Wayne Gretzky",
    length: "long"
  },
  {
    text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.",
    source: "Mark Twain",
    length: "long"
  },
  {
    text: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough. Be grateful for all the small victories and lessons along the journey.",
    source: "Oprah Winfrey",
    length: "long"
  }
];

export const continuousParagraphs = [
  "Typing is the process of writing or inputting text by pressing keys on a typewriter, computer keyboard, cell phone, or calculator. It can be distinguished from other means of text input, such as handwriting and speech recognition. Continuous practice helps build muscle memory, allowing you to type quickly and accurately without looking down at the keys. Professional typists can reach speeds of over one hundred words per minute by using the touch typing method, which places fingers on the home row keys.",
  "The rapid development of technology has changed the way we communicate, work, and live. From smartphones in our pockets to huge servers running the cloud, digital systems are now the foundation of modern society. Learning to interact with these devices efficiently is a crucial skill in the digital age. As artificial intelligence and machine learning continue to advance, the relationship between humans and computers will grow even closer, opening up new opportunities for innovation.",
  "The forest was quiet, save for the gentle rustle of leaves in the warm afternoon breeze. Sunlight filtered through the tall pine trees, casting long shadows across the mossy floor. A small stream flowed nearby, its clear water bubbling over smooth gray stones as it wound its way deeper into the wilderness. Here, away from the noise of the city, nature thrives in its purest form, offering a peaceful sanctuary for anyone who takes the time to stop and look.",
  "Space exploration has always captured the human imagination. The stars and planets in our night sky remind us of the vast universe that lies beyond our own world. As we launch new telescopes and space probes, we get closer to understanding the origins of our solar system and the possibility of life on other worlds. Traveling to Mars and establishing permanent bases on the moon are no longer science fiction, but realistic goals for the next generation of explorers.",
  "Writing software is both a science and an art form. Developers use programming languages to translate complex logical ideas into instructions that a computer can execute. It requires patience, critical thinking, and attention to detail, as a single out-of-place character can cause an entire system to fail. Solving programming problems is incredibly rewarding, because it allows you to build useful tools and systems out of nothing more than typed code.",
  "Reading books is one of the most effective ways to expand your knowledge and understanding of the world. Through the written word, we can explore different cultures, historical eras, and scientific concepts. It exercises the brain, improves vocabulary, and enhances our ability to focus. In a world increasingly dominated by short digital distractions, sitting down with a good book remains a powerful way to engage with deep ideas and stories."
];

const sentences = [
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
    "Actions speak louder than words.",
    "When the going gets tough, the tough get going.",
    "Every cloud has a silver lining.",
    "The pen is mightier than the sword.",
    "Hope for the best, prepare for the worst.",
    "Don't put all your eggs in one basket.",
    "Strike while the iron is hot.",
    "Barking up the wrong tree.",
    "A chain is only as strong as its weakest link.",
    "Birds of a feather flock together.",
    "Every dog has its day.",
    "Fools rush in where angels fear to tread.",
    "It takes two to tango.",
    "Keep your friends close and your enemies closer.",
    "A rolling stone gathers no moss.",
    "A stitch in time saves nine.",
    "Out of sight, out of mind.",
    "Seeing is believing.",
    "There's no place like home.",
    "Time flies when you're having fun.",
    "Too many cooks spoil the broth."
];

const sentenceDisplay = document.getElementById("sentence");
const inputText = document.getElementById("inputText");
const timeLeftDisplay = document.getElementById("timeLeft");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const startButton = document.getElementById("startButton");

let timer;
let timeLeft = 60;
let currentSentence = "";
let typedText = "";
let wordCount = 0;
let errors = 0;
let isTyping = false;

startButton.addEventListener("click", startTest);
inputText.addEventListener("input", handleTyping);

function startTest() {
    // Reset values
    timeLeft = 60;
    wordCount = 0;
    errors = 0;
    isTyping = false;
    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "0%";
    inputText.value = "";
    inputText.disabled = false;
    inputText.focus();

    // Display a random sentence
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    sentenceDisplay.innerText = currentSentence;

    // Start timer
    clearInterval(timer);
    timer = setInterval(countdown, 1000);
}

function handleTyping() {
    if (!isTyping) {
        isTyping = true;
    }

    typedText = inputText.value;

    // Calculate word count
    wordCount = typedText.trim().split(/\s+/).filter(word => word !== "").length;

    // Calculate errors
    errors = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] !== currentSentence[i]) {
            errors++;
        }
    }

    // Update WPM and accuracy
    const wpm = Math.round((wordCount / (60 - timeLeft)) * 60);
    const accuracy = Math.max(0, Math.round(((typedText.length - errors) / typedText.length) * 100));

    wpmDisplay.innerText = isNaN(wpm) || !isFinite(wpm) ? "0" : wpm;
    accuracyDisplay.innerText = isNaN(accuracy) ? "0%" : accuracy + "%";

    // Check if the typing is complete
    if (typedText === currentSentence) {
        endTest();
    }
}

function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
        timeLeftDisplay.innerText = timeLeft;
    } else {
        endTest();
    }
}

function endTest() {
    clearInterval(timer);
    inputText.disabled = true;
    const finalWpm = wpmDisplay.innerText;
    const finalAccuracy = accuracyDisplay.innerText;
    alert(`Test completed! Your typing speed is ${finalWpm} WPM with ${finalAccuracy} accuracy.`);
}
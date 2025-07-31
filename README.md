# Cloze Generator

A web-based tool for generating Duolingo-style cloze exercises from paragraphs. This application helps educators and language learners create fill-in-the-blank exercises by automatically selecting suitable words and creating blanks with partial hints.

## Features

- **Automatic Word Selection**: Intelligently selects words suitable for cloze exercises, avoiding common stop words
- **Customizable Blank Count**: Set the number of blanks per paragraph (default: 15)
- **Partial Word Hints**: Shows 1-2 letters of each word to provide helpful hints
- **Multiple Paragraph Support**: Process multiple paragraphs at once
- **Copy & Download**: Copy individual exercises or download all exercises as a text file
- **Modern UI**: Clean, responsive design with dark theme

## How It Works

1. **Input**: Enter one or more paragraphs (one per line)
2. **Processing**: The algorithm identifies suitable words (3+ letters, excluding common stop words)
3. **Selection**: Randomly selects the specified number of words to create blanks
4. **Formatting**: Creates blanks with partial hints (e.g., "cat ___ ___ (1)" for "cat")
5. **Output**: Displays original text, cloze version, and answer key

## Usage

### Basic Usage

1. Open `index.html` in your web browser
2. Enter your paragraphs in the text area (one paragraph per line)
3. Set the number of blanks per paragraph (optional, default is 15)
4. Click "Generate Cloze Exercises"
5. View, copy, or download the generated exercises

### Example Input

```
The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.
Learning a new language can be challenging but rewarding. Practice makes perfect.
```

### Example Output

```
Exercise 1

Original: The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.

Cloze: The qu___ ___ ___ fox j___ ___ over the l___ dog. This s___ contains all the l___ of the alphabet.

Answers: 1. ick, 2. brown, 3. jumps, 4. lazy, 5. sentence, 6. letters
```

## Features in Detail

### Word Selection Algorithm

The tool filters out:
- Words with less than 3 letters
- Common stop words (the, and, or, but, in, on, at, etc.)
- Pronouns and articles

### Blank Formatting

- Shows 1 letter for 3-letter words
- Shows 2 letters for longer words
- Uses underscores with spaces for visual clarity
- Numbers each blank sequentially

### Export Options

- **Copy Individual**: Copy any single exercise to clipboard
- **Copy All**: Copy all exercises at once
- **Download All**: Download all exercises as a text file

## File Structure

```
FillInTheBlank/
├── index.html      # Main HTML file
├── main.js         # JavaScript functionality
├── styles.css      # CSS styling
└── README.md       # This file
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Requires clipboard API support for copy functionality

## Local Development

1. Clone or download the project files
2. Open `index.html` in a web browser
3. No build process or dependencies required

## Customization

### Modifying Word Selection

Edit the `suitableWords` filter in `main.js` to change which words are selected:

```javascript
const suitableWords = wordMatches.filter(match => {
    const word = match[0].toLowerCase();
    return word.length >= 3 &&
           !['the', 'and', 'or', ...].includes(word);
});
```

### Changing Blank Format

Modify the blank creation logic in the `generateCloze` function:

```javascript
const lettersToShow = word.length <= 3 ? 1 : 2;
const shownPart = word.substring(0, lettersToShow);
const underscoreCount = word.length - lettersToShow;
const underscores = '_'.repeat(underscoreCount);
const blank = underscores.split('').join(' ');
```

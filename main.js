document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('clozeForm');
    const results = document.getElementById('results');
    const clozeExercises = document.getElementById('clozeExercises');

    let allExercises = [];

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const paragraphs = document.getElementById('paragraphs').value.trim();
        const blankCount = parseInt(document.getElementById('blankCount').value) || 15;

        if (!paragraphs) {
            alert('Please enter some paragraphs.');
            return;
        }

        const paragraphList = paragraphs.split('\n').filter(p => p.trim());

        if (paragraphList.length === 0) {
            alert('Please enter at least one paragraph.');
            return;
        }

        // Generate cloze exercises for each paragraph
        allExercises = [];
        clozeExercises.innerHTML = '';

        paragraphList.forEach((paragraph, index) => {
            const exercise = generateCloze(paragraph, blankCount, index + 1);
            if (exercise) {
                allExercises.push(exercise);
                displayExercise(exercise, index + 1);
            }
        });

        if (allExercises.length > 0) {
            results.classList.remove('hidden');
            // results.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Download functionality
    document.getElementById('downloadAll').addEventListener('click', function (event) {
        downloadAllExercises();
    });

    // Copy all functionality
    document.getElementById('copyAll').addEventListener('click', function (event) {
        copyAllExercises(event);
    });

    function generateCloze(paragraph, blankCount, exerciseNumber) {
        if (!paragraph.trim()) {
            return null;
        }

        // Split into words and keep track of their positions
        const wordMatches = [...paragraph.matchAll(/\b\w+\b/g)];

        // Filter suitable words with their original positions
        const suitableWords = wordMatches.filter(match => {
            const word = match[0].toLowerCase();
            return word.length >= 3 &&
                !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'a', 'an', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'].includes(word);
        }).map(match => ({
            word: match[0],
            start: match.index,
            end: match.index + match[0].length
        }));

        if (suitableWords.length < blankCount) {
            console.warn(`Exercise ${exerciseNumber}: Not enough suitable words found. Found ${suitableWords.length} words, but requested ${blankCount} blanks.`);
            // Use all available words if not enough found
            blankCount = Math.min(suitableWords.length, blankCount);
        }

        if (blankCount === 0) {
            return null;
        }

        // Randomly select the exact number of words requested
        const shuffled = [...suitableWords].sort(() => Math.random() - 0.5);
        const selectedWords = shuffled.slice(0, blankCount);

        // Sort selected words by position to process them correctly
        selectedWords.sort((a, b) => a.start - b.start);

        // Assign numbers in order of appearance (1, 2, 3, etc.)
        selectedWords.forEach((wordInfo, index) => {
            wordInfo.number = index + 1;
        });

        // Create the cloze text by processing from end to beginning
        let clozeText = paragraph;
        const answers = [];

        // Process replacements from end to beginning to avoid index shifting
        for (let i = selectedWords.length - 1; i >= 0; i--) {
            const wordInfo = selectedWords[i];
            const word = wordInfo.word;
            const answerNumber = wordInfo.number;

            // Determine how many letters to show (1-2 letters)
            const lettersToShow = word.length <= 3 ? 1 : 2;
            const shownPart = word.substring(0, lettersToShow);
            const underscoreCount = word.length - lettersToShow;
            const underscores = '_'.repeat(underscoreCount);

            // Create the blank with spaces between underscores
            const blank = underscores.split('').join(' ');
            const replacement = `${shownPart} ${blank} (${answerNumber})`;

            // Replace the word in the text
            clozeText = clozeText.substring(0, wordInfo.start) + replacement + clozeText.substring(wordInfo.end);

            // Store answer info
            answers.push({ number: answerNumber, word: word.toLowerCase() });
        }

        // Sort answers by number and format them
        answers.sort((a, b) => a.number - b.number);
        const formattedAnswers = answers.map(answer => `${answer.number}. ${answer.word}`);

        const answerString = `Answers: ${formattedAnswers.join(', ')}`;

        return {
            number: exerciseNumber,
            original: paragraph,
            cloze: clozeText,
            answers: answerString
        };
    }

    function displayExercise(exercise, exerciseNumber) {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-item';
        exerciseDiv.innerHTML = `
            <div class="exercise-header">
                <h3>Exercise ${exercise.number}</h3>
                <div class="exercise-actions">
                    <button class="action-btn copy-exercise" data-exercise="${exerciseNumber - 1}">Copy Exercise</button>
                </div>
            </div>
            <div class="result-section">
                <h4>Original Text:</h4>
                <div class="original-text">${exercise.original}</div>
            </div>
            <div class="result-section">
                <h4>Cloze Text:</h4>
                <div class="cloze-text">${exercise.cloze}</div>
            </div>
            <div class="result-section">
                <h4>Answer Key:</h4>
                <div class="answer-key">${exercise.answers}</div>
            </div>
        `;

        clozeExercises.appendChild(exerciseDiv);

        // Add copy functionality for individual exercises
        exerciseDiv.querySelector('.copy-exercise').addEventListener('click', function (event) {
            const exerciseIndex = parseInt(this.getAttribute('data-exercise'));
            const exercise = allExercises[exerciseIndex];
            const exerciseText = `Exercise ${exercise.number}\n\nOriginal: ${exercise.original}\n\nCloze: ${exercise.cloze}\n\n${exercise.answers}`;
            copyToClipboard(exerciseText, event);
        });
    }

    function downloadAllExercises() {
        let content = 'Cloze Exercises\n';
        content += '='.repeat(50) + '\n\n';

        allExercises.forEach(exercise => {
            // content = `Exercise ${exercise.number}\n`;
            // content += '-'.repeat(20) + '\n';
            // content += `Original: ${exercise.original}\n\n`;
            content = `Cloze paragraph: ${exercise.cloze}\n`;
            content += `${exercise.answers}\n\n`;
            // content += '='.repeat(50) + '\n\n';
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cloze_exercises.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showDownloadSuccess(document.getElementById('downloadAll'));
    }

    function copyAllExercises(event) {
        let content = 'Cloze Exercises\n\n';

        allExercises.forEach(exercise => {
            // content += `Exercise ${exercise.number}\n`;
            // content += `Original: ${exercise.original}\n`;
            content = `Cloze paragraph: ${exercise.cloze}\n`;
            content += `${exercise.answers}\n\n`;
        });

        copyToClipboard(content, event);
    }

    function copyToClipboard(text, event) {
        // Check if clipboard API is supported
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showCopySuccess(event.target);
            } catch (err) {
                console.error('Could not copy text: ', err);
                alert('Failed to copy to clipboard. Please copy manually.');
            }
            document.body.removeChild(textArea);
            return;
        }

        // Modern browsers - use Clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(event.target);
        }).catch((err) => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy to clipboard. Please copy manually.');
        });
    }

    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#28a745';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
    }

    function showDownloadSuccess(button) {
        const originalText = button.textContent;
        button.textContent = 'Downloaded!';
        button.style.background = '#28a745';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
    }
});
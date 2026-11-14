/** Conservative line classifier: never hide a line that also contains other code. */
const supported = new Set(['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'python', 'al', 'groovy', 'php']);
export function supports(language: string): boolean { return supported.has(language); }

function standaloneCall(text: string, pattern: RegExp): boolean {
    const match = text.match(pattern);
    if (!match) { return false; }
    let depth = 1;
    let quote = '';
    let escaped = false;
    for (let i = match[0].length; i < text.length; i++) {
        const char = text[i];
        if (quote) {
            if (escaped) { escaped = false; }
            else if (char === '\\') { escaped = true; }
            else if (char === quote) { quote = ''; }
        } else if (char === '"' || char === "'" || char === '`') { quote = char; }
        else if (char === '(') { depth++; }
        else if (char === ')' && --depth === 0) { return /^;?\s*$/.test(text.slice(i + 1)); }
    }
    return false;
}

/** Track multiline strings so comment-looking text inside them stays visible. */
function nextStringState(line: string, language: string, initial: string): string {
    let state = initial;
    let escaped = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (escaped) { escaped = false; continue; }
        if (char === '\\') { escaped = true; continue; }
        if (state) {
            if (line.startsWith(state, i)) { i += state.length - 1; state = ''; }
            continue;
        }
        if ((language === 'python' || language === 'php') && char === '#') { break; }
        if (language !== 'python' && line.startsWith('//', i)) { break; }
        if (language === 'python' && (line.startsWith('"""', i) || line.startsWith("'''", i))) {
            state = line.slice(i, i + 3); i += 2;
        } else if (char === '"' || char === "'" || char === '`') { state = char; }
    }
    return state;
}

export function hiddenLineNumbers(lines: readonly string[], language: string): number[] {
    if (!supports(language)) { return []; }
    const result: number[] = [];
    let stringState = '';
    for (let i = 0; i < lines.length; i++) {
        const text = lines[i].trim();
        if (!stringState) {
            const comment = language === 'python' ? text.startsWith('#') :
                text.startsWith('//') || (language === 'php' && text.startsWith('#'));
            const call = language === 'python' ? /^print\s*\(/ :
                language === 'groovy' ? /^(?:print(?:ln|f)?|System\.out\.print(?:ln|f)?)\s*\(/ :
                language === 'php' ? /^(?:print_r|var_dump)\s*\(/ :
                /^console\.(?:log|warn|error|info|debug)\s*\(/;
            if (comment || (language !== 'al' && standaloneCall(text, call))) { result.push(i); }
        }
        stringState = nextStringState(lines[i], language, stringState);
    }
    return result;
}

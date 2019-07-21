import {getDiff, printDiffInConsole, convertDiffToLog} from './diff.js';

const UIorigTextarea = document.getElementById('origTextarea')
const UItargetTextarea = document.getElementById('targetTextarea')
const UIresultTextarea = document.getElementById('resultTextarea')
const UIcompareButton = document.getElementById('compareButton')

UIorigTextarea.value = "computer";
UItargetTextarea.value = "commuter"

UIcompareButton.addEventListener('click', () => {
    const origString = UIorigTextarea.value;
    const targetString = UItargetTextarea.value;
    const changeHistory = getDiff(origString, targetString);
    const log = convertDiffToLog(changeHistory, origString, targetString);
    let logHTML = "";
    for (let line of log) {
        if (line.text === '\n') {
            logHTML += `<span class=${line.operation}>&lt;new line&gt;</span> <br/>`
        } else if (line.text === '\t') {
            logHTML += `<span class=${line.operation}>&lt;tab&gt;</span> <br/>`
        } else if (line.text === ' ') {
            logHTML += `<span class=${line.operation}>&lt;space&gt;</span> <br/>`
        } else {
            logHTML += `<span class=${line.operation}>${line.text}</span> <br/>`
        }
    }
    UIresultTextarea.innerHTML = logHTML;
    location.href = "#resultTextarea";
})
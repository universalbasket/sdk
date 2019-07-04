function StepIcon(i, activeIndex) {
    const div = document.createElement('div');

    div.className = 'progress-bar__step';

    if (activeIndex != null && i === activeIndex) {
        div.classList.add('progress-bar__step--active');
    }

    div.append(`${ i + 1 }`);

    return div;
}

function StepLabel(activeLabel, activeIndex, totalSteps) {
    if (activeLabel == null || activeIndex == null) {
        return '';
    }

    const span = document.createElement('span');
    span.className = 'progress-bar__current-step';
    span.append(activeLabel);

    let leftRuler = activeIndex;
    let rightRuler = activeIndex + 3;
    let textAlign = 'center';

    if (activeLabel.length > 14) {
        leftRuler = activeIndex - 1;
        rightRuler = activeIndex + 4;
    }

    if (leftRuler <= 0) {
        leftRuler = 1;
    }

    if (rightRuler > totalSteps) {
        rightRuler = -1;
    }

    if (activeIndex === 0) {
        textAlign = 'left';
        rightRuler = -1;
    }

    if (activeIndex + 1 === totalSteps) {
        textAlign = 'right';
        leftRuler = 1;
    }

    span.style.gridColumnStart = `${leftRuler}`;
    span.style.gridColumnEnd = `${rightRuler}`;
    span.style.textAlign = textAlign;

    return span;
}

export default function progressBar(titles, activeLabel, activeStep) {
    const element = document.createElement('div');

    element.className = 'progress-bar';
    element.style.gridTemplateColumns = `repeat(${titles.length}, var(--progress-step-icon-size))`;
    element.append(...titles.map((_, i) => StepIcon(i, activeStep)), StepLabel(activeLabel, activeStep, titles.length));

    return element;
}

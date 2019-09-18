const icon = (i, stepKey, activeStepIndex) => {
    const stepIndex = Number(stepKey);
    const div = document.createElement('div');
    div.className = 'progress-bar__step';
    if (stepIndex === activeStepIndex) {
        div.classList.add('progress-bar__step--active');
    }
    div.append(`${i + 1}`);
    return div;
};

const label = (activeLabel, activeIndex, totalSteps) => {
    if (!activeLabel) {
        return document.createTextNode('');
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
};

export default function progressBar(steps, activeStepIndex) {
    const element = document.createElement('div');
    const totalSteps = Object.keys(steps).length;

    if (totalSteps === 0) {
        return document.createTextNode('');
    }

    const icons = Object.keys(steps).map((stepKey, i) => icon(i, stepKey, activeStepIndex));
    const currentStepLabel = label(steps[activeStepIndex], activeStepIndex, totalSteps);

    element.className = 'progress-bar';
    element.style.gridTemplateColumns = `repeat(${totalSteps}, var(--progress-step-icon-size))`;
    element.append(...icons, currentStepLabel);

    return element;
}

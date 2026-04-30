/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the script
const scriptContent = fs.readFileSync(path.resolve(__dirname, './common.js'), 'utf8');
eval(scriptContent);

describe('showTaunt', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllTimers();
    });

    it('should add a taunt element to the DOM with correct styles and text', () => {
        const msg = 'Test Taunt';
        const x = 100;
        const y = 200;

        showTaunt(msg, x, y);

        // Find the element
        const tauntElements = document.querySelectorAll('div');
        expect(tauntElements.length).toBe(1);
        const taunt = tauntElements[0];

        // Check text
        expect(taunt.innerText).toBe(msg);

        // Check styles
        expect(taunt.style.position).toBe('absolute');
        expect(taunt.style.left).toBe(`${x}px`);
        expect(taunt.style.top).toBe(`${y}px`);
        expect(taunt.style.color).toBe('red');
        expect(taunt.style.fontWeight).toBe('bold');
        expect(taunt.style.fontSize).toBe('24px');
        expect(taunt.style.pointerEvents).toBe('none');
        expect(taunt.style.animation).toContain('floatUp 1s ease-out forwards');
    });

    it('should remove the taunt element after 1 second', () => {
        showTaunt('Another Taunt', 50, 50);

        expect(document.querySelectorAll('div').length).toBe(1);

        // Advance timers by 999ms - element should still be there
        jest.advanceTimersByTime(999);
        expect(document.querySelectorAll('div').length).toBe(1);

        // Advance by 1 more ms - element should be removed
        jest.advanceTimersByTime(1);
        expect(document.querySelectorAll('div').length).toBe(0);
    });
});

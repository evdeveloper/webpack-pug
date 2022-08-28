import { fadeIn, fadeOut } from '@/js/common/plugins';

let alertMessagesInstance = null;

export class AlertMessages {
    constructor() {
        if (alertMessagesInstance) return alertMessagesInstance;

        this.node = createNode();
        this.wrapper = this.node.querySelector('.alert-messages__wrapper');

        this.init();

        alertMessagesInstance = this;
    }

    init() {
        document.body.append(this.node);
    }

    add(data) {
        const note = createNote(data);
        this.wrapper.append(note);

        fadeIn(note);

        setTimeout(() => {
            this.remove(note);
        }, 500);

        const noteCloseBtn = note.querySelector('.alert-messages__close');
        noteCloseBtn.addEventListener('click', () => this.remove(note), {
            once: true,
        });
    }

    remove(note) {
        fadeOut(note).then(() => note.remove());
    }
}

function createNode() {
    const template = `
        <div class='alert-messages'>
            <div class='alert-messages__wrapper'></div>
        </div>
    `;

    return getElFromString(template);
}

function createNote({ title, status, type = 'success' }) {
    const template = `
        <div class='alert-messages__note ${type}'>
            <button type='button' class='alert-messages__close'>
            <svg id="close" viewBox="0 0 14 14" aria-label="Иконка">
                <path d="M.408 11.998c-.378.387-.395 1.072.009 1.468.404.395 1.081.386 1.468.009l4.992-4.993 4.983 4.993c.396.386 1.073.395 1.468-.01.396-.403.404-1.071.009-1.467L8.345 7.006l4.992-4.984a1.048 1.048 0 00-.009-1.467 1.065 1.065 0 00-1.468-.01L6.877 5.539 1.885.546C1.498.168.812.15.417.555.021.959.03 1.635.408 2.014L5.4 7.006.408 11.998z"></path>
            </svg>
            </button>
            <div class='alert-messages__title'>${title}</div>
            <div class='alert-messages__status'>${status}</div>
        </div>
    `;

    return getElFromString(template);
}

function getElFromString(string) {
    const div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

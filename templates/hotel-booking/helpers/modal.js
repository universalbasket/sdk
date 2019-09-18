const modalSelector = '.sdk-app-bundle-layout-modal';

export default function create(body, { title = '', isLocked = false } = {}) {
    const container = wrap(body, title, isLocked);

    return {
        show({ hidden = false } = {}) {
            if (!container) {
                return;
            }

            if (hidden) {
                container.classList.add('modal-wrapper--hidden');
            } else {
                container.classList.remove('modal-wrapper--hidden');
            }

            const modal = document.querySelector(modalSelector);

            if (!modal.contains(container)) {
                modal.appendChild(container);
            }
        },
        close
    };
}

function close() {
    const el = document.querySelector(modalSelector);

    while (el && el.lastChild) {
        el.removeChild(el.lastChild);
    }
}

function wrap(details, title, isLocked) {
    if (!details) {
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'modal-wrapper';
    wrapper.innerHTML = `
        <div class="modal ${isLocked ? 'modal--locked' : ''}">
            <div class="modal__header">
                <h2 class="large"></h2>
            </div>
            <div class="modal__body"></div>
            <span class="modal__close"></span>
        </div>
        <div class="modal-wrapper__overlay"></div>
    `;

    wrapper.querySelector('h2').append(title);
    wrapper.querySelector('.modal__body').append(details);

    if (!isLocked) {
        wrapper.querySelector('.modal-wrapper__overlay').addEventListener('click', close, false);
        wrapper.querySelector('.modal__close').addEventListener('click', close, false);
    }

    return wrapper;
}

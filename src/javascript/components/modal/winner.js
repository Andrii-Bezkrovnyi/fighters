import { createElement } from '../../helpers/domHelper';
import { showModal } from './modal';

export function showWinnerModal(fighter) {
  const bodyElement = createWinnerBody(fighter);

  showModal({
    title: 'Winner',
    bodyElement,
  });
}

function createWinnerBody(fighter) {
  const bodyElement = createElement({
    tagName: 'div',
    className: 'modal-body winner-modal___body',
  });

  const image = createElement({
    tagName: 'img',
    className: 'winner-modal___image',
    attributes: {
      src: fighter.source,
      alt: fighter.name,
      title: fighter.name,
    },
  });

  const name = createElement({
    tagName: 'div',
    className: 'winner-modal___name',
  });

  name.innerText = fighter.name;
  bodyElement.append(image, name);

  return bodyElement;
}

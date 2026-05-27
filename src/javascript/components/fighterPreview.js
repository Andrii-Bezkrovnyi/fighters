import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (!fighter) {
    const placeholder = createElement({
      tagName: 'div',
      className: 'fighter-preview___placeholder',
    });

    placeholder.innerText = 'Select a fighter';
    fighterElement.append(placeholder);

    return fighterElement;
  }

  const image = createFighterImage(fighter);
  const details = createFighterDetails(fighter);
  fighterElement.append(image, details);

  return fighterElement;
}

function createFighterDetails(fighter) {
  const { name, health, attack, defense } = fighter;
  const details = createElement({
    tagName: 'div',
    className: 'fighter-preview___details',
  });

  const title = createElement({
    tagName: 'div',
    className: 'fighter-preview___name',
  });
  const stats = createElement({
    tagName: 'div',
    className: 'fighter-preview___stats',
  });

  title.innerText = name;
  stats.innerHTML = `
    <div><span>Health:</span> ${health}</div>
    <div><span>Attack:</span> ${attack}</div>
    <div><span>Defense:</span> ${defense}</div>
  `;

  details.append(title, stats);

  return details;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

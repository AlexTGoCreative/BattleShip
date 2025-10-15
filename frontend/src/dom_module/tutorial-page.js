import createElementWithClass from '../helper_module/create-element-with-class.js';
import HOME_ICON_SRC from '../images/home.svg';

export default function createTutorialPage() {
  const guideLines = [
    {
      header: 'Ship Placing',
      content:
        'Start by arranging your ships on the grid. You can choose specific coordinates for each ship or use the auto-placement option for a quick setup.',
    },

    {
      header: 'Taking Turn',
      content:
        'After ship placement, the game begins. On your turn, select a coordinate on the opponent&apos;s grid to launch an attack. The computer will then take its turn. This will continue until game is over',
    },

    {
      header: 'Hits and Misses',
      content:
        ' A <b>hit</b> is marked when your shot lands on an enemy ship. A <b>miss</b> indicates an empty space. - Each player&apos;s gameboard visually updates to reflect hits and misses. Hit is indicted by a red grid box. A miss indicated by a gray grid box.',
    },

    {
      header: 'Winning and Losing',
      content:
        'The game continues until one player sinks all of the opponent&apos;s ships. If you&apos;re the last one standing, you win!',
    },
  ];

  const tutorialPageContainer = createElementWithClass('div', [
    'tutorial-page',
    'd-flex__col',
    'centered_flex',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'd-flex__col',
    'padding_10',
    'gap_5',
  ]);

  const pageHeaderContainer = createElementWithClass('div', [
    'd-flex__row',
    'align-items__center',
    'justify-content__center',
  ]);

  const pageHeader = createElementWithClass('h1', [
    'text-align__center',
    'text-transform__capitalize',
    'fz_2r',
  ]);

  pageHeader.textContent = 'how to play';

  const tutorialContentContainer = createElementWithClass('div', [
    'd-flex__col',
    'align-items__center',
  ]);

  const tutorialList = createElementWithClass('ul', [
    'd-flex__col',
    'gap_1r',
    'padding_10',
    'tutorial-container',
    'align-items__center',
  ]);

  guideLines.forEach((help) => {
    const { header, content } = help;

    const li = createElementWithClass('li');
    const h2 = createElementWithClass('h2', [
      'text-transform__lowercase',
      'text-align__center',
      'fz_1-8r',
    ]);
    const p = createElementWithClass('p', ['fz_1-4r']);
    const container = createElementWithClass('article', [
      'd-flex__col',
      'gap_5',
    ]);

    h2.textContent = header;
    p.innerHTML = content;

    container.appendChild(h2);
    container.appendChild(p);

    li.appendChild(container);
    tutorialList.appendChild(li);
  });

  // Create go back button at the bottom
  const goBackBtn = createElementWithClass('button', [
    'btn',
    'tutorial-go-back-btn',
    'd-flex__row',
    'align-items__center',
    'justify-content__center',
    'gap_5',
    'cursor_pointer',
  ]);

  const backArrow = createElementWithClass('span');
  backArrow.textContent = '← ';
  
  const backText = createElementWithClass('span');
  backText.textContent = 'Go Back';

  goBackBtn.appendChild(backArrow);
  goBackBtn.appendChild(backText);

  pageHeaderContainer.appendChild(pageHeader);

  tutorialContentContainer.appendChild(tutorialList);
  tutorialContentContainer.appendChild(goBackBtn);

  genericContainer.appendChild(pageHeaderContainer);
  genericContainer.appendChild(tutorialContentContainer);

  tutorialPageContainer.appendChild(genericContainer);

  return { tutorialPageContainer, homeBtn: goBackBtn };
}

import createElementWithClass from '../helper_module/create-element-with-class.js';

export default function createAIDifficultyModal() {
  const modal = createElementWithClass('dialog', [
    'ai-difficulty-modal',
    'glass-card',
    'animate-scale-in'
  ]);

  const modalContent = createElementWithClass('div', [
    'modal-content',
    'padding_3r',
    'text-align__center'
  ]);

  const modalHeader = createElementWithClass('div', [
    'modal-header',
    'margin-bottom_2r'
  ]);

  const modalTitle = createElementWithClass('h2', [
    'modal-title',
    'text-gradient'
  ]);
  modalTitle.textContent = 'Choose AI Difficulty';

  const modalSubtitle = createElementWithClass('p', [
    'modal-subtitle',
    'text-muted'
  ]);
  modalSubtitle.textContent = 'Select your opponent\'s intelligence level';

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(modalSubtitle);

  const difficultyOptions = createElementWithClass('div', [
    'difficulty-options',
    'd-flex__col',
    'gap_1r',
    'margin-bottom_2r'
  ]);

  // Normal difficulty option
  const normalOption = createElementWithClass('button', [
    'difficulty-option',
    'btn-secondary',
    'btn-lg',
    'cursor_pointer',
    'd-flex',
    'align-items__center',
    'gap_1r',
    'padding_2r'
  ]);
  normalOption.dataset.difficulty = 'normal';

  const normalIcon = createElementWithClass('div', [
    'difficulty-icon'
  ]);
  normalIcon.textContent = '😊';

  const normalContent = createElementWithClass('div', [
    'difficulty-content',
    'text-left',
    'flex-grow'
  ]);

  const normalTitle = createElementWithClass('div', [
    'difficulty-title',
    'font-weight-600'
  ]);
  normalTitle.textContent = 'Normal';

  const normalDesc = createElementWithClass('div', [
    'difficulty-desc',
    'text-small',
    'text-muted'
  ]);
  normalDesc.textContent = 'Random targeting - Good for beginners';

  const normalStats = createElementWithClass('div', [
    'difficulty-stats',
    'text-tiny',
    'margin-top_05r'
  ]);
  normalStats.innerHTML = '⭐⭐⚪⚪⚪ Easy';

  normalContent.appendChild(normalTitle);
  normalContent.appendChild(normalDesc);
  normalContent.appendChild(normalStats);

  normalOption.appendChild(normalIcon);
  normalOption.appendChild(normalContent);

  // Hard difficulty option
  const hardOption = createElementWithClass('button', [
    'difficulty-option',
    'btn-secondary',
    'btn-lg',
    'cursor_pointer',
    'd-flex',
    'align-items__center',
    'gap_1r',
    'padding_2r'
  ]);
  hardOption.dataset.difficulty = 'hard';

  const hardIcon = createElementWithClass('div', [
    'difficulty-icon'
  ]);
  hardIcon.textContent = '🤖';

  const hardContent = createElementWithClass('div', [
    'difficulty-content',
    'text-left',
    'flex-grow'
  ]);

  const hardTitle = createElementWithClass('div', [
    'difficulty-title',
    'font-weight-600'
  ]);
  hardTitle.textContent = 'Hard';

  const hardDesc = createElementWithClass('div', [
    'difficulty-desc',
    'text-small',
    'text-muted'
  ]);
  hardDesc.textContent = 'Smart targeting - Hunts ships systematically';

  const hardStats = createElementWithClass('div', [
    'difficulty-stats',
    'text-tiny',
    'margin-top_05r'
  ]);
  hardStats.innerHTML = '⭐⭐⭐⭐⭐ Challenging';

  hardContent.appendChild(hardTitle);
  hardContent.appendChild(hardDesc);
  hardContent.appendChild(hardStats);

  hardOption.appendChild(hardIcon);
  hardOption.appendChild(hardContent);

  difficultyOptions.appendChild(normalOption);
  difficultyOptions.appendChild(hardOption);

  const modalActions = createElementWithClass('div', [
    'modal-actions',
    'd-flex',
    'gap_1r',
    'justify-content__center'
  ]);

  const cancelButton = createElementWithClass('button', [
    'btn-secondary',
    'cursor_pointer'
  ]);
  cancelButton.textContent = 'Cancel';

  modalActions.appendChild(cancelButton);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(difficultyOptions);
  modalContent.appendChild(modalActions);

  modal.appendChild(modalContent);

  // State management
  let selectedDifficulty = 'normal';

  // Event handlers
  const selectDifficulty = (difficulty) => {
    selectedDifficulty = difficulty;
    
    // Update visual selection
    difficultyOptions.querySelectorAll('.difficulty-option').forEach(option => {
      option.classList.remove('selected');
    });
    
    const selectedOption = difficultyOptions.querySelector(`[data-difficulty="${difficulty}"]`);
    selectedOption.classList.add('selected');
  };

  normalOption.addEventListener('click', () => {
    selectDifficulty('normal');
    // Start normal AI game
    window.dispatchEvent(new CustomEvent('startAIGameWithDifficulty', {
      detail: { difficulty: 'normal' }
    }));
    modal.close();
  });

  hardOption.addEventListener('click', () => {
    selectDifficulty('hard');
    // Start hard AI game
    window.dispatchEvent(new CustomEvent('startAIGameWithDifficulty', {
      detail: { difficulty: 'hard' }
    }));
    modal.close();
  });

  cancelButton.addEventListener('click', () => {
    modal.close();
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });

  // Keyboard navigation
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.close();
    }
  });

  // Initialize with normal selected
  selectDifficulty('normal');

  return {
    modal,
    show: () => {
      document.body.appendChild(modal);
      modal.showModal();
    },
    hide: () => {
      modal.close();
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    },
    getSelectedDifficulty: () => selectedDifficulty
  };
}

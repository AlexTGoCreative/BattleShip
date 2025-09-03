import createElementWithClass from '../helper_module/create-element-with-class.js';
import ACCOUNT_ICON_SRC from '../images/account.svg';

export default function createUserRegistration() {
  const registrationDialog = createElementWithClass('dialog', [
    'user-registration-dialog',
    'z_index_3'
  ]);

  const dialogContainer = createElementWithClass('div', [
    'dialog-content',
    'd-flex__col',
    'gap_2r',
    'padding_2r',
    'text-align__center'
  ]);

  // Header
  const header = createElementWithClass('div', [
    'registration-header',
    'd-flex__col',
    'gap_1r',
    'align-items__center'
  ]);

  const iconContainer = createElementWithClass('div', [
    'icon_container',
    'registration-icon'
  ]);

  const accountIcon = createElementWithClass('img', ['img']);
  accountIcon.src = ACCOUNT_ICON_SRC;
  accountIcon.alt = 'User Account';

  iconContainer.appendChild(accountIcon);

  const title = createElementWithClass('h1', [
    'dialog-header',
    'text-transform__capitalize'
  ]);
  title.textContent = 'Join the Battle';

  const subtitle = createElementWithClass('p', [
    'registration-subtitle',
    'text-transform__lowercase'
  ]);
  subtitle.textContent = 'Enter your username to start playing';

  header.appendChild(iconContainer);
  header.appendChild(title);
  header.appendChild(subtitle);

  // Form
  const form = createElementWithClass('form', [
    'registration-form',
    'd-flex__col',
    'gap_1r'
  ]);

  const inputContainer = createElementWithClass('div', [
    'input-container',
    'd-flex__col',
    'gap_5'
  ]);

  const usernameInput = createElementWithClass('input', [
    'username-input',
    'btn'  // Reuse button styling for consistency
  ]);
  usernameInput.type = 'text';
  usernameInput.placeholder = 'Enter your username...';
  usernameInput.maxLength = 20;
  usernameInput.required = true;

  const usernameHelp = createElementWithClass('small', [
    'username-help',
    'text-transform__lowercase'
  ]);
  usernameHelp.textContent = '2-20 characters, letters, numbers, - and _ only';

  const errorMessage = createElementWithClass('div', [
    'error-message',
    'hidden',
    'text-transform__lowercase'
  ]);

  const successMessage = createElementWithClass('div', [
    'success-message',
    'hidden',
    'text-transform__lowercase'
  ]);

  inputContainer.appendChild(usernameInput);
  inputContainer.appendChild(usernameHelp);
  inputContainer.appendChild(errorMessage);
  inputContainer.appendChild(successMessage);

  // Buttons
  const buttonContainer = createElementWithClass('div', [
    'd-flex__row',
    'gap_1r',
    'justify-content__center'
  ]);

  const joinButton = createElementWithClass('button', [
    'btn',
    'join-btn',
    'text-transform__capitalize'
  ]);
  joinButton.type = 'submit';
  joinButton.textContent = 'Join Game';

  const cancelButton = createElementWithClass('button', [
    'btn',
    'cancel-btn',
    'text-transform__capitalize'
  ]);
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';

  buttonContainer.appendChild(joinButton);
  buttonContainer.appendChild(cancelButton);

  form.appendChild(inputContainer);
  form.appendChild(buttonContainer);

  // Online users section
  const onlineUsersSection = createElementWithClass('div', [
    'online-users-section',
    'd-flex__col',
    'gap_1r'
  ]);

  const onlineUsersHeader = createElementWithClass('h3', [
    'online-users-header',
    'text-transform__lowercase'
  ]);
  onlineUsersHeader.textContent = 'Players Online';

  const onlineUsersList = createElementWithClass('div', [
    'online-users-list',
    'd-flex__row',
    'gap_5',
    'justify-content__center',
    'flex-wrap'
  ]);

  onlineUsersSection.appendChild(onlineUsersHeader);
  onlineUsersSection.appendChild(onlineUsersList);

  // Assemble dialog
  dialogContainer.appendChild(header);
  dialogContainer.appendChild(form);
  dialogContainer.appendChild(onlineUsersSection);
  registrationDialog.appendChild(dialogContainer);

  return {
    registrationDialog,
    form,
    usernameInput,
    joinButton,
    cancelButton,
    errorMessage,
    successMessage,
    onlineUsersList,
    onlineUsersHeader
  };
}

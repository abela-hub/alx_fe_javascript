// conflict-resolution.js
export const showConflictResolutionDialog = (conflicts, onResolve) => {
    const dialog = document.createElement('div');
    dialog.className = 'conflict-dialog';

    conflicts.forEach((conflict, index) => {
        const conflictElement = document.createElement('div');
        conflictElement.className = 'conflict';
        conflictElement.innerHTML = `
      <h3>Conflict in quote #${conflict.local.id}</h3>
      <div class="versions">
        <div class="version local">
          <h4>Your Version</h4>
          <p>${conflict.local.text}</p>
          <p>- ${conflict.local.author}</p>
        </div>
        <div class="version server">
          <h4>Server Version</h4>
          <p>${conflict.server.text}</p>
          <p>- ${conflict.server.author}</p>
        </div>
      </div>
      <div class="resolution-options">
        <button class="keep-local" data-index="${index}">Keep My Version</button>
        <button class="keep-server" data-index="${index}">Keep Server Version</button>
      </div>
    `;

        dialog.appendChild(conflictElement);
    });

    const closeButton = document.createElement('button');
    closeButton.className = 'close-dialog';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(dialog);
    });

    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);

    // Add event listeners for resolution buttons
    dialog.querySelectorAll('.keep-local').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            onResolve(index, 'local');
        });
    });

    dialog.querySelectorAll('.keep-server').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            onResolve(index, 'server');
        });
    });
};
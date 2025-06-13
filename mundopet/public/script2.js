const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

let overlay = document.getElementById('alertOverlay');
if (!overlay) {
  overlay = document.createElement('div');
  overlay.id = 'alertOverlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  
  overlay.style.display = 'none';
  document.body.appendChild(overlay);

  // Fechar alerta ao clicar no overlay
  overlay.addEventListener('click', closeAlert);
}

function closeAlert() {
  alertBox.style.opacity = '0';
  alertBox.style.transform = 'translate(-50%, -50%) scale(0.8)';
  overlay.style.opacity = '0';
  setTimeout(() => {
    alertBox.classList.add('hidden');
    overlay.style.display = 'none';
  }, 300);
}

document.getElementById('closeAlert').addEventListener('click', closeAlert);

function showAlert(message) {
  alertMessage.textContent = message;

  overlay.style.display = 'block';
  setTimeout(() => overlay.style.opacity = '1', 10);

  alertBox.classList.remove('hidden');
  alertBox.style.opacity = '0';
  alertBox.style.transform = 'translate(-50%, -50%) scale(0.8)';
  alertBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  setTimeout(() => {
    alertBox.style.opacity = '1';
    alertBox.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
}

document.getElementById('cadastroPetForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const cadastro = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    "pet-name": document.getElementById('pet-name').value.trim(),
    "pet-age": parseInt(document.getElementById('pet-age').value, 10),
    "pet-species": document.getElementById('pet-species').value,
    message: document.getElementById('message').value.trim()
  };

  // Validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cadastro.name || !emailRegex.test(cadastro.email) || !cadastro["pet-name"] || isNaN(cadastro["pet-age"]) || !cadastro["pet-species"]) {
    showAlert("Por favor, preencha todos os campos obrigatórios com informações válidas.");
    return;
  }

  fetch("http://localhost:3006/cadastro-pet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cadastro)
  })
  .then(async response => {
    const text = await response.text();
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        throw new Error(text);
      }
      throw new Error(errorData.message || errorData.error || 'Erro desconhecido');
    }
    return JSON.parse(text);
  })
  .then(data => {
    showAlert(data.message);
    this.reset();
  })
  .catch(error => {
    console.error(error);
    showAlert("Erro ao cadastrar pet: " + error.message);
  });
});












































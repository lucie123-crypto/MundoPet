 document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("loginForm");
      const alertBox = document.getElementById("alertBox");
      const alertMessage = document.getElementById("alertMessage");
      const alertButton = document.getElementById("alertButton");

      form.addEventListener("submit", loginUser);
      alertButton.addEventListener("click", () => {
        alertBox.style.display = "none";
        // Só redireciona para dashboard se a variável for true
        if (window.confirmLogin) {
          window.location.href = "Dashboardnova.html";
        }
      });

      function loginUser(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        fetch("http://localhost:3006/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                throw new Error(data.message || "Erro ao fazer login");
              });
            }
            return response.json();
          })
          .then((data) => {
            localStorage.setItem("usuarioLogado", JSON.stringify(data.user));
            window.confirmLogin = true; // Sinal para redirecionar após confirmação
            mostrarAlerta(data.message);
          })
          .catch((error) => {
            window.confirmLogin = false; // Não redireciona se deu erro
            mostrarAlerta(error.message || "Usuário ou senha inválidos.");
          });
      }

      function mostrarAlerta(mensagem) {
        alertMessage.textContent = mensagem;
        alertBox.style.display = "block";
      }
    });

// Mantém a função de confirmação como está
function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById("confirmModal");
    const text = document.getElementById("confirmText");
    const btnYes = document.getElementById("confirmYes");
    const btnNo = document.getElementById("confirmNo");

    text.textContent = message;
    modal.classList.add("show");

    const confirmHandler = () => {
        modal.classList.remove("show");
        onConfirm();
        cleanup();
    };

    const cancelHandler = () => {
        modal.classList.remove("show");
        cleanup();
    };

    function cleanup() {
        btnYes.removeEventListener("click", confirmHandler);
        btnNo.removeEventListener("click", cancelHandler);
    }

    btnYes.addEventListener("click", confirmHandler);
    btnNo.addEventListener("click", cancelHandler);
}

function registerUser(event) {
    event.preventDefault();

    const form = document.getElementById("registerForm");
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        showInfoModal("Por favor, preencha todos os campos.");
        return;
    }

    showConfirmModal(`Deseja cadastrar o usuário "${username}"?`, () => {
        fetch("http://localhost:3006/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao cadastrar usuário");
            return response.json();
        })
        .then(data => {
            form.reset(); // ← LIMPA o formulário
            showInfoModal(data.message);
        })
        .catch(error => {
            console.error(error);
            showInfoModal("Erro ao cadastrar o usuário. Tente novamente.");
        });
    });
}





function loadUsers() {
    fetch("http://localhost:3006/users")
    .then(response => {
        if (!response.ok) throw new Error("Erro ao buscar usuários");
        return response.json();
    })
    .then(data => {
        const userList = document.getElementById("userList");
        if (!userList) return;

        userList.innerHTML = "";
        data.forEach(user => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerHTML = `
                <div>
                    <strong>${user.username}</strong><br>
                    <small>ID: ${user.id}</small>
                </div>
            `;

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.style.backgroundColor = '#087375';
            btnExcluir.style.color = 'white';
            btnExcluir.onclick = () => {
                showConfirmModal(`Deseja excluir o usuário "${user.username}"?`, () => {
                    fetch(`http://localhost:3006/users/${user.id}`, { method: "DELETE" })
                    .then(res => {
                        if (!res.ok) throw new Error("Erro ao excluir usuário");
                        loadUsers(); // Recarrega após exclusão
                    })
                    .catch(err => {
                        console.error("Erro na exclusão:", err);
                        alert("Erro ao excluir usuário: " + err.message);
                    });
                });
            };

            listItem.appendChild(btnExcluir);
            userList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao carregar usuários.");
    });
}

function loadContatos() {
    fetch("http://localhost:3006/contato")
    .then(response => {
        if (!response.ok) throw new Error("Erro ao buscar contatos");
        return response.json();
    })
    .then(data => {
        const contatosList = document.getElementById('contatosList');
        if (!contatosList) return;

        contatosList.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
            agendamentosList.innerHTML = '<li class="list-group-item">Nenhum Contanto encontrado.</li>';
            return;
        }

        data.forEach(contato => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <h5>${contato.nome}</h5>
                <p>Email: ${contato.email}<br>
                Número: ${contato.numero}<br>
                Mensagem: ${contato.mensagem}<br>
                Enviado em: ${new Date(contato.data_envio).toLocaleString()}</p>
            `;

            // Criar botão excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.style.marginTop = '8px';
            btnExcluir.style.backgroundColor = '#087375'; 
            btnExcluir.style.color = 'white';              // texto branco
            btnExcluir.onclick = () => {
                showConfirmModal(`Deseja excluir o contato de "${contato.nome}"?`, () => {
                    fetch(`http://localhost:3006/contato/${contato.id}`, { method: 'DELETE' })
                    .then(res => {
                        if (!res.ok) throw new Error('Erro ao excluir contato');
                        loadContatos(); // Recarrega lista após exclusão
                    })
                    .catch(err => {
                        console.error('Erro na exclusão:', err);
                        alert('Erro ao excluir contato: ' + err.message);
                    });
                });
            };

            listItem.appendChild(btnExcluir);
            contatosList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao carregar contatos.");
    });
}

// Submissão do formulário de contato
function submitContato(event) {
    event.preventDefault();

    const contato = {
        nome: document.getElementById('nome').value,
        numero: document.getElementById('numero').value,
        email: document.getElementById('email').value,
        mensagem: document.getElementById('mensagem').value
    };

    // Verifica campos obrigatórios
    if (!contato.nome || !contato.numero || !contato.email || !contato.mensagem) {
        mostrarPopup("Todos os campos são obrigatórios.");
        return;
    }

    fetch("http://localhost:3006/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contato)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao registrar contato');
        return response.json();
    })
    .then(data => {
        mostrarPopup(data.message);
        // Redireciona após fechar o popup
        document.getElementById("closeAlert").onclick = function () {
            document.getElementById("alertBox").classList.remove("show");
            window.location.href = "Contato.html";
        };
    })
    .catch(error => {
        console.error(error);
        mostrarPopup("Erro ao registrar contato. Tente novamente.");
    });
}

// Função para exibir o popup
function mostrarPopup(mensagem) {
    const alertBox = document.getElementById("alertBox");
    const alertMessage = document.getElementById("alertMessage");

    alertMessage.textContent = mensagem;
    alertBox.classList.add("show");

    document.getElementById("closeAlert").onclick = function () {
        alertBox.classList.remove("show");
    };
}


// Detectar página atual e aplicar ações específicas
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("Login.html")) {
        document.getElementById("loginForm")?.addEventListener("submit", loginUser);
    }

    if (path.includes("Dashboardnova.html")) {
        document.getElementById("registerForm")?.addEventListener("submit", registerUser);
    }

    if (path.includes("Contato.html")) {
        document.getElementById("contatoForm")?.addEventListener("submit", submitContato);
    }

    if (path.includes("Dashboard.html")) {
        loadUsers();
        loadContatos();
    }
});


// Função para carregar os agendamentos do pet
function loadCadastroPet() {
    fetch("http://localhost:3006/cadastro-pet")
    .then(response => {
        if (!response.ok) throw new Error("Erro ao buscar agendamentos");
        return response.json();
    })
    .then(data => {
        const agendamentosList = document.getElementById('agendamentosList');
        if (!agendamentosList) return;

        agendamentosList.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            agendamentosList.innerHTML = '<li class="list-group-item">Nenhum agendamento encontrado.</li>';
            return;
        }

        data.forEach(agendamento => {
            const listItem = document.createElement('li');
            listItem.className = "list-group-item";
            listItem.innerHTML = `
                <h5>${agendamento.nome}</h5>
                <p>
                    Email: ${agendamento.email}<br>
                    Nome do Pet: ${agendamento["nome_pet"]}<br>
                    Idade do Pet: ${agendamento["idade_pet"]} anos<br>
                    Espécie: ${agendamento["especie_pet"]}<br>
                    Observações: ${agendamento.mensagem} <br>
                    Enviado em: ${agendamento.data_envio ? new Date(agendamento.data_envio).toLocaleString() : 'Data não disponível'}
                </p>
            `;

            // Botão de excluir com confirmação
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.style.marginTop = '8px';
            btnExcluir.style.backgroundColor = '#087375'; 
            btnExcluir.style.color = 'white';
            btnExcluir.onclick = () => {
                showConfirmModal(`Deseja excluir o agendamento de "${agendamento.nome}"?`, () => {
                    fetch(`http://localhost:3006/cadastro-pet/${agendamento.id}`, { method: 'DELETE' })
                    .then(res => {
                        if (!res.ok) throw new Error('Erro ao excluir agendamento');
                        loadCadastroPet(); // Recarrega após exclusão
                    })
                    .catch(err => {
                        console.error('Erro na exclusão:', err);
                        alert('Erro ao excluir agendamento: ' + err.message);
                    });
                });
            };

            listItem.appendChild(btnExcluir);
            agendamentosList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao carregar agendamentos.");
    });
}
  
  // Detectar página atual e aplicar ações específicas
  document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
  
    if (path.includes(".html")) {
        // Outras funções que você já tem
        loadUsers();
        loadContatos();
  
        // Aqui carregue também os agendamentos
        loadCadastroPet();
    }
  
    // Outros event listeners de formulário que você já tem ...
  });





  
  




















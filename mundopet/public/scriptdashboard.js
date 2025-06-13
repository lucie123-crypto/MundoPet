  function showConfirmModal(text, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const confirmText = document.getElementById('confirmText');
  const btnYes = document.getElementById('confirmYes');
  const btnNo = document.getElementById('confirmNo');

  confirmText.textContent = text;
  modal.classList.add('show');

  // Remove eventos antigos
  const cloneYes = btnYes.cloneNode(true);
  const cloneNo = btnNo.cloneNode(true);
  btnYes.parentNode.replaceChild(cloneYes, btnYes);
  btnNo.parentNode.replaceChild(cloneNo, btnNo);

  // Novos eventos
  cloneYes.onclick = () => {
    modal.classList.remove('show');
    onConfirm();
  };

  cloneNo.onclick = () => {
    modal.classList.remove('show');
  };
}



    function atualizarTotalConsultas() {
  fetch('http://localhost:3006/cadastro-pet') // ajuste para sua rota que retorna as consultas
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar consultas');
      return res.json();
    })
    .then(data => {
      // Supondo que 'data' seja um array de consultas
      const total = Array.isArray(data) ? data.length : 0;
      document.getElementById('totalConsultas').textContent = total;
    })
    .catch(err => {
      console.error(err);
    });
}
// Atualiza ao carregar a página
atualizarTotalConsultas();

// Atualiza a cada 30 segundos (30000ms)
setInterval(atualizarTotalConsultas, 30000);




    function atualizarTotalusers() {
  fetch('http://localhost:3006/users')
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar consultas');
      return res.json();
    })
    .then(data => {
      // Supondo que 'data' seja um array de consultas
      const total = Array.isArray(data) ? data.length : 0;
      document.getElementById('totalusers').textContent = total;
    })
    .catch(err => {
      console.error(err);
    });
}

atualizarTotalusers();
setInterval(atualizarTotalusers, 30000);



    function atualizarTotalcontato() {
  fetch('http://localhost:3006/contato')
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar consultas');
      return res.json();
    })
    .then(data => {
      // Supondo que 'data' seja um array de consultas
      const total = Array.isArray(data) ? data.length : 0;
      document.getElementById('totalcontato').textContent = total;
    })
    .catch(err => {
      console.error(err);
    });
}

atualizarTotalcontato();
setInterval(atualizarTotalcontato, 30000);



  function atualizarGrafico() {
    const totalContatos = parseInt(document.getElementById('totalcontato').textContent);
    const totalConsultas = parseInt(document.getElementById('totalConsultas').textContent);
    const totalCurriculos = parseInt(document.getElementById('totalCurriculos').textContent);
    const totalAdmins = parseInt(document.getElementById('totalusers').textContent);

    const ctx = document.getElementById('dashboardChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Contatos', 'Consultas', 'Currículos', 'Admins'],
        datasets: [{
          label: 'Total',
          data: [totalContatos, totalConsultas, totalCurriculos, totalAdmins],
          backgroundColor: [
            '#0d9488', '#3b82f6', '#f59e0b', '#8b5cf6'
          ]
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        }
      }
    });
  }

  // Aguarda os dados atualizarem antes de desenhar o gráfico
  window.addEventListener('load', () => {
    setTimeout(atualizarGrafico, 500); // tempo para garantir os dados em tempo real
  });

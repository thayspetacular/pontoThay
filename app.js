// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBfUraDoSlMGUxFNgW6_jNn27ZptegLDs",
    authDomain: "testethay2-cfc9f.firebaseapp.com",
    databaseURL: "https://testethay2-cfc9f-default-rtdb.firebaseio.com",
    projectId: "testethay2-cfc9f",
    storageBucket: "testethay2-cfc9f.appspot.com",
    messagingSenderId: "290387954938",
    appId: "1:290387954938:web:1793de0e2c9d06c4294d43"
}

   firebase.initializeApp(firebaseConfig); // Inicialize o Firebase
   const database = firebase.database(); // Inicialize o banco de dados
   const storage = firebase.storage(); // Inicialize o storage


/////////////////////////////////////////////////////////////////////

function enviarDadosParaFirebase() {
    const nome = document.getElementById('nome').value;
    const area = document.getElementById('area').value;
    const hora = document.getElementById('hora').value;
    const data = document.getElementById('data').value;
    const endereco = document.getElementById('endereco').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem

    if (imagem) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    nome:nome,
                    area:area,
                    hora:hora,
                    data:data,
                    endereco:endereco,
                    imagemURL: downloadURL // Salva a URL da imagem
                };
                database.ref('funcionarios').push(dados)
                .then(() => {
                    alert('Dados enviados com sucesso!');
                    document.getElementById('nome').value = '';
                    document.getElementById('area').value = '';
                    document.getElementById('hora').value = '';
                    document.getElementById('data').value = '';
                    document.getElementById('endereco').value = '';
                    document.getElementById('imagem').value = '';
                })
                .catch(error => {
                    console.error('Erro ao enviar os dados para o Realtime Database: ', error);
                    alert('Erro ao enviar os dados. Por favor, tente novamente.');
                });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
            alert('Erro ao enviar a imagem. Por favor, tente novamente.');
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}

   function consultarPontoPorNome() {
    const nome = document.getElementById('nomeConsulta').value.trim();
    const funcionariosRef = database.ref('funcionarios');
    funcionariosRef.orderByChild('nome').equalTo(nome).once('value', snapshot => {
    const data = snapshot.val();
    const lista = document.getElementById('listaFuncionarios');
    lista.innerHTML = ''; // Limpar lista anterior

    if (data) {
    Object.keys(data).forEach(key => {
    const funcionario = data[key];
    const item = document.createElement('li');
    item.innerHTML = `<p>Nome: ${funcionario.nome}, <p>Aréa em que trabalha: ${funcionario.area},<p>Hora: 
   ${funcionario.hora},<p>Data: ${funcionario.data},<P>Endereço: ${funcionario.endereco},Imagem: <img src="${funcionario.imagemURL}" alt="Imagem do funcionario" 
   style="width:100px; height:auto;">`;
    lista.appendChild(item);
    });
    } else {
    lista.innerHTML = '<li>Nenhum funcionario encontrado com esse nome.</li>';
    }
    }).catch(error => {
    console.error('Erro ao buscar funcionarios: ', error);
    });
   }
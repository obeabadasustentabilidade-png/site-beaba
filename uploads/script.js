// SEU LINK DO GOOGLE SHEETS (CSV)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/11shKzZzdTTp3XoR5ncbdtu5gJlYFWvS_h4gNG68uFKk/pub?output=csv'; 

document.addEventListener('DOMContentLoaded', () => {
    // Verifica em qual página estamos
    const homeList = document.getElementById('home-episodes-list');
    const fullList = document.getElementById('full-episodes-list');

    if (homeList) {
        // Se estiver na Home, carrega apenas 3
        fetchEpisodes(homeList, 3);
    } 
    
    if (fullList) {
        // Se estiver na página de Episódios, carrega tudo
        fetchEpisodes(fullList, null);
    }
});

async function fetchEpisodes(container, limit) {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        // Separa as linhas do CSV (pulando o cabeçalho)
        const rows = data.split('\n').slice(1);
        
        // Limpa o loader
        container.innerHTML = '';

        // Define quantos episódios mostrar
        const episodesToShow = limit ? rows.slice(0, limit) : rows;

        episodesToShow.forEach((row, index) => {
            // Divide as colunas (Ajuste conforme sua planilha: Data, Título, Link, Descrição)
            // Regex complexa para lidar com vírgulas dentro de aspas no CSV
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            
            if(columns.length < 2) return;

            const date = columns[0].replace(/"/g, '');
            const title = columns[1].replace(/"/g, '');
            const link = columns[2].replace(/"/g, '');
            // const desc = columns[3]... (se quiser usar)

            // Cria o HTML do Item da Lista
            const item = document.createElement('div');
            item.className = 'episode-item';
            
            // Se for página completa, mostra número real (Total - Index). Se for home, mostra #
            const epNum = limit ? '#' : `#${rows.length - index}`;

            item.innerHTML = `
                <div class="ep-number">${epNum}</div>
                <div class="ep-content">
                    <div class="ep-title">${title}</div>
                    <div class="ep-date">${date}</div>
                </div>
                <a href="${link}" target="_blank" class="ep-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 3H21V9" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 14L21 3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            `;

            container.appendChild(item);
        });

    } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p class="text-center">Não foi possível carregar os episódios.</p>';
    }
}
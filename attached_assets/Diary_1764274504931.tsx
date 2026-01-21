
import React, { useState } from 'react';
import { DiaryEntry } from '../types';

interface DiaryProps {
  entries: DiaryEntry[];
  onDeleteEntry: (id: string) => void;
}

const emotionColors: { [key: string]: { background: string, color: string } } = {
  Alegria: { background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }, // indigo
  Tristeza: { background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }, // blue
  Raiva: { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }, // red
  Medo: { background: 'rgba(147, 51, 234, 0.15)', color: '#a78bfa' }, // purple
  Surpresa: { background: 'rgba(20, 184, 166, 0.15)', color: '#5eead4' }, // teal
  Amor: { background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }, // pink
  Ansiedade: { background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c' }, // orange
  Neutro: { background: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8' }, // slate
};

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const Diary: React.FC<DiaryProps> = ({ entries, onDeleteEntry }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleDeleteClick = (entryId: string) => {
    if (window.confirm("Tem certeza de que deseja excluir esta anotação do diário?")) {
        onDeleteEntry(entryId);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (!startDate && !endDate) return true;
    const entryDate = parseDate(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
      start.setHours(0, 0, 0, 0);
      if (entryDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setMinutes(end.getMinutes() + end.getTimezoneOffset());
      end.setHours(0, 0, 0, 0);
      if (entryDate > end) return false;
    }
    return true;
  }).sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());


  if (entries.length === 0) {
    return (
      <div className="diary-view">
        <div className="inner-container">
            <h2 className="diary-title">Seu Diário Emocional</h2>
            <div className="empty-diary">
                <p>Seu diário emocional está vazio.</p>
                <p>Inicie uma conversa e eu ajudarei você a acompanhar seus sentimentos ao longo do tempo.</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diary-view">
      <div className="inner-container">
        <h2 className="diary-title">Seu Diário Emocional</h2>

        <div className="filter-box">
            <div className="filter-group">
                <label htmlFor="startDate">Data de Início</label>
                <input 
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{colorScheme: 'dark'}}
                />
            </div>
            <div className="filter-group">
                <label htmlFor="endDate">Data Final</label>
                <input 
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{colorScheme: 'dark'}}
                />
            </div>
            <button 
                onClick={handleClearFilter}
                className="clear-btn"
                disabled={!startDate && !endDate}
            >
                Limpar
            </button>
        </div>

        {filteredEntries.length > 0 ? filteredEntries.map(entry => (
          <div key={entry.id} className="diary-entry">
            <div className="entry-header">
              <span 
                className="emotion-tag" 
                style={emotionColors[entry.emotion] || emotionColors['Neutro']}
              >
                {entry.emotion}
              </span>
              <span className="entry-date">{entry.date}</span>
            </div>
            <p className="entry-summary">{entry.summary}</p>
            <details>
                <summary>Ver anotação original</summary>
                <p className="original-text">"{entry.originalText}"</p>
            </details>
            <button
                onClick={() => handleDeleteClick(entry.id)}
                className="delete-entry-btn"
                aria-label="Deletar entrada"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
          </div>
        )) : (
            <div className="empty-diary">
                <p>Nenhuma entrada encontrada para o período selecionado.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Diary;
import React, { useState, useEffect } from 'react';

const App = () => {
    // Состояние игры
    const [gameState, setGameState] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedField, setSelectedField] = useState('4x4');
    const [leaderboard, setLeaderboard] = useState([]);
    const [showRules, setShowRules] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);

    // Инициализация музыки
    useEffect(() => {
        const audio = new Audio('/music/game-bg.mp3');
        audio.loop = true;

        // Загрузка состояния музыки
        VK.Storage.get('music_playing').then(state => {
            if (state === '1') {
                audio.play();
                setMusicPlaying(true);
            }
        }).catch(err => console.error('Ошибка загрузки музыки:', err));
    }, []);

    // Загрузка сохраненной игры
    useEffect(() => {
        VK.Storage.get('figures_game').then(savedData => {
            if (savedData) {
                setGameState(JSON.parse(savedData));
                setIsPlaying(true);
            }
        }).catch(err => console.error('Ошибка загрузки игры:', err));
    }, []);

    // Сохранение игры
    const saveGame = (state) => {
        VK.Storage.set('figures_game', JSON.stringify(state))
            .then(() => console.log('Игра сохранена'))
            .catch(err => console.error('Ошибка сохранения:', err));
    };

    // Получение рейтинга
    const fetchLeaderboard = async () => {
        try {
            const response = await VK.Api.call('vkapps.getLeaderboard', {
                application_id: '53485219',
                score_type: 'highscore',
                limit: 100
            });

            if (response && response.response) {
                setLeaderboard(response.response);
            }
        } catch (error) {
            console.error('Ошибка получения рейтинга:', error);
        }
    };

    // Обработка ходов
    const handleMove = (direction) => {
        // Логика игры здесь
        const newState = { ...gameState }; // Пример - замените на реальную логику

        // Сохраняем после каждого хода
        saveGame(newState);

        // Обновляем состояние
        setGameState(newState);
    };

    // Переключение музыки
    const toggleMusic = () => {
        const audio = new Audio('/music/game-bg.mp3');
        audio.loop = true;

        if (musicPlaying) {
            audio.pause();
            setMusicPlaying(false);
            VK.Storage.set('music_playing', '0');
        } else {
            audio.play();
            setMusicPlaying(true);
            VK.Storage.set('music_playing', '1');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            {!isPlaying ? (
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-center mb-6 text-white">中凵⺁丫尸Ђ丨</h1>

                    {/* Кнопка продолжить */}
                    {gameState && (
                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mb-6 transition-colors"
                            onClick={() => setIsPlaying(true)}
                        >
                            ПРОДОЛЖИТЬ
                        </button>
                    )}

                    {/* Кнопки выбора поля */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {['4x4', '5x5', '6x6'].map(size => (
                            <button
                                key={size}
                                className={`py-3 rounded-lg transition-colors ${selectedField === size
                                        ? 'bg-blue-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                                onClick={() => {
                                    setSelectedField(size);
                                    // Инициализация новой игры
                                    setGameState(initializeGame(size));
                                }}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {/* Кнопки меню */}
                    <div className="flex justify-around mb-6">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                            onClick={fetchLeaderboard}
                        >
                            РЕЙТИНГ
                        </button>
                        <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                            onClick={() => setShowRules(true)}
                        >
                            ПРАВИЛА
                        </button>
                    </div>

                    {/* Кнопка музыки */}
                    <button
                        className={`mt-4 self-end p-2 rounded-full ${musicPlaying ? 'bg-red-500' : 'bg-gray-700'
                            }`}
                        onClick={toggleMusic}
                    >
                        {musicPlaying ? '🔊' : '🔇'}
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md">
                    {/* Игровое поле */}
                    <div className="grid grid-cols-4 gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${gameState.size}, 1fr)` }}>
                        {gameState.board.map((row, i) =>
                            row.map((cell, j) => (
                                <div
                                    key={`${i}-${j}`}
                                    className="w-16 h-16 bg-gray-800 border border-gray-700 flex items-center justify-center text-white text-xl font-bold"
                                >
                                    {cell ? cell.symbol : ''}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex justify-around mb-6">
                        <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg" onClick={() => handleMove('left')}>
                            ←
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg" onClick={() => handleMove('up')}>
                            ↑
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg" onClick={() => handleMove('right')}>
                            →
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg" onClick={() => handleMove('down')}>
                            ↓
                        </button>
                    </div>
                </div>
            )}

            {/* Рейтинг */}
            {leaderboard.length > 0 && !isPlaying && (
                <div className="mt-8 w-full max-w-md bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-3 text-white">ТОП-ИГРОКИ</h2>
                    <div className="space-y-2">
                        {leaderboard.slice(0, 10).map((player, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-gray-300">{index + 1}</span>
                                <img
                                    src={player.user.photo_100}
                                    alt={player.user.first_name}
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <span className="text-white">{player.user.first_name}</span>
                                <span className="text-green-400 font-bold">{player.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Правила */}
            {showRules && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-white">Правила игры</h2>
                        <p className="text-white mb-4">Слияйте фигуры одинакового типа, чтобы получить более крупные фигуры.</p>
                        <p className="text-white mb-4">Цель - набрать максимально возможный счёт.</p>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                            onClick={() => setShowRules(false)}
                        >
                            Понятно
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Инициализация новой игры
const initializeGame = (size) => {
    return {
        size,
        board: Array(size).fill().map(() => Array(size).fill(null)),
        score: 0,
        gameOver: false
    };
};

export default App;

import { Reward } from './types';

export const REWARDS: Reward[] = [
    { level: 2, description: "Możliwość usuwania zadań", type: "taskDelete" },
    { level: 3, description: "Edytowanie zadań", type: "taskEdit" },
    { level: 4, description: "Licznik ukończonych zadań" },
    { level: 5, description: "Poziomy trudności zadań" },
    { level: 6, description: "Odznaki za aktywność" },
    { level: 7, description: "Avatar postaci" },
    { level: 8, description: "Personalizacja avatara" },
    { level: 9, description: "Odblokowanie paska postępu EXP", type: "expProgressBar" },
    { level: 10, description: "Wybór motywu aplikacji (jasny/ciemny)" },
    { level: 11, description: "Grupa zadań: Sprzątanie kuchni", type: "taskGroupKitchen" },
    { level: 12, description: "Zadania cykliczne" },
    { level: 13, description: "Grupa zadań: Sprzątanie łazienki", type: "taskGroupBathroom" },
    { level: 14, description: "Animacja i dźwięk przy awansie" },
    { level: 15, description: "Grupa zadań: Sprzątanie sypialni", type: "taskGroupBedroom" },
    { level: 17, description: "Tworzenie własnych grup zadań", type: "customTaskGroups" },
    { level: 20, description: "Tryb Ekspert: statystyki i wykresy" },
    { level: 23, description: "Ograniczenia czasowe w zadaniach (data zakończenia lub czas trwania)", type: "taskTimeLimit" },
    { level: 30, description: "Powiadomienia o kończącym się czasie zadania", type: "taskTimeNotifications" },
];